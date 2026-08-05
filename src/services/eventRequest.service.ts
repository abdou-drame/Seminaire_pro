import { prisma } from "../config/db";
import { CreateEventRequestInput, SendMessageInput } from "../dtos";

export class EventRequestService {
  /**
   * Creates a new Request for Quote (RFQ) and targets specified hotels.
   */
  static async create(input: CreateEventRequestInput, organizationId: string) {
    const referenceNumber = `RFQ-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;

    return await prisma.$transaction(async (tx) => {
      const eventRequest = await tx.eventRequest.create({
        data: {
          referenceNumber,
          organizationId,
          title: input.title,
          eventType: input.eventType,
          startDate: new Date(input.startDate),
          endDate: new Date(input.endDate),
          participantCount: input.participantCount,
          bedroomCount: input.bedroomCount || 0,
          budgetLimitCfa: input.budgetLimitCfa,
          preferredCity: input.preferredCity,
          status: "SENT",
          responseDeadline: new Date(input.responseDeadline),
          specialRequests: input.specialRequests,
          targets: {
            createMany: {
              data: input.targetEstablishmentIds.map((establishmentId) => ({
                establishmentId,
              })),
            },
          },
        },
        include: {
          targets: true,
        },
      });

      // Audit Log
      await tx.auditLog.create({
        data: {
          action: "CREATE_RFQ",
          entity: "EventRequest",
          entityId: eventRequest.id,
          payloadAfter: JSON.stringify({ referenceNumber, targetCount: input.targetEstablishmentIds.length }),
        },
      });

      return eventRequest;
    });
  }

  /**
   * Lists RFQs belonging to an organization.
   */
  static async listByOrganization(organizationId: string, status?: string) {
    const whereClause: any = { organizationId };
    if (status) {
      whereClause.status = status;
    }

    return await prisma.eventRequest.findMany({
      where: whereClause,
      include: {
        targets: {
          include: {
            eventRequest: false,
          },
        },
        quotes: {
          select: { id: true, quoteNumber: true, totalAmountCfa: true, status: true, establishmentId: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Gets RFQ details with targeted hotels and submitted quotes.
   */
  static async getById(id: string) {
    const rfq = await prisma.eventRequest.findUnique({
      where: { id },
      include: {
        organization: { select: { id: true, legalName: true, logoUrl: true } },
        targets: true,
        quotes: {
          include: {
            establishment: { select: { id: true, name: true, city: true, standingStars: true } },
          },
        },
      },
    });

    if (!rfq) {
      throw new Error("Demande d'événement non trouvée.");
    }

    return rfq;
  }

  /**
   * Sends automatic reminder to targeted hotels that have not yet responded.
   */
  static async sendReminder(id: string) {
    const rfq = await prisma.eventRequest.findUnique({
      where: { id },
      include: {
        targets: true,
        quotes: { select: { establishmentId: true } },
      },
    });

    if (!rfq) {
      throw new Error("Demande d'événement non trouvée.");
    }

    const respondedHotelIds = rfq.quotes.map((q) => q.establishmentId);
    const pendingHotelIds = rfq.targets
      .map((t) => t.establishmentId)
      .filter((hotelId) => !respondedHotelIds.includes(hotelId));

    // Audit Log for system reminder
    await prisma.auditLog.create({
      data: {
        action: "SEND_RFQ_REMINDER",
        entity: "EventRequest",
        entityId: id,
        payloadAfter: JSON.stringify({ pendingHotelIds }),
      },
    });

    return {
      message: `Relances envoyées avec succès à ${pendingHotelIds.length} établissement(s).`,
      pendingHotelIds,
    };
  }

  /**
   * Fetches messages in the internal discussion thread for an event request.
   */
  static async getMessages(eventRequestId: string) {
    return await prisma.message.findMany({
      where: { eventRequestId },
      include: {
        sender: {
          select: { id: true, firstName: true, lastName: true, email: true, globalRole: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });
  }

  /**
   * Sends a message into the internal discussion thread.
   */
  static async sendMessage(eventRequestId: string, senderId: string, input: SendMessageInput) {
    return await prisma.message.create({
      data: {
        eventRequestId,
        senderId,
        content: input.content,
        attachmentUrl: input.attachmentUrl,
      },
      include: {
        sender: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });
  }

  /**
   * Generates a comparative matrix of received quotes for an RFQ.
   */
  static async generateComparisonMatrix(eventRequestId: string) {
    const rfq = await prisma.eventRequest.findUnique({
      where: { id: eventRequestId },
      include: {
        quotes: {
          include: {
            establishment: {
              select: { name: true, city: true, standingStars: true },
            },
          },
        },
      },
    });

    if (!rfq) {
      throw new Error("Demande d'événement non trouvée.");
    }

    const totalParticipants = rfq.participantCount;

    const comparativeMatrix = rfq.quotes.map((quote) => {
      const totalCost = Number(quote.totalAmountCfa);
      const costPerParticipant = totalCost / totalParticipants;

      return {
        quoteId: quote.id,
        quoteNumber: quote.quoteNumber,
        hotelName: quote.establishment.name,
        city: quote.establishment.city,
        standingStars: quote.establishment.standingStars,
        roomAmountCfa: quote.roomAmountCfa,
        bedroomAmountCfa: quote.bedroomAmountCfa,
        cateringAmountCfa: quote.cateringAmountCfa,
        discountCfa: quote.discountCfa,
        totalAmountCfa: quote.totalAmountCfa,
        costPerParticipantCfa: Math.round(costPerParticipant),
        validUntil: quote.validUntil,
        status: quote.status,
      };
    });

    return {
      rfqReference: rfq.referenceNumber,
      rfqTitle: rfq.title,
      participantCount: totalParticipants,
      matrix: comparativeMatrix,
    };
  }
}

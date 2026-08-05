import { prisma } from "../config/db";
import { CreateQuoteInput } from "../dtos";

export class QuoteService {
  /**
   * Submits an official commercial quote (devis) for an RFQ.
   */
  static async createQuote(input: CreateQuoteInput, establishmentId: string) {
    const quoteNumber = `DEV-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;

    const roomAmount = Number(input.roomAmountCfa);
    const bedroomAmount = Number(input.bedroomAmountCfa);
    const cateringAmount = Number(input.cateringAmountCfa);
    const discount = Number(input.discountCfa || 0);

    const totalAmountCfa = roomAmount + bedroomAmount + cateringAmount - discount;

    if (totalAmountCfa < 0) {
      throw new Error("Le montant total du devis ne peut pas être négatif.");
    }

    return await prisma.$transaction(async (tx) => {
      const rfq = await tx.eventRequest.findUnique({
        where: { id: input.eventRequestId },
      });

      if (!rfq) {
        throw new Error("Demande d'événement non trouvée.");
      }

      const quote = await tx.quote.create({
        data: {
          quoteNumber,
          eventRequestId: input.eventRequestId,
          establishmentId,
          roomAmountCfa: roomAmount,
          bedroomAmountCfa: bedroomAmount,
          cateringAmountCfa: cateringAmount,
          discountCfa: discount,
          totalAmountCfa,
          validUntil: new Date(input.validUntil),
          status: "PENDING",
          notes: input.notes,
        },
        include: {
          establishment: { select: { id: true, name: true, city: true } },
          eventRequest: { select: { id: true, referenceNumber: true, title: true } },
        },
      });

      // Audit Log
      await tx.auditLog.create({
        data: {
          action: "CREATE_QUOTE",
          entity: "Quote",
          entityId: quote.id,
          payloadAfter: JSON.stringify({ quoteNumber, totalAmountCfa, validUntil: input.validUntil }),
        },
      });

      return quote;
    });
  }

  /**
   * Fetches all quotes received by an organization across its RFQs.
   */
  static async getReceivedQuotes(organizationId: string) {
    return await prisma.quote.findMany({
      where: {
        eventRequest: {
          organizationId,
        },
      },
      include: {
        establishment: { select: { id: true, name: true, city: true, standingStars: true } },
        eventRequest: { select: { id: true, referenceNumber: true, title: true, participantCount: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Accepts a quote and moves RFQ status to IN_PROGRESS.
   */
  static async acceptQuote(quoteId: string, userId: string) {
    return await prisma.$transaction(async (tx) => {
      const quote = await tx.quote.findUnique({
        where: { id: quoteId },
        include: { eventRequest: true },
      });

      if (!quote) {
        throw new Error("Devis non trouvé.");
      }

      if (quote.status !== "PENDING") {
        throw new Error(`Le devis est déjà dans le statut : ${quote.status}`);
      }

      const updatedQuote = await tx.quote.update({
        where: { id: quoteId },
        data: { status: "ACCEPTED" },
      });

      // Mark other quotes for the same RFQ as SUPERSEDED
      await tx.quote.updateMany({
        where: {
          eventRequestId: quote.eventRequestId,
          id: { not: quoteId },
        },
        data: { status: "SUPERSEDED" },
      });

      // Audit Log
      await tx.auditLog.create({
        data: {
          userId,
          action: "ACCEPT_QUOTE",
          entity: "Quote",
          entityId: quoteId,
          payloadAfter: JSON.stringify({ status: "ACCEPTED" }),
        },
      });

      return updatedQuote;
    });
  }

  /**
   * Rejects a quote with optional notes.
   */
  static async rejectQuote(quoteId: string, userId: string, notes?: string) {
    return await prisma.$transaction(async (tx) => {
      const quote = await tx.quote.findUnique({ where: { id: quoteId } });

      if (!quote) {
        throw new Error("Devis non trouvé.");
      }

      const updatedQuote = await tx.quote.update({
        where: { id: quoteId },
        data: {
          status: "REJECTED",
          notes: notes ? `${quote.notes || ''}\n[Motif de rejet]: ${notes}` : quote.notes,
        },
      });

      // Audit Log
      await tx.auditLog.create({
        data: {
          userId,
          action: "REJECT_QUOTE",
          entity: "Quote",
          entityId: quoteId,
          payloadAfter: JSON.stringify({ status: "REJECTED", notes }),
        },
      });

      return updatedQuote;
    });
  }
}

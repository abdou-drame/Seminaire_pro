import { prisma } from "../config/db";
import { HoldOptionInput, SubmitApprovalInput } from "../dtos";

export class ReservationService {
  /**
   * Holds a temporary option on a quote and meeting room.
   * Strictly enforces Anti-Double Booking Rule #2.
   */
  static async holdOption(input: HoldOptionInput, organizationId: string) {
    const quote = await prisma.quote.findUnique({
      where: { id: input.quoteId },
      include: { eventRequest: true },
    });

    if (!quote) {
      throw new Error("Devis non trouvé.");
    }

    const startDate = new Date(input.startDate);
    const endDate = new Date(input.endDate);

    // ANTI-DOUBLE BOOKING CHECK: Lock transaction
    return await prisma.$transaction(async (tx) => {
      if (input.meetingRoomId) {
        const overlapping = await tx.reservation.findFirst({
          where: {
            meetingRoomId: input.meetingRoomId,
            status: {
              in: ["OPTION_HELD", "CONFIRMED", "DEPOSIT_PAID", "FULLY_PAID"],
            },
            AND: [
              { startDate: { lt: endDate } },
              { endDate: { gt: startDate } },
            ],
          },
        });

        if (overlapping) {
          throw new Error("La salle sélectionnée est déjà sous option ou réservée pour ces dates.");
        }
      }

      const optionExpiry = new Date();
      optionExpiry.setHours(optionExpiry.getHours() + (input.optionDurationHours || 48));

      const bookingNumber = `RES-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;
      const totalPrice = Number(quote.totalAmountCfa);
      const depositPrice = totalPrice * 0.3; // 30% required deposit

      const reservation = await tx.reservation.create({
        data: {
          bookingNumber,
          organizationId,
          establishmentId: quote.establishmentId,
          eventRequestId: quote.eventRequestId,
          quoteId: quote.id,
          meetingRoomId: input.meetingRoomId,
          startDate,
          endDate,
          totalPriceCfa: totalPrice,
          depositPriceCfa: depositPrice,
          status: "OPTION_HELD",
          optionExpiresAt: optionExpiry,
        },
        include: {
          establishment: { select: { name: true, city: true, phone: true } },
          quote: { select: { quoteNumber: true, totalAmountCfa: true } },
        },
      });

      // Audit Log
      await tx.auditLog.create({
        data: {
          action: "HOLD_OPTION",
          entity: "Reservation",
          entityId: reservation.id,
          payloadAfter: JSON.stringify({ bookingNumber, status: "OPTION_HELD", optionExpiresAt: optionExpiry }),
        },
      });

      return reservation;
    });
  }

  /**
   * Lists reservations for an organization or establishment context.
   */
  static async list(params: { organizationId?: string; establishmentId?: string; status?: string }) {
    const whereClause: any = {};
    if (params.organizationId) whereClause.organizationId = params.organizationId;
    if (params.establishmentId) whereClause.establishmentId = params.establishmentId;
    if (params.status) whereClause.status = params.status;

    return await prisma.reservation.findMany({
      where: whereClause,
      include: {
        organization: { select: { legalName: true } },
        establishment: { select: { name: true, city: true } },
        quote: { select: { quoteNumber: true } },
        meetingRoom: { select: { name: true } },
        approvals: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Gets details of a reservation.
   */
  static async getById(id: string) {
    const reservation = await prisma.reservation.findUnique({
      where: { id },
      include: {
        organization: true,
        establishment: true,
        eventRequest: true,
        quote: true,
        meetingRoom: true,
        approvals: {
          include: {
            approver: { select: { firstName: true, lastName: true, email: true } },
          },
        },
        invoices: true,
        payments: true,
      },
    });

    if (!reservation) {
      throw new Error("Réservation non trouvée.");
    }

    return reservation;
  }

  /**
   * Multi-level internal approval sign-off by organization approver.
   */
  static async approve(input: SubmitApprovalInput, approverId: string) {
    return await prisma.$transaction(async (tx) => {
      const reservation = await tx.reservation.findUnique({
        where: { id: input.reservationId },
      });

      if (!reservation) {
        throw new Error("Réservation non trouvée.");
      }

      await tx.reservationApproval.create({
        data: {
          reservationId: input.reservationId,
          approverId,
          level: input.level,
          action: input.action,
          comments: input.comments,
        },
      });

      if (input.action === "REJECTED") {
        await tx.reservation.update({
          where: { id: input.reservationId },
          data: {
            status: "CANCELLED",
            cancelledReason: `Rejeté au niveau de validation ${input.level}: ${input.comments || 'Sans commentaire'}`,
          },
        });
      } else if (input.action === "APPROVED" && input.level >= 2) {
        // High-level approval advances status to CONFIRMED
        await tx.reservation.update({
          where: { id: input.reservationId },
          data: { status: "CONFIRMED" },
        });
      }

      // Audit Log
      await tx.auditLog.create({
        data: {
          userId: approverId,
          action: `RESERVATION_APPROVAL_L${input.level}`,
          entity: "Reservation",
          entityId: input.reservationId,
          payloadAfter: JSON.stringify({ action: input.action, level: input.level }),
        },
      });

      return { reservationId: input.reservationId, action: input.action, level: input.level };
    });
  }

  /**
   * Cancels a reservation.
   */
  static async cancel(reservationId: string, userId: string, reason?: string) {
    return await prisma.$transaction(async (tx) => {
      const reservation = await tx.reservation.findUnique({
        where: { id: reservationId },
      });

      if (!reservation) {
        throw new Error("Réservation non trouvée.");
      }

      const updated = await tx.reservation.update({
        where: { id: reservationId },
        data: {
          status: "CANCELLED",
          cancelledReason: reason || "Annulation demandée par l'utilisateur.",
        },
      });

      // Audit Log
      await tx.auditLog.create({
        data: {
          userId,
          action: "CANCEL_RESERVATION",
          entity: "Reservation",
          entityId: reservationId,
          payloadAfter: JSON.stringify({ status: "CANCELLED", reason }),
        },
      });

      return updated;
    });
  }
}

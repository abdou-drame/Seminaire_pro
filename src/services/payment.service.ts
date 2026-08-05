import { prisma } from "../config/db";
import { InitiatePaymentInput } from "../dtos";

export class PaymentService {
  /**
   * Initiates a payment transaction (Mobile Money, Card, Transfer).
   */
  static async initiatePayment(input: InitiatePaymentInput, userId: string) {
    const reservation = await prisma.reservation.findUnique({
      where: { id: input.reservationId },
      include: { establishment: true },
    });

    if (!reservation) {
      throw new Error("Réservation non trouvée.");
    }

    const transactionRef = `PAY-${Date.now().toString().slice(-8)}`;

    return await prisma.$transaction(async (tx) => {
      const payment = await tx.payment.create({
        data: {
          transactionRef,
          reservationId: input.reservationId,
          amountCfa: input.amountCfa,
          method: input.method,
          status: "PENDING",
        },
      });

      // Audit Log
      await tx.auditLog.create({
        data: {
          userId,
          action: "INITIATE_PAYMENT",
          entity: "Payment",
          entityId: payment.id,
          payloadAfter: JSON.stringify({ transactionRef, amountCfa: input.amountCfa, method: input.method }),
        },
      });

      // Simulation response for Payment Gateway Checkout
      return {
        payment,
        paymentUrl: `https://checkout.seminairepro.sn/pay/${transactionRef}`,
        checkoutInstruction: `Effectuez votre paiement via ${input.method} en validant la demande sur votre téléphone (${input.customerPhone || 'numéro associé'}).`,
      };
    });
  }

  /**
   * Processes gateway webhooks (Wave / Orange Money callback).
   * Automatically calculates platform commissions and updates reservation status.
   */
  static async handleWebhook(transactionRef: string, status: "SUCCESS" | "FAILED", providerRawData?: any) {
    const payment = await prisma.payment.findUnique({
      where: { transactionRef },
      include: {
        reservation: {
          include: { establishment: true },
        },
      },
    });

    if (!payment) {
      throw new Error("Transaction introuvable.");
    }

    if (payment.status === "SUCCESS") {
      return { message: "Paiement déjà validé." };
    }

    return await prisma.$transaction(async (tx) => {
      const updatedPayment = await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: status === "SUCCESS" ? "SUCCESS" : "FAILED",
          paidAt: status === "SUCCESS" ? new Date() : null,
          providerRaw: JSON.stringify(providerRawData || {}),
        },
      });

      if (status === "SUCCESS") {
        const totalReservationPrice = Number(payment.reservation.totalPriceCfa);
        const amountPaid = Number(payment.amountCfa);

        // Update Reservation Status
        const newResStatus = amountPaid >= totalReservationPrice ? "FULLY_PAID" : "DEPOSIT_PAID";

        await tx.reservation.update({
          where: { id: payment.reservationId },
          data: { status: newResStatus },
        });

        // Automatic Platform Commission Calculation based on Hotel Subscription Tier
        const tier = payment.reservation.establishment.subscriptionTier;
        const commissionRate = tier === "PREMIUM" ? 0.05 : tier === "PROFESSIONNELLE" ? 0.08 : 0.10; // 5%, 8%, 10%
        const commissionAmount = amountPaid * commissionRate;

        await tx.commission.upsert({
          where: { reservationId: payment.reservationId },
          update: { amountCfa: commissionAmount },
          create: {
            reservationId: payment.reservationId,
            establishmentId: payment.reservation.establishmentId,
            ratePercentage: commissionRate * 100,
            amountCfa: commissionAmount,
            isPaidToPlatform: false,
          },
        });
      }

      return updatedPayment;
    });
  }

  /**
   * Queries status of a payment transaction.
   */
  static async getStatus(transactionRef: string) {
    const payment = await prisma.payment.findUnique({
      where: { transactionRef },
      include: {
        reservation: {
          select: { bookingNumber: true, status: true, totalPriceCfa: true },
        },
      },
    });

    if (!payment) {
      throw new Error("Transaction non trouvée.");
    }

    return payment;
  }
}

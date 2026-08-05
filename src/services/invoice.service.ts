import { prisma } from "../config/db";

export class InvoiceService {
  /**
   * Generates or fetches a Pro Forma or Final Invoice for a reservation.
   * Calculates HT, VAT (18% Senegal standard rate), and TTC.
   */
  static async getOrGenerateInvoice(reservationId: string, type: "PRO_FORMA" | "FACTURE_DEFINITIVE" = "PRO_FORMA") {
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: {
        organization: true,
        establishment: true,
        quote: true,
        invoices: true,
      },
    });

    if (!reservation) {
      throw new Error("Réservation non trouvée.");
    }

    const existingInvoice = reservation.invoices.find((inv) => inv.type === type);
    if (existingInvoice) {
      return existingInvoice;
    }

    // Amount calculations (18% TVA Sénégalaise)
    const amountTtc = Number(reservation.totalPriceCfa);
    const amountHt = Math.round(amountTtc / 1.18);
    const vatAmount = amountTtc - amountHt;

    const prefix = type === "PRO_FORMA" ? "PRO" : "FAC";
    const invoiceNumber = `${prefix}-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30); // 30 days due date

    return await prisma.$transaction(async (tx) => {
      const invoice = await tx.invoice.create({
        data: {
          invoiceNumber,
          reservationId,
          type,
          amountHtCfa: amountHt,
          vatAmountCfa: vatAmount,
          amountTtcCfa: amountTtc,
          pdfUrl: `/storage/invoices/${invoiceNumber}.pdf`,
          dueDate,
        },
      });

      // Audit Log
      await tx.auditLog.create({
        data: {
          action: "GENERATE_INVOICE",
          entity: "Invoice",
          entityId: invoice.id,
          payloadAfter: JSON.stringify({ invoiceNumber, type, amountTtcCfa: amountTtc }),
        },
      });

      return invoice;
    });
  }
}

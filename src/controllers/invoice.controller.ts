import { Response, NextFunction } from "express";
import { InvoiceService } from "../services/invoice.service";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

export class InvoiceController {
  static async getInvoice(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { reservationId } = req.params;
      const type = (req.query.type as "PRO_FORMA" | "FACTURE_DEFINITIVE") || "PRO_FORMA";

      const invoice = await InvoiceService.getOrGenerateInvoice(reservationId, type);
      return res.status(200).json({ success: true, data: invoice });
    } catch (err) {
      next(err);
    }
  }
}

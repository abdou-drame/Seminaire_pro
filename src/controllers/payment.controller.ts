import { Request, Response, NextFunction } from "express";
import { PaymentService } from "../services/payment.service";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

export class PaymentController {
  static async initiate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: { code: "UNAUTHORIZED", message: "Non authentifié." },
        });
      }

      const result = await PaymentService.initiatePayment(req.body, userId);
      return res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async waveWebhook(req: Request, res: Response, next: NextFunction) {
    try {
      const { transactionRef, status } = req.body;
      const result = await PaymentService.handleWebhook(transactionRef, status, req.body);
      return res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async orangeWebhook(req: Request, res: Response, next: NextFunction) {
    try {
      const { transactionRef, status } = req.body;
      const result = await PaymentService.handleWebhook(transactionRef, status, req.body);
      return res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const payment = await PaymentService.getStatus(req.params.transactionRef);
      return res.status(200).json({ success: true, data: payment });
    } catch (err) {
      next(err);
    }
  }
}

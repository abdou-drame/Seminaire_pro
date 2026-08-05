import { Router } from "express";
import authRoutes from "./auth.routes";
import organizationRoutes from "./organization.routes";
import establishmentRoutes from "./establishment.routes";
import eventRequestRoutes from "./eventRequest.routes";
import quoteRoutes from "./quote.routes";
import reservationRoutes from "./reservation.routes";
import invoiceRoutes from "./invoice.routes";
import paymentRoutes from "./payment.routes";
import reviewRoutes from "./review.routes";
import notificationRoutes from "./notification.routes";
import adminRoutes from "./admin.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/organizations", organizationRoutes);
router.use("/establishments", establishmentRoutes);
router.use("/event-requests", eventRequestRoutes);
router.use("/quotes", quoteRoutes);
router.use("/reservations", reservationRoutes);
router.use("/invoices", invoiceRoutes);
router.use("/payments", paymentRoutes);
router.use("/reviews", reviewRoutes);
router.use("/notifications", notificationRoutes);
router.use("/admin", adminRoutes);

// Health check endpoint
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "HEALTHY",
    service: "SeminairePro Backend API",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

export default router;

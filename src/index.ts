import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import apiRoutes from "./routes";
import { errorHandler } from "./middlewares/error.middleware";
import { sanitizeInputs, rateLimiter } from "./middlewares/security.middleware";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const API_PREFIX = process.env.API_PREFIX || "/api/v1";

// 1. OWASP Security Headers (Helmet HSTS, Content-Security-Policy, Frameguard)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// 2. CORS Policy (Cross-Origin Resource Sharing)
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 3. Body Parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// 4. HTTP Logger (Morgan)
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// 5. OWASP Input Sanitization (XSS Protection)
app.use(sanitizeInputs);

// 6. Global Rate Limiter (Brute Force Protection: 100 requests per 15 min per IP)
app.use(rateLimiter(15 * 60 * 1000, 100));

// 7. API Routes Mounting
app.use(API_PREFIX, apiRoutes);

// 8. Centralized Error Handler Middleware
app.use(errorHandler);

// Start Server if not testing
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`🔒 [SeminairePro Backend API Hardened] Serveur sécurisé en cours d'exécution sur le port ${PORT}`);
    console.log(`📍 Endpoint Health Check: http://localhost:${PORT}${API_PREFIX}/health`);
  });
}

export default app;

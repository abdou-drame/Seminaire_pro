import request from "supertest";
import app from "../src/index";
import { hashPassword, verifyPassword, generateToken, verifyToken } from "../src/utils/auth";

describe("MODULE 1: Tests Unitaires & Intégration - Authentification", () => {
  // 1. TEST UNITAIRE: HASHAGE & VÉRIFICATION MOT DE PASSE (ARGON2ID)
  describe("Securité & Hashage Argon2id", () => {
    it("devrait hasher et vérifier correctement un mot de passe (Happy Path)", async () => {
      const password = "Password@2026";
      const hash = await hashPassword(password);

      expect(hash).toBeDefined();
      expect(hash).not.toEqual(password);

      const isValid = await verifyPassword(hash, password);
      expect(isValid).toBe(true);
    });

    it("devrait rejeter un mot de passe incorrect (Edge Case)", async () => {
      const password = "Password@2026";
      const wrongPassword = "WrongPassword@2026";
      const hash = await hashPassword(password);

      const isValid = await verifyPassword(hash, wrongPassword);
      expect(isValid).toBe(false);
    });
  });

  // 2. TEST UNITAIRE: ÉMISSION & VALIDATION JETON JWT
  describe("Génération et Validation JWT", () => {
    it("devrait générer et décoder un Token JWT avec les rôles (Happy Path)", () => {
      const payload = {
        userId: "uuid-user-1",
        email: "admin@saly-hotel.sn",
        globalRole: "USER",
        hotelId: "uuid-hotel-1",
        hotelRole: "HOTEL_ADMIN",
      };

      const token = generateToken(payload);
      expect(token).toBeDefined();

      const decoded = verifyToken(token);
      expect(decoded).toBeDefined();
      expect(decoded?.email).toEqual("admin@saly-hotel.sn");
      expect(decoded?.hotelRole).toEqual("HOTEL_ADMIN");
    });

    it("devrait retourner null pour un token invalide (Edge Case)", () => {
      const invalidToken = "invalid_token_sample_string";
      const decoded = verifyToken(invalidToken);
      expect(decoded).toBeNull();
    });
  });

  // 3. TEST INTÉGRATION: ENDPOINTS EXPRESS HTTP
  describe("Endpoints API HTTP Authentification", () => {
    it("GET /api/v1/health - devrait retourner le statut HEALTHY (200)", async () => {
      const res = await request(app).get("/api/v1/health");
      expect(res.status).toBe(200);
      expect(res.body.success).toBeUndefined(); // Simple json response for health
      expect(res.body.status).toBe("HEALTHY");
    });

    it("POST /api/v1/auth/login - devrait rejeter les requêtes sans payload (400)", async () => {
      const res = await request(app).post("/api/v1/auth/login").send({});
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });

    it("GET /api/v1/auth/me - devrait rejeter l'accès sans jeton Bearer (401)", async () => {
      const res = await request(app).get("/api/v1/auth/me");
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("UNAUTHORIZED");
    });
  });
});

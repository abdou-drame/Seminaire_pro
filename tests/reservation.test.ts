import request from "supertest";
import app from "../src/index";
import { generateToken } from "../src/utils/auth";

describe("MODULE 6: Tests Unitaires & Intégration - Réservations & Anti-Double Réservation", () => {
  let validOrgToken: string;
  let unauthorizedToken: string;

  beforeAll(() => {
    validOrgToken = generateToken({
      userId: "user-uuid-org-admin",
      email: "logistique@senelec.sn",
      globalRole: "USER",
      orgId: "org-uuid-senelec",
      orgRole: "ORG_LOGISTICS",
    });

    unauthorizedToken = generateToken({
      userId: "user-uuid-viewer",
      email: "consultation@senelec.sn",
      globalRole: "USER",
      orgId: "org-uuid-senelec",
      orgRole: "ORG_VIEWER",
    });
  });

  describe("Protection RBAC & Validations Réservation", () => {
    it("POST /api/v1/reservations/hold-option - devrait rejeter les demandes d'utilisateurs sans rôle logistique/admin (403)", async () => {
      const res = await request(app)
        .post("/api/v1/reservations/hold-option")
        .set("Authorization", `Bearer ${unauthorizedToken}`)
        .send({
          quoteId: "00000000-0000-0000-0000-000000000000",
          startDate: "2026-10-15T08:00:00.000Z",
          endDate: "2026-10-17T18:00:00.000Z",
        });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("FORBIDDEN");
    });

    it("POST /api/v1/reservations/hold-option - devrait valider le format des requêtes (400)", async () => {
      const res = await request(app)
        .post("/api/v1/reservations/hold-option")
        .set("Authorization", `Bearer ${validOrgToken}`)
        .send({
          quoteId: "invalid-uuid-string",
          startDate: "invalid-date",
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });
  });
});

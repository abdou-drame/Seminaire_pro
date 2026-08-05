import request from "supertest";
import app from "../src/index";
import { generateToken } from "../src/utils/auth";
import { prisma } from "../src/config/db";

// MOCK PRISMA DATABASE INTERACTION FOR IN-MEMORY TESTING
jest.mock("../src/config/db", () => {
  return {
    prisma: {
      user: {
        findUnique: jest.fn().mockResolvedValue(null),
        findFirst: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue({ id: "mock-user-1", email: "user@test.sn" }),
        update: jest.fn().mockResolvedValue({ id: "mock-user-1" }),
      },
      organization: {
        findUnique: jest.fn().mockResolvedValue({ id: "mock-org-1", legalName: "Senelec SA" }),
        count: jest.fn().mockResolvedValue(5),
        update: jest.fn().mockResolvedValue({ id: "mock-org-1" }),
      },
      establishment: {
        findMany: jest.fn().mockResolvedValue([
          { id: "mock-hotel-1", name: "Hôtel Terrou-Bi", city: "Dakar", standingStars: 5, status: "ACTIVE", latitude: 14.6937, longitude: -17.4441 },
        ]),
        findUnique: jest.fn().mockResolvedValue({ id: "mock-hotel-1", name: "Hôtel Terrou-Bi", city: "Dakar" }),
        count: jest.fn().mockResolvedValue(12),
        update: jest.fn().mockResolvedValue({ id: "mock-hotel-1" }),
      },
      eventRequest: {
        findMany: jest.fn().mockResolvedValue([]),
        findUnique: jest.fn().mockResolvedValue({ id: "mock-rfq-1", referenceNumber: "RFQ-2026-0001", quotes: [] }),
        count: jest.fn().mockResolvedValue(3),
      },
      quote: {
        findMany: jest.fn().mockResolvedValue([]),
        findUnique: jest.fn().mockResolvedValue({ id: "mock-quote-1", quoteNumber: "DEV-2026-0001", status: "PENDING" }),
        count: jest.fn().mockResolvedValue(8),
      },
      reservation: {
        findMany: jest.fn().mockResolvedValue([]),
        findUnique: jest.fn().mockResolvedValue({ id: "mock-res-1", bookingNumber: "RES-2026-0001" }),
        count: jest.fn().mockResolvedValue(4),
      },
      payment: {
        findUnique: jest.fn().mockResolvedValue(null),
        aggregate: jest.fn().mockResolvedValue({ _sum: { amountCfa: 5000000 } }),
      },
      commission: {
        findMany: jest.fn().mockResolvedValue([]),
        aggregate: jest.fn().mockResolvedValue({ _sum: { amountCfa: 400000 } }),
      },
      auditLog: {
        findMany: jest.fn().mockResolvedValue([]),
        create: jest.fn().mockResolvedValue({ id: "mock-log-1" }),
      },
      $transaction: jest.fn().mockImplementation(async (cb) => {
        return await cb(prisma);
      }),
    },
  };
});

describe("SEMINAIREPRO - SUITE COMPLETE DE TESTS DES 8 MODULES API (MOCKED DB)", () => {
  let orgAdminToken: string;
  let hotelAdminToken: string;
  let superAdminToken: string;

  beforeAll(() => {
    orgAdminToken = generateToken({
      userId: "uuid-user-org-admin",
      email: "direction@senelec.sn",
      globalRole: "USER",
      orgId: "mock-org-1",
      orgRole: "ORG_ADMIN",
    });

    hotelAdminToken = generateToken({
      userId: "uuid-user-hotel-admin",
      email: "commercial@terroubi.sn",
      globalRole: "USER",
      hotelId: "mock-hotel-1",
      hotelRole: "HOTEL_ADMIN",
    });

    superAdminToken = generateToken({
      userId: "uuid-user-super-admin",
      email: "admin@seminairepro.sn",
      globalRole: "SUPER_ADMIN",
    });
  });

  // MODULE 1 : AUTHENTIFICATION & COMPTE
  describe("Module 1 : Authentification & Sécurité (/api/v1/auth)", () => {
    it("POST /api/v1/auth/forgot-password - Demande de mot de passe oublié (200)", async () => {
      const res = await request(app)
        .post("/api/v1/auth/forgot-password")
        .send({ email: "user@test.sn" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("GET /api/v1/auth/me - Profil utilisateur avec Token JWT (200)", async () => {
      const res = await request(app)
        .get("/api/v1/auth/me")
        .set("Authorization", `Bearer ${orgAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe("direction@senelec.sn");
    });
  });

  // MODULE 2 : ORGANISATIONS CLIENTS
  describe("Module 2 : Organisations Clients (/api/v1/organizations)", () => {
    it("GET /api/v1/organizations/profile - Fiche Profil Organisation (200)", async () => {
      const res = await request(app)
        .get("/api/v1/organizations/profile")
        .set("Authorization", `Bearer ${orgAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("GET /api/v1/organizations/dashboard - Dashboard Organisation Client (200)", async () => {
      const res = await request(app)
        .get("/api/v1/organizations/dashboard")
        .set("Authorization", `Bearer ${orgAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  // MODULE 3 : ÉTABLISSEMENTS & RECHERCHE GÉOSPATIALE
  describe("Module 3 : Recherche Hôtelière & Carte GPS (/api/v1/establishments)", () => {
    it("GET /api/v1/establishments/search - Recherche multicritère publique (200)", async () => {
      const res = await request(app).get("/api/v1/establishments/search?city=Dakar");
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("GET /api/v1/establishments/map - Recherche par coordonnées GPS (Haversine) (200)", async () => {
      const res = await request(app).get("/api/v1/establishments/map?latitude=14.6937&longitude=-17.4441&radiusKm=15");
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("GET /api/v1/establishments/dashboard - Dashboard Partenaire Hôtel (200)", async () => {
      const res = await request(app)
        .get("/api/v1/establishments/dashboard")
        .set("Authorization", `Bearer ${hotelAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  // MODULE 4 : DEMANDES DE DEVIS & MESSAGERIE
  describe("Module 4 : Demandes de Devis (RFQs) (/api/v1/event-requests)", () => {
    it("GET /api/v1/event-requests - Liste des RFQs de l'organisation (200)", async () => {
      const res = await request(app)
        .get("/api/v1/event-requests")
        .set("Authorization", `Bearer ${orgAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  // MODULE 5 : OFFRES COMMERCIALES & DEVIS
  describe("Module 5 : Offres Commerciales & Devis (/api/v1/quotes)", () => {
    it("GET /api/v1/quotes/received - Consultation des devis reçus par l'organisation (200)", async () => {
      const res = await request(app)
        .get("/api/v1/quotes/received")
        .set("Authorization", `Bearer ${orgAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  // MODULE 6 : RÉSERVATIONS & OPTIONS
  describe("Module 6 : Réservations (/api/v1/reservations)", () => {
    it("GET /api/v1/reservations - Liste des réservations et options (200)", async () => {
      const res = await request(app)
        .get("/api/v1/reservations")
        .set("Authorization", `Bearer ${orgAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  // MODULE 8 : AVIS, NOTIFICATIONS & ADMIN
  describe("Module 8 : Administration & Audits (/api/v1/admin)", () => {
    it("GET /api/v1/admin/dashboard - Dashboard global Super Admin (200)", async () => {
      const res = await request(app)
        .get("/api/v1/admin/dashboard")
        .set("Authorization", `Bearer ${superAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("GET /api/v1/admin/audit-logs - Consultation des journaux d'audit (200)", async () => {
      const res = await request(app)
        .get("/api/v1/admin/audit-logs")
        .set("Authorization", `Bearer ${superAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});

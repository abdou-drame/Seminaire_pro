import { prisma } from "../config/db";

export class AdminService {
  /**
   * Lists partner hotels awaiting administrative validation.
   */
  static async getPendingHotels() {
    return await prisma.establishment.findMany({
      where: { status: "PENDING_VALIDATION" },
      include: {
        users: {
          include: {
            user: { select: { email: true, firstName: true, lastName: true, phone: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Validates or suspends a partner hotel account.
   */
  static async validateHotel(establishmentId: string, approve: boolean, adminUserId: string) {
    const status = approve ? "ACTIVE" : "SUSPENDED";

    return await prisma.$transaction(async (tx) => {
      const updated = await tx.establishment.update({
        where: { id: establishmentId },
        data: { status },
      });

      // Audit Log
      await tx.auditLog.create({
        data: {
          userId: adminUserId,
          action: "VALIDATE_HOTEL",
          entity: "Establishment",
          entityId: establishmentId,
          payloadAfter: JSON.stringify({ status }),
        },
      });

      return updated;
    });
  }

  /**
   * Platform-wide global analytics dashboard for Super Admins.
   */
  static async getDashboard() {
    const [
      totalOrgs,
      totalHotels,
      activeReservations,
      totalRevenue,
      totalCommissions,
    ] = await Promise.all([
      prisma.organization.count({ where: { status: "ACTIVE" } }),
      prisma.establishment.count({ where: { status: "ACTIVE" } }),
      prisma.reservation.count({ where: { status: { in: ["CONFIRMED", "DEPOSIT_PAID", "FULLY_PAID"] } } }),
      prisma.payment.aggregate({
        where: { status: "SUCCESS" },
        _sum: { amountCfa: true },
      }),
      prisma.commission.aggregate({
        _sum: { amountCfa: true },
      }),
    ]);

    return {
      totalOrganizations: totalOrgs,
      totalActiveHotels: totalHotels,
      activeReservations,
      totalTransactionVolumeCfa: totalRevenue._sum.amountCfa || 0,
      totalPlatformCommissionsCfa: totalCommissions._sum.amountCfa || 0,
    };
  }

  /**
   * Platform commission tracking report.
   */
  static async getCommissions() {
    return await prisma.commission.findMany({
      include: {
        establishment: { select: { name: true, city: true } },
        reservation: { select: { bookingNumber: true, totalPriceCfa: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Queries security audit trail.
   */
  static async getAuditLogs(limit: number = 50) {
    return await prisma.auditLog.findMany({
      take: limit,
      include: {
        user: { select: { email: true, firstName: true, lastName: true, globalRole: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }
}

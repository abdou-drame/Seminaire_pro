import { prisma } from "../config/db";
import { hashPassword } from "../utils/auth";
import { UpdateOrgProfileInput, AddOrgUserInput, UpdateApprovalWorkflowInput } from "../dtos";

export class OrganizationService {
  /**
   * Retrieves the profile and details of an organization.
   */
  static async getProfile(organizationId: string) {
    const org = await prisma.organization.findUnique({
      where: { id: organizationId },
      include: {
        users: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                status: true,
              },
            },
          },
        },
      },
    });

    if (!org) {
      throw new Error("Organisation non trouvée.");
    }

    return org;
  }

  /**
   * Updates an organization's profile and administrative information.
   */
  static async updateProfile(organizationId: string, input: UpdateOrgProfileInput) {
    return await prisma.organization.update({
      where: { id: organizationId },
      data: input,
    });
  }

  /**
   * Lists all staff users attached to an organization.
   */
  static async getUsers(organizationId: string) {
    return await prisma.organizationUser.findMany({
      where: { organizationId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            status: true,
            createdAt: true,
          },
        },
      },
    });
  }

  /**
   * Adds a new staff user to the organization with a specified role.
   */
  static async addUser(organizationId: string, input: AddOrgUserInput) {
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email: input.email }, { phone: input.phone }] },
    });

    return await prisma.$transaction(async (tx) => {
      let user = existingUser;

      if (!user) {
        // Generate temporary random password
        const tempPassword = `Temp@${Math.random().toString(36).slice(-8)}`;
        const hashedPassword = await hashPassword(tempPassword);

        user = await tx.user.create({
          data: {
            email: input.email,
            phone: input.phone,
            passwordHash: hashedPassword,
            firstName: input.firstName,
            lastName: input.lastName,
            globalRole: "USER",
            status: "ACTIVE",
          },
        });
      }

      const existingOrgLink = await tx.organizationUser.findUnique({
        where: {
          organizationId_userId: {
            organizationId,
            userId: user.id,
          },
        },
      });

      if (existingOrgLink) {
        throw new Error("Cet utilisateur fait déjà partie de l'organisation.");
      }

      const orgUser = await tx.organizationUser.create({
        data: {
          organizationId,
          userId: user.id,
          role: input.role,
        },
        include: {
          user: true,
        },
      });

      return orgUser;
    });
  }

  /**
   * Revokes user access from an organization.
   */
  static async removeUser(organizationId: string, userId: string) {
    return await prisma.organizationUser.delete({
      where: {
        organizationId_userId: {
          organizationId,
          userId,
        },
      },
    });
  }

  /**
   * Updates internal approval workflow activation setting.
   */
  static async updateApprovalWorkflow(organizationId: string, input: UpdateApprovalWorkflowInput) {
    return await prisma.organization.update({
      where: { id: organizationId },
      data: {
        approvalProcessActive: input.approvalProcessActive,
      },
    });
  }

  /**
   * Retrieves synthetic metrics for the Organization dashboard.
   */
  static async getDashboard(organizationId: string) {
    const [totalRequests, totalReservations, pendingApprovals, recentReservations] = await Promise.all([
      prisma.eventRequest.count({ where: { organizationId } }),
      prisma.reservation.count({ where: { organizationId } }),
      prisma.reservation.count({
        where: {
          organizationId,
          status: "PENDING_INTERNAL_APPROVAL",
        },
      }),
      prisma.reservation.findMany({
        where: { organizationId },
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          establishment: { select: { name: true, city: true } },
          quote: { select: { quoteNumber: true, totalAmountCfa: true } },
        },
      }),
    ]);

    return {
      totalRequests,
      totalReservations,
      pendingApprovals,
      recentReservations,
    };
  }
}

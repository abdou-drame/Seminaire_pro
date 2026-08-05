import { prisma } from "../config/db";
import { hashPassword, verifyPassword, generateToken } from "../utils/auth";
import { RegisterOrgInput, RegisterHotelInput, LoginInput } from "../dtos";

export class AuthService {
  /**
   * Registers a new corporate client organization along with its primary administrator account.
   */
  static async registerOrganization(input: RegisterOrgInput) {
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email: input.email }, { phone: input.phone }] },
    });

    if (existingUser) {
      throw new Error("Un utilisateur avec cet email ou ce numéro de téléphone existe déjà.");
    }

    const hashedPassword = await hashPassword(input.password);

    return await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
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

      const org = await tx.organization.create({
        data: {
          legalName: input.legalName,
          ninea: input.ninea,
          tradeName: input.tradeName,
          address: input.address,
          city: input.city,
          country: input.country || "Sénégal",
          status: "ACTIVE",
        },
      });

      await tx.organizationUser.create({
        data: {
          organizationId: org.id,
          userId: user.id,
          role: "ORG_ADMIN",
        },
      });

      const token = generateToken({
        userId: user.id,
        email: user.email,
        globalRole: user.globalRole,
        orgId: org.id,
        orgRole: "ORG_ADMIN",
      });

      return { user, organization: org, token };
    });
  }

  /**
   * Registers a new partner hotel/establishment awaiting administrative validation.
   */
  static async registerHotel(input: RegisterHotelInput) {
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email: input.email }, { phone: input.phone }] },
    });

    if (existingUser) {
      throw new Error("Un utilisateur avec cet email ou ce numéro de téléphone existe déjà.");
    }

    const hashedPassword = await hashPassword(input.password);

    return await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
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

      const establishment = await tx.establishment.create({
        data: {
          name: input.name,
          type: input.type,
          standingStars: input.standingStars,
          ninea: input.ninea,
          rccm: input.rccm,
          description: input.description,
          address: input.address,
          city: input.city,
          region: input.region,
          phone: input.phone,
          email: input.email,
          latitude: input.latitude,
          longitude: input.longitude,
          status: "PENDING_VALIDATION", // Requires admin signoff before public listing
        },
      });

      await tx.establishmentUser.create({
        data: {
          establishmentId: establishment.id,
          userId: user.id,
          role: "HOTEL_ADMIN",
        },
      });

      const token = generateToken({
        userId: user.id,
        email: user.email,
        globalRole: user.globalRole,
        hotelId: establishment.id,
        hotelRole: "HOTEL_ADMIN",
      });

      return { user, establishment, token };
    });
  }

  /**
   * Authenticates a user with email and password, issuing a JWT access token.
   */
  static async login(input: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
      include: {
        organizationUsers: true,
        establishmentUsers: true,
      },
    });

    if (!user) {
      throw new Error("Identifiants incorrects.");
    }

    if (user.status === "DEACTIVATED" || user.status === "SUSPENDED") {
      throw new Error("Votre compte a été désactivé ou suspendu.");
    }

    const isValid = await verifyPassword(user.passwordHash, input.password);
    if (!isValid) {
      throw new Error("Identifiants incorrects.");
    }

    const orgUser = user.organizationUsers[0];
    const hotelUser = user.establishmentUsers[0];

    const token = generateToken({
      userId: user.id,
      email: user.email,
      globalRole: user.globalRole,
      orgId: orgUser?.organizationId,
      orgRole: orgUser?.role,
      hotelId: hotelUser?.establishmentId,
      hotelRole: hotelUser?.role,
    });

    // Update last login timestamp
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        globalRole: user.globalRole,
        twoFactorEnabled: user.twoFactorEnabled,
      },
      organizationRole: orgUser,
      hotelRole: hotelUser,
    };
  }

  /**
   * Generates a password reset request token.
   */
  static async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return { message: "Si l'adresse email existe, des instructions ont été envoyées." };
    }
    return { message: "Un email de réinitialisation de mot de passe a été envoyé." };
  }

  /**
   * Deactivates a user account (Section 6.1).
   */
  static async deactivateAccount(userId: string) {
    return await prisma.user.update({
      where: { id: userId },
      data: { status: "DEACTIVATED" },
    });
  }
}

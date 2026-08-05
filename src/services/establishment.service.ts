import { prisma } from "../config/db";
import {
  UpdateHotelProfileInput,
  CreateMeetingRoomInput,
  CreateBedroomInput,
  CreatePackageInput,
  CreateAvailabilityBlockInput,
} from "../dtos";

export class EstablishmentService {
  /**
   * Multicriteria search for active, validated establishments.
   */
  static async search(filters: {
    city?: string;
    standingStars?: number;
    type?: string;
    participantCount?: number;
    page?: number;
    limit?: number;
  }) {
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    const whereClause: any = {
      status: "ACTIVE", // Only show validated establishments publicly
    };

    if (filters.city) {
      whereClause.city = { contains: filters.city, mode: "insensitive" };
    }
    if (filters.standingStars) {
      whereClause.standingStars = Number(filters.standingStars);
    }
    if (filters.type) {
      whereClause.type = filters.type;
    }

    const [total, data] = await Promise.all([
      prisma.establishment.count({ where: whereClause }),
      prisma.establishment.findMany({
        where: whereClause,
        skip,
        take: limit,
        include: {
          meetingRooms: {
            include: { layouts: true },
          },
          bedrooms: true,
          packages: true,
          reviews: {
            where: { isModerated: true },
            select: { ratingGlobal: true },
          },
        },
        orderBy: { standingStars: "desc" },
      }),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Geospatial map search (Haversine formula approximation).
   */
  static async mapSearch(latitude: number, longitude: number, radiusKm: number = 10) {
    const establishments = await prisma.establishment.findMany({
      where: {
        status: "ACTIVE",
        latitude: { not: null },
        longitude: { not: null },
      },
      select: {
        id: true,
        name: true,
        type: true,
        standingStars: true,
        address: true,
        city: true,
        latitude: true,
        longitude: true,
        coverImageUrl: true,
      },
    });

    // Haversine distance filter
    const R = 6371; // Earth radius in km
    const filtered = establishments.filter((est) => {
      if (!est.latitude || !est.longitude) return false;
      const dLat = ((est.latitude - latitude) * Math.PI) / 180;
      const dLon = ((est.longitude - longitude) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((latitude * Math.PI) / 180) *
          Math.cos((est.latitude * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;
      return distance <= radiusKm;
    });

    return filtered;
  }

  /**
   * Retrieves complete establishment profile with all inventories and verified reviews.
   */
  static async getById(id: string) {
    const establishment = await prisma.establishment.findUnique({
      where: { id },
      include: {
        meetingRooms: {
          include: { layouts: true },
        },
        bedrooms: true,
        equipments: true,
        cateringOptions: true,
        packages: true,
        reviews: {
          where: { isModerated: true },
          include: {
            user: { select: { firstName: true, lastName: true } },
          },
        },
      },
    });

    if (!establishment) {
      throw new Error("Établissement non trouvé.");
    }

    return establishment;
  }

  /**
   * Updates partner establishment profile.
   */
  static async updateProfile(establishmentId: string, input: UpdateHotelProfileInput) {
    return await prisma.establishment.update({
      where: { id: establishmentId },
      data: input,
    });
  }

  /**
   * Adds a meeting room with layout capacities.
   */
  static async addMeetingRoom(establishmentId: string, input: CreateMeetingRoomInput) {
    return await prisma.meetingRoom.create({
      data: {
        establishmentId,
        name: input.name,
        areaSqm: input.areaSqm,
        halfDayPriceCfa: input.halfDayPriceCfa,
        fullDayPriceCfa: input.fullDayPriceCfa,
        description: input.description,
        layouts: {
          createMany: {
            data: input.layouts,
          },
        },
      },
      include: { layouts: true },
    });
  }

  /**
   * Adds bedroom inventory stock.
   */
  static async addBedroom(establishmentId: string, input: CreateBedroomInput) {
    return await prisma.bedroom.create({
      data: {
        establishmentId,
        roomType: input.roomType,
        stockQuantity: input.stockQuantity,
        maxOccupancy: input.maxOccupancy,
        pricePerNightCfa: input.pricePerNightCfa,
        description: input.description,
      },
    });
  }

  /**
   * Adds an event package.
   */
  static async addPackage(establishmentId: string, input: CreatePackageInput) {
    return await prisma.package.create({
      data: {
        establishmentId,
        name: input.name,
        pricePerPersonCfa: input.pricePerPersonCfa,
        description: input.description,
      },
    });
  }

  /**
   * Adds an availability block or seasonal price adjustment.
   */
  static async addAvailabilityBlock(establishmentId: string, input: CreateAvailabilityBlockInput) {
    return await prisma.availabilityBlock.create({
      data: {
        establishmentId,
        meetingRoomId: input.meetingRoomId,
        startDate: new Date(input.startDate),
        endDate: new Date(input.endDate),
        reason: input.reason,
        isBlocked: input.isBlocked,
        priceMultiplier: input.priceMultiplier,
      },
    });
  }

  /**
   * Hotel Partner Dashboard metrics.
   */
  static async getDashboard(establishmentId: string) {
    const [quotesCount, reservationsCount, pendingQuotes, totalRevenue] = await Promise.all([
      prisma.quote.count({ where: { establishmentId } }),
      prisma.reservation.count({ where: { establishmentId } }),
      prisma.quote.count({ where: { establishmentId, status: "PENDING" } }),
      prisma.reservation.aggregate({
        where: { establishmentId, status: { in: ["DEPOSIT_PAID", "FULLY_PAID"] } },
        _sum: { totalPriceCfa: true },
      }),
    ]);

    return {
      quotesCount,
      reservationsCount,
      pendingQuotes,
      totalRevenue: totalRevenue._sum.totalPriceCfa || 0,
    };
  }
}

import { prisma } from "../config/db";
import { CreateReviewInput } from "../dtos";

export class ReviewService {
  /**
   * Submits a post-event review (Restricted to verified completed activities).
   */
  static async createReview(input: CreateReviewInput, userId: string) {
    const reservation = await prisma.reservation.findUnique({
      where: { id: input.reservationId },
    });

    if (!reservation) {
      throw new Error("Réservation non trouvée.");
    }

    // Ensure reservation is actually completed
    if (reservation.status !== "ACTIVITE_REALISEE" && reservation.status !== "FULLY_PAID") {
      throw new Error("Seules les organisations ayant effectivement réalisé une activité peuvent publier une évaluation.");
    }

    const ratingGlobal =
      (input.ratingService +
        input.ratingRoom +
        input.ratingBedrooms +
        input.ratingCatering +
        input.ratingWifi +
        input.ratingValue) / 6;

    return await prisma.$transaction(async (tx) => {
      const review = await tx.review.create({
        data: {
          reservationId: input.reservationId,
          establishmentId: reservation.establishmentId,
          userId,
          ratingGlobal: Math.round(ratingGlobal * 10) / 10,
          ratingService: input.ratingService,
          ratingRoom: input.ratingRoom,
          ratingBedrooms: input.ratingBedrooms,
          ratingCatering: input.ratingCatering,
          ratingWifi: input.ratingWifi,
          ratingValue: input.ratingValue,
          comment: input.comment,
          isModerated: false, // Requires admin moderation before public display
        },
      });

      // Audit Log
      await tx.auditLog.create({
        data: {
          userId,
          action: "SUBMIT_REVIEW",
          entity: "Review",
          entityId: review.id,
          payloadAfter: JSON.stringify({ ratingGlobal }),
        },
      });

      return review;
    });
  }

  /**
   * Moderates an evaluation (Super Admin / Moderator).
   */
  static async moderateReview(reviewId: string, approve: boolean, userId: string) {
    return await prisma.review.update({
      where: { id: reviewId },
      data: { isModerated: approve },
    });
  }
}

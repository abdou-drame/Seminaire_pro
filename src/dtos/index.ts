import { z } from "zod";

// ====================================================
// MODULE 1: AUTHENTICATION & USER DTOS
// ====================================================

export const RegisterOrgSchema = z.object({
  legalName: z.string().min(2, "La raison sociale est obligatoire"),
  ninea: z.string().optional(),
  tradeName: z.string().optional(),
  address: z.string().min(3, "L'adresse est requise"),
  city: z.string().min(2, "La ville est requise"),
  country: z.string().default("Sénégal"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(9, "Numéro de téléphone invalide"),
  password: z
    .string()
    .min(8, "Mot de passe d'au moins 8 caractères")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Le mot de passe doit contenir une majuscule, une minuscule et un chiffre"),
  firstName: z.string().min(2, "Prénom requis"),
  lastName: z.string().min(2, "Nom requis"),
});

export const RegisterHotelSchema = z.object({
  name: z.string().min(2, "Le nom de l'établissement est requis"),
  type: z.enum([
    "HOTEL",
    "RESIDENCE_HOTELIERE",
    "AUBERGE_PROFESSIONNELLE",
    "CENTRE_CONFERENCE",
    "SALLE_INDEPENDANTE",
    "ESPACE_EVENEMENTIEL"
  ]),
  standingStars: z.number().int().min(1).max(5).default(3),
  ninea: z.string().optional(),
  rccm: z.string().optional(),
  description: z.string().min(10, "Description requise"),
  address: z.string().min(3),
  city: z.string().min(2),
  region: z.string().min(2),
  phone: z.string().min(9),
  email: z.string().email(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  password: z.string().min(8),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
});

export const LoginSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email("Adresse email invalide"),
});

export const ResetPasswordSchema = z.object({
  resetToken: z.string().min(1, "Jeton de réinitialisation requis"),
  newPassword: z.string().min(8, "Le nouveau mot de passe doit contenir au moins 8 caractères"),
});

export const Verify2FASchema = z.object({
  userId: z.string().uuid("ID utilisateur invalide"),
  totpCode: z.string().length(6, "Code TOTP à 6 chiffres requis"),
});

// ====================================================
// MODULE 2: ORGANIZATIONS DTOS
// ====================================================

export const UpdateOrgProfileSchema = z.object({
  legalName: z.string().min(2).optional(),
  tradeName: z.string().optional(),
  ninea: z.string().optional(),
  rccm: z.string().optional(),
  address: z.string().min(3).optional(),
  city: z.string().min(2).optional(),
  logoUrl: z.string().url().optional(),
});

export const AddOrgUserSchema = z.object({
  email: z.string().email("Email invalide"),
  phone: z.string().min(9, "Numéro de téléphone invalide"),
  firstName: z.string().min(2, "Prénom requis"),
  lastName: z.string().min(2, "Nom requis"),
  role: z.enum([
    "ORG_ADMIN",
    "ORG_REQUESTER",
    "ORG_LOGISTICS",
    "ORG_FINANCE",
    "ORG_APPROVER",
    "ORG_VIEWER"
  ]),
});

export const UpdateApprovalWorkflowSchema = z.object({
  approvalProcessActive: z.boolean(),
});

// ====================================================
// MODULE 3: SEARCH & INVENTORY DTOS
// ====================================================

export const UpdateHotelProfileSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().min(10).optional(),
  standingStars: z.number().int().min(1).max(5).optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  region: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  coverImageUrl: z.string().url().optional(),
  logoUrl: z.string().url().optional(),
  cancellationPolicy: z.string().optional(),
  checkInTime: z.string().optional(),
  checkOutTime: z.string().optional(),
});

export const MapSearchSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  radiusKm: z.number().positive().default(10),
});

export const CreateMeetingRoomSchema = z.object({
  name: z.string().min(2, "Le nom de la salle est requis"),
  areaSqm: z.number().positive("La superficie doit être positive"),
  halfDayPriceCfa: z.number().positive(),
  fullDayPriceCfa: z.number().positive(),
  description: z.string().optional(),
  layouts: z
    .array(
      z.object({
        layoutType: z.enum([
          "THEATRE",
          "CLASSROOM",
          "U_SHAPE",
          "BOARDROOM",
          "BANQUET",
          "COCKTAIL"
        ]),
        maxCapacity: z.number().int().positive()
      })
    )
    .min(1, "Spécifiez au moins une disposition de salle")
});

export const CreateBedroomSchema = z.object({
  roomType: z.string().min(2),
  stockQuantity: z.number().int().positive(),
  maxOccupancy: z.number().int().positive().default(1),
  pricePerNightCfa: z.number().positive(),
  description: z.string().optional(),
});

export const CreatePackageSchema = z.object({
  name: z.string().min(2),
  pricePerPersonCfa: z.number().positive(),
  description: z.string().optional(),
});

export const CreateAvailabilityBlockSchema = z.object({
  meetingRoomId: z.string().uuid().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  reason: z.string().optional(),
  isBlocked: z.boolean().default(true),
  priceMultiplier: z.number().positive().default(1.0),
});

// ====================================================
// MODULE 4: EVENT REQUEST & MESSAGING DTOS
// ====================================================

export const CreateEventRequestSchema = z.object({
  title: z.string().min(3, "L'intitulé de l'événement est obligatoire"),
  eventType: z.string().min(2),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  participantCount: z.number().int().positive(),
  bedroomCount: z.number().int().nonnegative().default(0),
  budgetLimitCfa: z.number().positive().optional(),
  preferredCity: z.string().min(2),
  targetEstablishmentIds: z.array(z.string().uuid()).min(1),
  responseDeadline: z.string().datetime(),
  specialRequests: z.string().optional(),
});

export const SendMessageSchema = z.object({
  content: z.string().min(1, "Le contenu du message ne peut pas être vide"),
  attachmentUrl: z.string().url().optional(),
});

// ====================================================
// MODULE 5: QUOTE DTOS
// ====================================================

export const CreateQuoteSchema = z.object({
  eventRequestId: z.string().uuid(),
  establishmentId: z.string().uuid(),
  roomAmountCfa: z.number().nonnegative(),
  bedroomAmountCfa: z.number().nonnegative(),
  cateringAmountCfa: z.number().nonnegative(),
  discountCfa: z.number().nonnegative().default(0),
  validUntil: z.string().datetime(),
  notes: z.string().optional(),
});

// ====================================================
// MODULE 6: RESERVATION DTOS
// ====================================================

export const HoldOptionSchema = z.object({
  quoteId: z.string().uuid(),
  meetingRoomId: z.string().uuid().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  optionDurationHours: z.number().int().positive().default(48),
});

export const SubmitApprovalSchema = z.object({
  reservationId: z.string().uuid(),
  level: z.number().int().min(1).max(3),
  action: z.enum(["APPROVED", "REJECTED"]),
  comments: z.string().optional(),
});

// ====================================================
// MODULE 7: PAYMENT DTOS
// ====================================================

export const InitiatePaymentSchema = z.object({
  reservationId: z.string().uuid(),
  amountCfa: z.number().positive(),
  method: z.enum([
    "MOBILE_MONEY_WAVE",
    "MOBILE_MONEY_ORANGE",
    "MOBILE_MONEY_FREE",
    "CREDIT_CARD",
    "BANK_TRANSFER",
    "CHECK",
    "BILL_ON_ACCOUNT"
  ]),
  customerPhone: z.string().optional(),
});

// ====================================================
// MODULE 8: REVIEWS DTOS
// ====================================================

export const CreateReviewSchema = z.object({
  reservationId: z.string().uuid(),
  ratingService: z.number().int().min(1).max(5),
  ratingRoom: z.number().int().min(1).max(5),
  ratingBedrooms: z.number().int().min(1).max(5),
  ratingCatering: z.number().int().min(1).max(5),
  ratingWifi: z.number().int().min(1).max(5),
  ratingValue: z.number().int().min(1).max(5),
  comment: z.string().optional(),
});

// TypeScript Types
export type RegisterOrgInput = z.infer<typeof RegisterOrgSchema>;
export type RegisterHotelInput = z.infer<typeof RegisterHotelSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type UpdateOrgProfileInput = z.infer<typeof UpdateOrgProfileSchema>;
export type AddOrgUserInput = z.infer<typeof AddOrgUserSchema>;
export type UpdateApprovalWorkflowInput = z.infer<typeof UpdateApprovalWorkflowSchema>;
export type UpdateHotelProfileInput = z.infer<typeof UpdateHotelProfileSchema>;
export type CreateMeetingRoomInput = z.infer<typeof CreateMeetingRoomSchema>;
export type CreateBedroomInput = z.infer<typeof CreateBedroomSchema>;
export type CreatePackageInput = z.infer<typeof CreatePackageSchema>;
export type CreateAvailabilityBlockInput = z.infer<typeof CreateAvailabilityBlockSchema>;
export type CreateEventRequestInput = z.infer<typeof CreateEventRequestSchema>;
export type SendMessageInput = z.infer<typeof SendMessageSchema>;
export type CreateQuoteInput = z.infer<typeof CreateQuoteSchema>;
export type HoldOptionInput = z.infer<typeof HoldOptionSchema>;
export type SubmitApprovalInput = z.infer<typeof SubmitApprovalSchema>;
export type InitiatePaymentInput = z.infer<typeof InitiatePaymentSchema>;
export type CreateReviewInput = z.infer<typeof CreateReviewSchema>;

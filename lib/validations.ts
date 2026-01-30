// Zod Validation Schemas for the application
import { z } from 'zod';

// ==================== AUTH SCHEMAS ====================

export const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data: { password: string; confirmPassword: string }) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// ==================== HEALTH PROFILE SCHEMAS ====================

export const basicInfoSchema = z.object({
  dateOfBirth: z.string().optional(),
  age: z.coerce.number().min(1).max(120).optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY']).optional(),
  height: z.coerce.number().min(50).max(300).optional(), // cm
  weight: z.coerce.number().min(10).max(500).optional(), // kg
  bloodType: z.string().optional(),
});

export const healthConditionsSchema = z.object({
  existingConditions: z.array(z.string()).default([]),
  allergies: z.array(z.string()).default([]),
  medications: z.array(z.string()).default([]),
  injuries: z.array(z.string()).default([]),
});

export const lifestyleSchema = z.object({
  dietPreference: z.enum([
    'VEGETARIAN', 'NON_VEGETARIAN', 'VEGAN', 
    'EGGETARIAN', 'PESCATARIAN', 'FLEXITARIAN'
  ]).optional(),
  activityLevel: z.enum([
    'SEDENTARY', 'LIGHTLY_ACTIVE', 'MODERATELY_ACTIVE',
    'VERY_ACTIVE', 'EXTREMELY_ACTIVE'
  ]).optional(),
  sleepQuality: z.enum(['POOR', 'FAIR', 'GOOD', 'EXCELLENT']).optional(),
  stressLevel: z.enum(['LOW', 'MODERATE', 'HIGH', 'VERY_HIGH']).optional(),
  smokingStatus: z.enum(['NEVER', 'FORMER', 'CURRENT', 'OCCASIONAL']).optional(),
  alcoholConsumption: z.enum(['NONE', 'OCCASIONAL', 'MODERATE', 'HEAVY']).optional(),
});

export const goalsSchema = z.object({
  primaryGoal: z.enum([
    'WEIGHT_LOSS', 'WEIGHT_GAIN', 'MUSCLE_BUILDING', 'MAINTAIN_WEIGHT',
    'IMPROVE_FITNESS', 'INCREASE_FLEXIBILITY', 'STRESS_REDUCTION',
    'BETTER_SLEEP', 'MANAGE_CONDITION', 'GENERAL_WELLNESS', 'INJURY_RECOVERY'
  ]).optional(),
  secondaryGoals: z.array(z.enum([
    'WEIGHT_LOSS', 'WEIGHT_GAIN', 'MUSCLE_BUILDING', 'MAINTAIN_WEIGHT',
    'IMPROVE_FITNESS', 'INCREASE_FLEXIBILITY', 'STRESS_REDUCTION',
    'BETTER_SLEEP', 'MANAGE_CONDITION', 'GENERAL_WELLNESS', 'INJURY_RECOVERY'
  ])).default([]),
  targetWeight: z.coerce.number().min(20).max(500).optional(),
});

export const healthProfileSchema = basicInfoSchema
  .merge(healthConditionsSchema)
  .merge(lifestyleSchema)
  .merge(goalsSchema);

// ==================== APPOINTMENT SCHEMAS ====================

export const appointmentSchema = z.object({
  doctorId: z.string().min(1, 'Please select a doctor'),
  scheduledDate: z.string().min(1, 'Please select a date'),
  scheduledTime: z.string().min(1, 'Please select a time'),
  reason: z.string().optional(),
  symptoms: z.array(z.string()).default([]),
  type: z.enum(['CONSULTATION', 'FOLLOW_UP', 'CHECKUP', 'EMERGENCY', 'TELECONSULTATION']).default('CONSULTATION'),
});

// ==================== HEALTH METRICS SCHEMAS ====================

export const healthMetricsSchema = z.object({
  weight: z.coerce.number().optional(),
  bloodPressureSystolic: z.coerce.number().optional(),
  bloodPressureDiastolic: z.coerce.number().optional(),
  heartRate: z.coerce.number().optional(),
  bloodSugar: z.coerce.number().optional(),
  sleepHours: z.coerce.number().optional(),
  waterIntake: z.coerce.number().optional(),
  stepsCount: z.coerce.number().optional(),
  caloriesBurned: z.coerce.number().optional(),
  caloriesConsumed: z.coerce.number().optional(),
  mood: z.enum(['VERY_LOW', 'LOW', 'NEUTRAL', 'GOOD', 'EXCELLENT']).optional(),
  notes: z.string().optional(),
});

// ==================== CHAT SCHEMAS ====================

export const chatMessageSchema = z.object({
  content: z.string().min(1, 'Message cannot be empty').max(4000, 'Message too long'),
  sessionId: z.string().optional(),
});

// ==================== TYPE EXPORTS ====================

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type HealthProfileInput = z.infer<typeof healthProfileSchema>;
export type AppointmentInput = z.infer<typeof appointmentSchema>;
export type HealthMetricsInput = z.infer<typeof healthMetricsSchema>;
export type ChatMessageInput = z.infer<typeof chatMessageSchema>;

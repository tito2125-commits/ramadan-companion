import { z } from "zod";

export const pushSubscriptionSchema = z.object({
  endpoint: z.string().url(),
  expirationTime: z.number().nullable().optional(),
  keys: z.object({
    p256dh: z.string().min(1),
    auth: z.string().min(1),
  }),
});

export const pushSubscribePayloadSchema = z.object({
  deviceId: z.string().min(8),
  subscription: pushSubscriptionSchema,
});

export const reminderPreferenceSchema = z.object({
  deviceId: z.string().min(8),
  wirdTime: z.string().regex(/^\d{2}:\d{2}$/),
  morningAthkarTime: z.string().regex(/^\d{2}:\d{2}$/),
  eveningAthkarTime: z.string().regex(/^\d{2}:\d{2}$/),
  prePrayerMinutes: z.number().int().min(0).max(60),
  enabledChannels: z.array(z.enum(["push", "in-app"]))
    .min(1),
  timezone: z.string().min(2),
});

export const unsubscribePayloadSchema = z.object({
  deviceId: z.string().min(8),
});

import { z } from "zod";

export const RequestMessage = z.object({
  method: z.enum(["changeApiKey"]),
  payload: z.string(),
});

export const completeRequest = z.object({
  type: z.literal("completeRequest").default("completeRequest"),
  payload: z.string(),
  token: z.string(),
});

export const completeResponse = z.object({
  type: z.literal("completeResponse").default("completeResponse"),
  finish: z.boolean().default(false),
  payload: z.string(),
});

export const actionClickRequest = z.object({
  type: z.literal("actionClickRequest").default("actionClickRequest"),
});

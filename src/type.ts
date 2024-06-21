import { z } from "zod";

export const RequestMessage = z.object({
  method: z.enum(["changeApiKey"]),
  payload: z.string(),
});

export type RequestMessageType = z.infer<typeof RequestMessage>;

export const ResponseMessage = z.object({
  type: z.enum(["stream", "finish", "loading"]),
  payload: z.any(),
});

export type ResponseMessageType = z.infer<typeof ResponseMessage>;

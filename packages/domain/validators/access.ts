import { z } from "zod";

// Only destinations implemented by this product may be used in OAuth callbacks.
export const loginDestinationSchema = z
  .string()
  .max(300)
  .regex(
    /^\/(?:devocional|comunidade(?:\/[a-zA-Z0-9_-]+(?:\/(?:listas|membros))?)?)(?:#[a-zA-Z0-9_-]+)?$/,
  )
  .refine((value) => !/\s/.test(value));
export const loginSearchSchema = z.object({
  redirect: loginDestinationSchema.catch("/devocional").optional(),
  error: z.literal("oauth").catch("oauth").optional(),
});
export const convexConfigurationSchema = z
  .object({
    url: z
      .string()
      .trim()
      .url()
      .regex(/^https:\/\/[a-z0-9-]+\.convex\.cloud\/?$/),
    site: z
      .string()
      .trim()
      .url()
      .regex(/^https:\/\/[a-z0-9-]+\.convex\.site\/?$/),
  })
  .refine(({ url, site }) => {
    try {
      return (
        new URL(url).hostname.split(".")[0] ===
        new URL(site).hostname.split(".")[0]
      );
    } catch {
      return false;
    }
  });

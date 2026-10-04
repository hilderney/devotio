import {
  convexConfigurationSchema,
  loginDestinationSchema,
} from "./validators/access";
export function loginDestination(value: unknown): string {
  const parsed = loginDestinationSchema.safeParse(value);
  return parsed.success ? parsed.data : "/devocional";
}
export type ClientConfiguration =
  | { mode: "live"; url: string; site: string }
  | { mode: "preview" }
  | { mode: "unavailable"; reason: "missing" | "invalid" };

export function clientConfiguration(
  development: boolean,
  url?: string,
  site?: string,
): ClientConfiguration {
  if (!url?.trim() && !site?.trim()) {
    return development
      ? { mode: "preview" }
      : { mode: "unavailable", reason: "missing" };
  }
  const parsed = convexConfigurationSchema.safeParse({ url, site });
  return parsed.success
    ? { mode: "live", ...parsed.data }
    : { mode: "unavailable", reason: "invalid" };
}

import { defineApp } from "convex/server";
import betterAuth from "@convex-dev/better-auth/convex.config";
import rateLimiter from "@convex-dev/rate-limiter/convex.config.js";
import { v } from "convex/values";
const app = defineApp({
  env: {
    ADMIN_LOGIN: v.optional(v.string()),
    ADMIN_PASSWORD_HASH: v.optional(v.string()),
    ADMIN_TOTP_SECRET: v.optional(v.string()),
    PILOT_EXISTING_USERS_BEFORE: v.optional(v.string()),
  },
});
app.use(betterAuth);
app.use(rateLimiter);
export default app;

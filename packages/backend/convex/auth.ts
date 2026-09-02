import { betterAuth } from 'better-auth';
import { convex } from 'better-auth/plugins/convex';

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    convex({
      // Convex configuration
    }),
  ],
});
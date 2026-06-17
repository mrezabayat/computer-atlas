import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth/minimal";
import { drizzle } from "drizzle-orm/d1";
import { authSchema } from "./auth-schema";
import type { CloudflareEnv } from "./cloudflare";

type SocialProviders = NonNullable<
  Parameters<typeof betterAuth>[0]["socialProviders"]
>;

export function createAuth(env: CloudflareEnv) {
  const db = drizzle(env.DB, { schema: authSchema });
  const socialProviders: SocialProviders = {};

  if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
    socialProviders.google = {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    };
  }

  if (env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET) {
    socialProviders.github = {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    };
  }

  return betterAuth({
    appName: "CS Map",
    baseURL: env.BETTER_AUTH_URL,
    secret: env.BETTER_AUTH_SECRET,
    database: drizzleAdapter(db, {
      provider: "sqlite",
      schema: authSchema,
      camelCase: true,
    }),
    socialProviders,
  });
}

export type AtlasAuth = ReturnType<typeof createAuth>;

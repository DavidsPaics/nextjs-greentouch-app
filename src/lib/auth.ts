import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins"
import { APIError, createAuthMiddleware } from "better-auth/api";
import { passwordSchema } from "./validation";
import { sendEmail } from "./email";
import { buildResetPasswordEmail, getRequestLocale } from "./reset-password-email";

export const auth = betterAuth({
    session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24, // 1 day (every 1 day the session expiration is updated)
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60 // Cache duration in seconds (5 minutes)
        }
    },
    user: {
      additionalFields: {
        position: {
          type: "string",
          required: true,
          defaultValue: "other",
        },
        university: {
          type: "string",
          required: true,
          defaultValue: "unknown",
        },
        specialization: {
          type: "string",
          required: true,
          defaultValue: "unknown",
        },
        motivation: {
          type: "string",
          required: true,
          defaultValue: "other",
        },
        role: {
          type: "string",
          required: false,
          defaultValue: "user",
          input: false, // don't allow user to set role
        },
      }
    },
    emailAndPassword: {
      enabled: true,
      revokeSessionsOnPasswordReset: true,
      sendResetPassword: async ({ user, url }, request) => {
        const locale = getRequestLocale(request);
        // Not awaited, so the response doesn't reveal whether the account exists (or fail if SMTP is down)
        buildResetPasswordEmail(locale, user.name, url)
          .then((email) => sendEmail({ to: user.email, ...email }))
          .catch((error) => console.error("Error sending password reset email:", error));
      },
    },
    rateLimit: {
      customRules: {
        "/request-password-reset": { window: 60, max: 3 }, // max 3 reset emails per minute per IP
      },
    },
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    hooks: {
      before: createAuthMiddleware(async ctx => {
        const password = ctx.path === "/sign-up/email"
          ? ctx.body.password
          : ctx.path === "/reset-password" || ctx.path === "/change-password"
            ? ctx.body.newPassword
            : undefined;
        if (password !== undefined) {
          const { error } = passwordSchema({
            passwordRequired: "Password is required",
            passwordMinLength: "Password is too short",
            passwordLetter: "Password must contain a letter",
            passwordNumber: "Password must contain a number",
            passwordSpecialChar: "Password must contain a special character",
          }).safeParse(password);
          if (error) {
            throw new APIError("BAD_REQUEST", { message: "Password not strong enough." });
          }
        }
      })
    },
    plugins: [admin(), nextCookies()] // make sure this is the last plugin in the array
});
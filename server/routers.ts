import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { consumeOtpChallenge, createApplication, createOtpChallenge, getLatestOtpChallenge, increaseOtpAttempts, upsertPhoneUser } from "./db";
import { createOtpCode, hashOtp, normalizePhone, OTP_MAX_ATTEMPTS, OTP_RESEND_MS, OTP_TTL_MS, sendOtpSms, setOtpSession } from "./otp";
import { OTP_SESSION_COOKIE } from "./otp";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      ctx.res.clearCookie(OTP_SESSION_COOKIE, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  application: router({
    create: publicProcedure.input(z.object({ listingId: z.string().min(1).max(96), listingTitle: z.string().min(1).max(255), name: z.string().trim().min(2).max(128), phone: z.string().min(10).max(32), consent: z.literal(true) })).mutation(async ({ input }) => {
      const phone = normalizePhone(input.phone);
      await createApplication({ listingId: input.listingId, listingTitle: input.listingTitle, applicantName: input.name, phone, status: "new" });
      return { success: true } as const;
    }),
  }),
  otp: router({
    request: publicProcedure.input(z.object({ phone: z.string().min(10).max(32) })).mutation(async ({ input }) => {
      const phone = normalizePhone(input.phone);
      const phoneHash = hashOtp(phone);
      const previous = await getLatestOtpChallenge(phoneHash);
      const now = Date.now();
      if (previous && previous.nextAllowedAt.getTime() > now) throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: "Повторный код можно запросить через минуту." });
      const code = createOtpCode();
      const delivery = await sendOtpSms(phone, code);
      await createOtpChallenge({ phoneHash, codeHash: hashOtp(code), expiresAt: new Date(now + OTP_TTL_MS), nextAllowedAt: new Date(now + OTP_RESEND_MS) });
      return { success: true, retryAfterSeconds: 60, channel: delivery.channel, testCode: delivery.testCode };
    }),
    verify: publicProcedure.input(z.object({ phone: z.string().min(10).max(32), code: z.string().regex(/^\d{6}$/), name: z.string().trim().max(128).optional() })).mutation(async ({ ctx, input }) => {
      const phone = normalizePhone(input.phone);
      const challenge = await getLatestOtpChallenge(hashOtp(phone));
      if (!challenge || challenge.expiresAt.getTime() < Date.now()) throw new TRPCError({ code: "BAD_REQUEST", message: "Код истёк. Запросите новый." });
      if (challenge.attempts >= OTP_MAX_ATTEMPTS) throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: "Слишком много попыток. Запросите новый код." });
      if (challenge.codeHash !== hashOtp(input.code)) { await increaseOtpAttempts(challenge.id); throw new TRPCError({ code: "BAD_REQUEST", message: "Неверный код. Проверьте и попробуйте ещё раз." }); }
      await consumeOtpChallenge(challenge.id);
      const user = await upsertPhoneUser(phone, input.name);
      await setOtpSession(ctx.res, ctx.req, user.openId);
      return { success: true, user: { name: user.name, phoneLast4: phone.slice(-4) } };
    }),
  }),
});

export type AppRouter = typeof appRouter;

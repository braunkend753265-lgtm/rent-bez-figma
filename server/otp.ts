import { createHash, randomInt } from "node:crypto";
import { SignJWT, jwtVerify } from "jose";
import type { Request, Response } from "express";
import { parse as parseCookie } from "cookie";
import { ENV } from "./_core/env";
import { getSessionCookieOptions } from "./_core/cookies";

export const OTP_SESSION_COOKIE = "rentbez_phone_session";
export const OTP_TTL_MS = 5 * 60 * 1000;
export const OTP_RESEND_MS = 60 * 1000;
export const OTP_MAX_ATTEMPTS = 5;

const secret = new TextEncoder().encode(ENV.cookieSecret || "rentbez-dev-otp-secret");

export function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 11 && (digits.startsWith("7") || digits.startsWith("8"))) return `+7${digits.slice(1)}`;
  if (digits.length === 10) return `+7${digits}`;
  throw new Error("Укажите номер в формате +7 900 000 00 00");
}

export function createOtpCode() { return String(randomInt(100000, 1000000)); }
export function hashOtp(value: string) { return createHash("sha256").update(value).digest("hex"); }

export async function createOtpSession(openId: string) {
  return new SignJWT({ openId, method: "phone_otp" }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(secret);
}

export async function readOtpSession(req: Request) {
  const token = (req.cookies?.[OTP_SESSION_COOKIE] as string | undefined) ?? parseCookie(req.headers.cookie ?? "")[OTP_SESSION_COOKIE];
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return typeof payload.openId === "string" ? payload.openId : null;
  } catch { return null; }
}

export async function setOtpSession(res: Response, req: Request, openId: string) {
  const token = await createOtpSession(openId);
  res.cookie(OTP_SESSION_COOKIE, token, { ...getSessionCookieOptions(req), maxAge: 7 * 24 * 60 * 60 * 1000 });
}

export async function sendOtpSms(phone: string, code: string) {
  if (!ENV.smsRuApiId) {
    if (ENV.isProduction) throw new Error("SMS-доставка пока не настроена.");
    return { channel: "test" as const, testCode: code };
  }
  const body = new URLSearchParams({ api_id: ENV.smsRuApiId, to: phone.replace("+", ""), msg: `Код входа Аренда БЕЗ: ${code}. Не сообщайте его никому.`, json: "1" });
  const response = await fetch("https://sms.ru/sms/send", { method: "POST", body });
  const payload = await response.json() as { status?: string; status_text?: string };
  if (!response.ok || payload.status !== "OK") throw new Error(payload.status_text || "SMS-провайдер временно недоступен.");
  return { channel: "sms" as const, testCode: undefined };
}

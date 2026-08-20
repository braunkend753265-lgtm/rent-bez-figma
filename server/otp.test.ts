import { describe, expect, it } from "vitest";
import { hashOtp, normalizePhone } from "./otp";

describe("OTP utilities", () => {
  it("normalizes supported Russian phone formats to E.164", () => {
    expect(normalizePhone("8 (900) 000-00-00")).toBe("+79000000000");
    expect(normalizePhone("+7 900 000 00 00")).toBe("+79000000000");
  });
  it("rejects incomplete phone values", () => {
    expect(() => normalizePhone("+7 900 00")).toThrow("Укажите номер");
  });
  it("hashes OTP values without retaining a plaintext code", () => {
    expect(hashOtp("123456")).not.toBe("123456");
    expect(hashOtp("123456")).toBe(hashOtp("123456"));
  });
});

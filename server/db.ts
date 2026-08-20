import { and, desc, eq, isNull, sql } from "drizzle-orm";
import { createHash } from "node:crypto";
import { drizzle } from "drizzle-orm/mysql2";
import { applications, InsertApplication, InsertUser, otpChallenges, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function createApplication(application: InsertApplication) {
  const db = await getDb();
  if (!db) throw new Error("База данных временно недоступна.");
  await db.insert(applications).values(application);
}

export async function getLatestOtpChallenge(phoneHash: string) {
  const db = await getDb();
  if (!db) throw new Error("База данных временно недоступна.");
  const result = await db.select().from(otpChallenges).where(and(eq(otpChallenges.phoneHash, phoneHash), isNull(otpChallenges.consumedAt))).orderBy(desc(otpChallenges.createdAt)).limit(1);
  return result[0];
}

export async function createOtpChallenge(values: { phoneHash: string; codeHash: string; expiresAt: Date; nextAllowedAt: Date }) {
  const db = await getDb();
  if (!db) throw new Error("База данных временно недоступна.");
  await db.insert(otpChallenges).values(values);
}

export async function increaseOtpAttempts(id: number) {
  const db = await getDb();
  if (!db) throw new Error("База данных временно недоступна.");
  await db.update(otpChallenges).set({ attempts: sql`${otpChallenges.attempts} + 1` }).where(eq(otpChallenges.id, id));
}

export async function consumeOtpChallenge(id: number) {
  const db = await getDb();
  if (!db) throw new Error("База данных временно недоступна.");
  await db.update(otpChallenges).set({ consumedAt: new Date() }).where(eq(otpChallenges.id, id));
}

export async function upsertPhoneUser(phone: string, name?: string) {
  const openId = `phone:${hashPhone(phone)}`;
  await upsertUser({ openId, name: name?.trim() || null, loginMethod: "phone_otp", lastSignedIn: new Date() });
  const user = await getUserByOpenId(openId);
  if (!user) throw new Error("Не удалось создать сессию пользователя.");
  return user;
}

function hashPhone(phone: string) {
  return createHash("sha256").update(phone).digest("hex");
}

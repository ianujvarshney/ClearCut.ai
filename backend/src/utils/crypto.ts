import bcrypt from "bcryptjs";
import crypto from "crypto";

export function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function randomToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString("hex");
}

export function sha256(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

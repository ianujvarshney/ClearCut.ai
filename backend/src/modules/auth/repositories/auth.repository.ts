import { Types } from "mongoose";
import { SessionModel } from "@/models/Session.model";
import { UserModel } from "@/models/User.model";

export class AuthRepository {
  findUserByEmailWithPassword(email: string) {
    return UserModel.findOne({ email: email.toLowerCase(), deletedAt: { $exists: false } }).select("+passwordHash");
  }

  createUser(payload: { name: string; email: string; passwordHash: string }) {
    return UserModel.create({ ...payload, email: payload.email.toLowerCase() });
  }

  findUserById(id: string | Types.ObjectId) {
    return UserModel.findById(id);
  }

  createSession(payload: {
    userId: Types.ObjectId;
    refreshTokenHash: string;
    expiresAt: Date;
    device: { userAgent?: string; ip?: string };
  }) {
    return SessionModel.create(payload);
  }

  findSessionByRefreshHash(refreshTokenHash: string) {
    return SessionModel.findOne({ refreshTokenHash, revokedAt: { $exists: false } });
  }

  revokeSession(id: string | Types.ObjectId) {
    return SessionModel.findByIdAndUpdate(id, { revokedAt: new Date() });
  }
}

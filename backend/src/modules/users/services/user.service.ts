import { ApiError } from "@/utils/ApiError";
import { hashPassword } from "@/utils/crypto";
import { UserRepository } from "../repositories/user.repository";

export class UserService {
  constructor(private readonly repo = new UserRepository()) {}

  async profile(userId: string) {
    const user = await this.repo.findById(userId);
    if (!user) throw new ApiError(404, "User not found", "USER_NOT_FOUND");
    return user;
  }

  updateProfile(userId: string, payload: Record<string, unknown>) {
    return this.repo.updateById(userId, { $set: payload });
  }

  updateAvatar(userId: string, avatarUrl: string) {
    return this.repo.updateById(userId, { avatarUrl });
  }

  async changePassword(userId: string, password: string) {
    return this.repo.updateById(userId, { passwordHash: await hashPassword(password) });
  }

  deleteAccount(userId: string) {
    return this.repo.updateById(userId, { status: "deleted", deletedAt: new Date() });
  }
}

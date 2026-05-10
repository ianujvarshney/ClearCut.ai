import { ApiError } from "@/utils/ApiError";
import { comparePassword, hashPassword, randomToken, sha256 } from "@/utils/crypto";
import { AuthRepository } from "../repositories/auth.repository";
import { TokenService } from "./token.service";

const refreshDays = 30;

export class AuthService {
  constructor(
    private readonly repo = new AuthRepository(),
    private readonly tokens = new TokenService()
  ) {}

  async register(payload: { name: string; email: string; password: string }, device: { userAgent?: string; ip?: string }) {
    const existing = await this.repo.findUserByEmailWithPassword(payload.email);
    if (existing) throw new ApiError(409, "Email is already registered", "EMAIL_EXISTS");
    const user = await this.repo.createUser({
      name: payload.name,
      email: payload.email,
      passwordHash: await hashPassword(payload.password)
    });
    return this.issueTokens(user.id, user.email, user.role as "admin" | "user", device);
  }

  async login(payload: { email: string; password: string }, device: { userAgent?: string; ip?: string }) {
    const user = await this.repo.findUserByEmailWithPassword(payload.email);
    if (!user || !(await comparePassword(payload.password, user.passwordHash))) {
      throw new ApiError(401, "Invalid email or password", "INVALID_CREDENTIALS");
    }
    if (user.status === "suspended") throw new ApiError(403, "Account is suspended", "ACCOUNT_SUSPENDED");
    return this.issueTokens(user.id, user.email, user.role as "admin" | "user", device);
  }

  async refresh(refreshToken: string) {
    const payload = this.tokens.verifyRefreshToken(refreshToken);
    const session = await this.repo.findSessionByRefreshHash(sha256(refreshToken));
    if (!session) throw new ApiError(401, "Refresh token is no longer valid", "REFRESH_REVOKED");
    const user = await this.repo.findUserById(payload.sub);
    if (!user) throw new ApiError(401, "User no longer exists", "USER_NOT_FOUND");
    return {
      accessToken: this.tokens.createAccessToken({ sub: user.id, email: user.email, role: user.role as "admin" | "user", sessionId: session.id })
    };
  }

  async logout(refreshToken: string) {
    const session = await this.repo.findSessionByRefreshHash(sha256(refreshToken));
    if (session) await this.repo.revokeSession(session.id);
  }

  requestPasswordReset(email: string) {
    return { email, resetTokenPreview: randomToken(16), delivery: "email-provider-placeholder" };
  }

  verifyEmail() {
    return { verified: true, message: "Email verification placeholder completed" };
  }

  oauth(provider: "google" | "github") {
    return { provider, redirectUrl: `/api/v1/auth/${provider}/callback`, status: "oauth-placeholder" };
  }

  private async issueTokens(userId: string, email: string, role: "admin" | "user", device: { userAgent?: string; ip?: string }) {
    const refreshToken = this.tokens.createRefreshToken({ sub: userId, email, role });
    const session = await this.repo.createSession({
      userId: userId as never,
      refreshTokenHash: sha256(refreshToken),
      expiresAt: new Date(Date.now() + refreshDays * 24 * 60 * 60 * 1000),
      device
    });
    return {
      ...this.tokens.createSessionTokenResponse({ sub: userId, email, role }, session.id, refreshToken),
      user: { id: userId, email, role }
    };
  }
}

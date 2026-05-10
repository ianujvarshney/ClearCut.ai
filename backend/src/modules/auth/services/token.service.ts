import { env } from "@/configs/env";
import { signAccessToken, signRefreshToken, verifyRefreshToken, type TokenPayload } from "@/utils/jwt";

export class TokenService {
  createAccessToken(payload: TokenPayload) {
    return signAccessToken(payload);
  }

  createRefreshToken(payload: TokenPayload) {
    return signRefreshToken(payload);
  }

  createSessionTokenResponse(payload: Omit<TokenPayload, "sessionId">, sessionId: string, refreshToken: string) {
    return {
      accessToken: this.createAccessToken({ ...payload, sessionId }),
      refreshToken,
      accessTokenExpiresIn: env.JWT_ACCESS_EXPIRES_IN,
      refreshTokenExpiresIn: env.JWT_REFRESH_EXPIRES_IN
    };
  }

  verifyRefreshToken(token: string) {
    return verifyRefreshToken(token);
  }
}

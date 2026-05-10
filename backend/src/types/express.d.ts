import type { Types } from "mongoose";

declare global {
  namespace Express {
    interface User {
      id: string;
      role: "admin" | "user";
      email: string;
      permissions?: string[];
    }

    interface Request {
      user?: User;
      apiKey?: {
        id: string;
        ownerId: string | Types.ObjectId;
        scopes: string[];
      };
      requestId?: string;
    }
  }
}

export {};

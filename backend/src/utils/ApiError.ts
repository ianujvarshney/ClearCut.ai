export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code = "API_ERROR",
    public details?: unknown
  ) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}

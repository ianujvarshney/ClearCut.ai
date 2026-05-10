import request from "supertest";
import { createApp } from "../../src/app";

describe("health", () => {
  it("returns service status", async () => {
    const response = await request(createApp()).get("/health");
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});

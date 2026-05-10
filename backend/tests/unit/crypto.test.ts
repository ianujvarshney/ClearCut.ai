import { comparePassword, hashPassword, sha256 } from "../../src/utils/crypto";

describe("crypto utilities", () => {
  it("hashes and verifies passwords", async () => {
    const hash = await hashPassword("super-secret");
    await expect(comparePassword("super-secret", hash)).resolves.toBe(true);
  });

  it("creates stable sha256 hashes", () => {
    expect(sha256("key")).toBe(sha256("key"));
  });
});

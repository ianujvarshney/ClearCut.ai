import { env } from "@/configs/env";
import { logger } from "@/configs/logger";

export type RemoveBackgroundInput = {
  sourceUrl: string;
  background: { type: "transparent" | "white" | "color" | "image"; value?: string };
  model?: "u2net" | "rmbg" | "modnet" | "onnx-u2net";
  requestId?: string;
};

export interface AIBackgroundProvider {
  name: string;
  removeBackground(input: RemoveBackgroundInput): Promise<{ url: string; bytes: number; mimeType: string }>;
}

async function postJson<TResponse>(url: string, payload: unknown, headers: Record<string, string>, timeoutMs = env.AI_JOB_TIMEOUT_MS) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json", ...headers },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    if (!response.ok) throw new Error(`Provider returned ${response.status}`);
    return (await response.json()) as TResponse;
  } finally {
    clearTimeout(timeout);
  }
}

export class FastApiInferenceProvider implements AIBackgroundProvider {
  name = "fastapi-inference";

  async removeBackground(input: RemoveBackgroundInput) {
    return postJson<{ url: string; bytes: number; mimeType: string }>(
      `${env.AI_INFERENCE_URL.replace(/\/$/, "")}/v1/remove-background`,
      {
        sourceUrl: input.sourceUrl,
        background: input.background,
        model: input.model ?? env.AI_MODEL_DEFAULT,
        requestId: input.requestId
      },
      { authorization: `Bearer ${env.AI_SERVICE_JWT}` }
    );
  }
}

export class ClipDropBackgroundProvider implements AIBackgroundProvider {
  name = "clipdrop";

  async removeBackground(input: RemoveBackgroundInput) {
    if (!env.CLIPDROP_API_KEY) throw new Error("CLIPDROP_API_KEY is not configured");
    return postJson<{ url: string; bytes: number; mimeType: string }>(
      env.CLIPDROP_API_URL,
      { imageUrl: input.sourceUrl, background: input.background },
      { "x-api-key": env.CLIPDROP_API_KEY }
    );
  }
}

export class MockBackgroundProvider implements AIBackgroundProvider {
  name = "mock-ai";

  async removeBackground(input: RemoveBackgroundInput) {
    await new Promise((resolve) => setTimeout(resolve, 350));
    return {
      url: `${input.sourceUrl}?processed=mock&background=${input.background.type}`,
      bytes: 512000,
      mimeType: "image/png"
    };
  }
}

export class FallbackBackgroundProvider implements AIBackgroundProvider {
  name = "fallback-chain";

  constructor(private readonly providers: AIBackgroundProvider[]) {}

  async removeBackground(input: RemoveBackgroundInput) {
    const errors: string[] = [];
    for (const provider of this.providers) {
      try {
        const result = await provider.removeBackground(input);
        logger.info({ provider: provider.name, requestId: input.requestId }, "AI provider completed background removal");
        return result;
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown provider error";
        errors.push(`${provider.name}: ${message}`);
        logger.warn({ provider: provider.name, err: error, requestId: input.requestId }, "AI provider failed, trying next fallback");
      }
    }
    throw new Error(`All AI providers failed: ${errors.join("; ")}`);
  }
}

export function createBackgroundProvider() {
  const registry: Record<string, AIBackgroundProvider> = {
    fastapi: new FastApiInferenceProvider(),
    clipdrop: new ClipDropBackgroundProvider(),
    mock: new MockBackgroundProvider()
  };
  const providers = env.AI_PROVIDER_ORDER.split(",")
    .map((name) => registry[name.trim()])
    .filter(Boolean);
  return new FallbackBackgroundProvider(providers.length ? providers : [new MockBackgroundProvider()]);
}

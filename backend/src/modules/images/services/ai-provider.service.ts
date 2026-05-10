export type RemoveBackgroundInput = {
  sourceUrl: string;
  background: { type: "transparent" | "white" | "color" | "image"; value?: string };
};

export interface AIBackgroundProvider {
  removeBackground(input: RemoveBackgroundInput): Promise<{ url: string; bytes: number; mimeType: string }>;
}

export class MockBackgroundProvider implements AIBackgroundProvider {
  async removeBackground(input: RemoveBackgroundInput) {
    await new Promise((resolve) => setTimeout(resolve, 350));
    return {
      url: `${input.sourceUrl}?processed=mock&background=${input.background.type}`,
      bytes: 512000,
      mimeType: "image/png"
    };
  }
}

import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { PLATFORMS, type GenerateRequest, type GenerateResult } from "@/lib/schema";

export const runtime = "nodejs";
export const maxDuration = 60;

const MODEL = process.env.ANTHROPIC_MODEL || "claude-opus-4-8";

const SYSTEM_PROMPT = `You are a senior performance-marketing creative director. Given a brand brief (and optionally a product image), you produce ready-to-run advertising assets.

You output ONLY a single JSON object — no prose, no markdown, no code fences. It must match this exact shape:

{
  "campaignConcept": string,        // 1-2 sentence description of the creative angle
  "variants": [                      // one object PER platform listed below
    {
      "platform": string,            // exactly one of the allowed platform names
      "headline": string,            // platform-appropriate length
      "primaryText": string,         // the main ad body copy
      "description": string,         // short supporting line / link description
      "cta": string                  // call-to-action label, e.g. "Shop Now"
    }
  ],
  "design": {
    "backgroundColor": string,       // hex like "#0F172A"
    "accentColor": string,           // hex — used for the CTA button & badge
    "textColor": string,             // hex — readable over the background
    "headline": string,              // SHORT punchy on-image headline (<= 6 words)
    "subheadline": string,           // one supporting line
    "ctaLabel": string,              // button text, e.g. "Shop now"
    "badge": string,                 // short corner badge like "NEW" or "-20%", or "" for none
    "layout": string                 // one of: "image-bg", "image-top", "image-side", "text-only"
  }
}

Rules:
- Produce exactly one "variants" entry for EACH of these platforms: PLATFORM_LIST.
- Tailor tone and length to each platform (Google Search = tight, TikTok = punchy/casual, LinkedIn = professional, etc.).
- Respect the requested brand voice and lean on the requested brand color when choosing "accentColor"/"backgroundColor", but ensure strong contrast and readability.
- Keep the on-image "design.headline" very short so it renders well on a creative.
- If a product image is provided, make the copy specific to what you see.
- Never include markdown, comments, or trailing text — JSON only.`;

function buildSystem(): string {
  return SYSTEM_PROMPT.replace("PLATFORM_LIST", PLATFORMS.join(", "));
}

function stripToJson(text: string): string {
  let t = text.trim();
  // Remove ```json ... ``` fences if the model added them anyway.
  if (t.startsWith("```")) {
    t = t.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
  }
  const first = t.indexOf("{");
  const last = t.lastIndexOf("}");
  if (first !== -1 && last !== -1 && last > first) {
    t = t.slice(first, last + 1);
  }
  return t;
}

function parseImage(dataUrl?: string | null):
  | { media_type: string; data: string }
  | null {
  if (!dataUrl) return null;
  const match = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/.exec(dataUrl);
  if (!match) return null;
  return { media_type: match[1], data: match[2] };
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "ANTHROPIC_API_KEY is not set. Copy .env.example to .env.local and add your key.",
      },
      { status: 500 },
    );
  }

  let body: GenerateRequest;
  try {
    body = (await req.json()) as GenerateRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body.brand?.trim() || !body.product?.trim()) {
    return NextResponse.json(
      { error: "Please provide at least a brand name and a product description." },
      { status: 400 },
    );
  }

  const client = new Anthropic({ apiKey });

  const brief = [
    `Brand: ${body.brand}`,
    `Product / offer: ${body.product}`,
    body.audience ? `Target audience: ${body.audience}` : "",
    body.tone ? `Brand voice / tone: ${body.tone}` : "",
    body.benefit ? `Key benefit to emphasize: ${body.benefit}` : "",
    body.color ? `Preferred brand color: ${body.color}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const img = parseImage(body.imageDataUrl);

  const userContent: Anthropic.MessageParam["content"] = [];
  if (img) {
    userContent.push({
      type: "image",
      source: {
        type: "base64",
        media_type: img.media_type as
          | "image/jpeg"
          | "image/png"
          | "image/gif"
          | "image/webp",
        data: img.data,
      },
    });
  }
  userContent.push({
    type: "text",
    text: `Create the advertising assets for this brief:\n\n${brief}\n\nReturn ONLY the JSON object.`,
  });

  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 4096,
      system: buildSystem(),
      messages: [{ role: "user", content: userContent }],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    const raw = textBlock && "text" in textBlock ? textBlock.text : "";

    let result: GenerateResult;
    try {
      result = JSON.parse(stripToJson(raw)) as GenerateResult;
    } catch {
      return NextResponse.json(
        { error: "The model returned an unparseable response. Please try again." },
        { status: 502 },
      );
    }

    return NextResponse.json(result);
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unexpected error calling the model.";
    const status =
      err instanceof Anthropic.APIError && typeof err.status === "number"
        ? err.status
        : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

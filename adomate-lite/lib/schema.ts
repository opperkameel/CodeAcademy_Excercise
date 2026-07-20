// Shared types for the generation request/response contract between the
// browser and the /api/generate route.

/** Platforms we generate tailored ad copy for. */
export const PLATFORMS = [
  "Instagram",
  "Facebook",
  "Google Search",
  "LinkedIn",
  "TikTok",
] as const;

export type Platform = (typeof PLATFORMS)[number];

export type LayoutHint =
  | "image-bg"
  | "image-top"
  | "image-side"
  | "text-only";

/** A single platform-tailored copy variant. */
export interface CopyVariant {
  platform: Platform;
  headline: string;
  primaryText: string;
  description: string;
  cta: string;
}

/**
 * A structured "creative brief" that we render deterministically to PNGs at
 * every channel size. Claude acts as the creative director producing this
 * spec; the canvas renderer turns it into real downloadable images.
 */
export interface DesignSpec {
  /** Base background hex, e.g. "#0F172A". */
  backgroundColor: string;
  /** Accent hex used for the CTA button and badge. */
  accentColor: string;
  /** Preferred text hex when there is no product image behind the copy. */
  textColor: string;
  /** Short punchy on-image headline (≤ ~6 words). */
  headline: string;
  /** One supporting line under the headline. */
  subheadline: string;
  /** CTA button label, e.g. "Shop now". */
  ctaLabel: string;
  /** Optional corner badge text, e.g. "NEW" or "-20%". "" for none. */
  badge: string;
  /** Layout hint (the renderer adapts by aspect ratio too). */
  layout: LayoutHint;
}

export interface GenerateResult {
  campaignConcept: string;
  variants: CopyVariant[];
  design: DesignSpec;
}

export interface GenerateRequest {
  brand: string;
  product: string;
  audience: string;
  tone: string;
  benefit: string;
  color: string;
  /** Optional product image as a data URL (data:image/png;base64,...). */
  imageDataUrl?: string | null;
}

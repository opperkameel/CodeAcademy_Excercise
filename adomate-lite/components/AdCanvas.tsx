"use client";

import { useEffect, useRef } from "react";
import type { DesignSpec } from "@/lib/schema";

interface Props {
  width: number;
  height: number;
  design: DesignSpec;
  brand: string;
  image: HTMLImageElement | null;
}

/* ---------- small color helpers ---------- */

function clamp(n: number) {
  return Math.max(0, Math.min(255, Math.round(n)));
}

function parseHex(hex: string): [number, number, number] {
  const h = (hex || "").replace("#", "").trim();
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h.padEnd(6, "0").slice(0, 6);
  const num = parseInt(full || "0f172a", 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function shade([r, g, b]: [number, number, number], amt: number): string {
  // amt in [-1,1]; positive lightens, negative darkens
  const f = (c: number) =>
    clamp(amt >= 0 ? c + (255 - c) * amt : c * (1 + amt));
  return `rgb(${f(r)}, ${f(g)}, ${f(b)})`;
}

function rgba([r, g, b]: [number, number, number], a: number): string {
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function luminance([r, g, b]: [number, number, number]): number {
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

function readableOn(bg: [number, number, number]): string {
  return luminance(bg) > 0.55 ? "#111111" : "#ffffff";
}

/* ---------- text helpers ---------- */

function wrap(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number,
): string[] {
  const words = (text || "").split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
      if (lines.length === maxLines - 1) break;
    } else {
      line = test;
    }
  }
  if (line && lines.length < maxLines) lines.push(line);
  return lines;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const rad = Math.min(r, h / 2, w / 2);
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.arcTo(x + w, y, x + w, y + h, rad);
  ctx.arcTo(x + w, y + h, x, y + h, rad);
  ctx.arcTo(x, y + h, x, y, rad);
  ctx.arcTo(x, y, x + w, y, rad);
  ctx.closePath();
}

/* ---------- the composition ---------- */

function draw(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  design: DesignSpec,
  brand: string,
  image: HTMLImageElement | null,
) {
  const bg = parseHex(design.backgroundColor);
  const accent = parseHex(design.accentColor);
  const u = Math.min(W, H) / 1080; // font/spacing scale
  const pad = Math.min(W, H) * 0.07;

  // Base gradient background (always painted so no transparent gaps show).
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, shade(bg, 0.12));
  grad.addColorStop(1, shade(bg, -0.28));
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  const hasImage = !!image;

  if (hasImage) {
    // Full-bleed cover-fit of the product image.
    const iw = image!.naturalWidth || image!.width;
    const ih = image!.naturalHeight || image!.height;
    const scale = Math.max(W / iw, H / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    ctx.drawImage(image!, (W - dw) / 2, (H - dh) / 2, dw, dh);

    // Readability scrim: darker toward the bottom where the copy sits.
    const scrim = ctx.createLinearGradient(0, 0, 0, H);
    scrim.addColorStop(0, rgba(bg, 0.1));
    scrim.addColorStop(0.5, rgba(bg, 0.2));
    scrim.addColorStop(1, rgba(bg, 0.94));
    ctx.fillStyle = scrim;
    ctx.fillRect(0, 0, W, H);
  }

  const onImage = hasImage;
  const headlineColor = onImage ? "#ffffff" : design.textColor || readableOn(bg);
  const subColor = onImage
    ? "rgba(255,255,255,0.85)"
    : design.textColor || readableOn(bg);

  // ---- Top chips: brand (left) + badge (right) ----
  ctx.textBaseline = "middle";
  const chipH = 52 * u;
  const chipFont = `600 ${26 * u}px var(--font-sans), sans-serif`;

  if (brand) {
    ctx.font = chipFont;
    const label = brand.toUpperCase();
    const tw = ctx.measureText(label).width;
    const cw = tw + 36 * u;
    ctx.fillStyle = "rgba(255,255,255,0.14)";
    roundRect(ctx, pad, pad, cw, chipH, chipH / 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "left";
    ctx.fillText(label, pad + 18 * u, pad + chipH / 2);
  }

  if (design.badge && design.badge.trim()) {
    ctx.font = `700 ${26 * u}px var(--font-sans), sans-serif`;
    const label = design.badge.trim();
    const tw = ctx.measureText(label).width;
    const cw = tw + 36 * u;
    ctx.fillStyle = shade(accent, 0);
    roundRect(ctx, W - pad - cw, pad, cw, chipH, chipH / 2);
    ctx.fill();
    ctx.fillStyle = readableOn(accent);
    ctx.textAlign = "left";
    ctx.fillText(label, W - pad - cw + 18 * u, pad + chipH / 2);
  }

  // ---- Content stack: headline / subheadline / CTA ----
  // With a product image we bottom-anchor over the scrim; without one we
  // build a balanced poster and center the stack vertically.
  const maxTextWidth = W - pad * 2;

  // Headline (larger and bolder when there's no photo competing for attention).
  const headSize = (onImage ? 62 : 78) * u;
  const headFont = `800 ${headSize}px var(--font-sans), sans-serif`;
  const headLineH = headSize * 1.12;
  ctx.font = headFont;
  const headLines = wrap(
    ctx,
    design.headline || design.subheadline || brand,
    maxTextWidth,
    3,
  );

  // Subheadline.
  const subSize = 30 * u;
  const subFont = `500 ${subSize}px var(--font-sans), sans-serif`;
  const subLineH = subSize * 1.32;
  ctx.font = subFont;
  const subLines = wrap(ctx, design.subheadline || "", maxTextWidth, 2);

  // CTA button.
  const ctaFont = `700 ${30 * u}px var(--font-sans), sans-serif`;
  ctx.font = ctaFont;
  const ctaLabel = (design.ctaLabel || "Learn more").trim();
  const ctaTextW = ctx.measureText(ctaLabel).width;
  const ctaW = ctaTextW + 56 * u;
  const ctaH = 74 * u;

  const gapSmall = 24 * u;
  const gapLarge = 40 * u;
  const headBlockH = headLines.length * headLineH;
  const subBlockH = subLines.length * subLineH;
  const stackH =
    headBlockH +
    (subLines.length ? gapSmall + subBlockH : 0) +
    gapLarge +
    ctaH;

  const topLimit = pad + chipH + gapLarge;
  let startY: number;
  if (onImage) {
    startY = H - pad - stackH; // bottom-anchored over the scrim
  } else {
    startY = Math.max(topLimit, (H - stackH) / 2 + chipH * 0.4); // centered
  }

  // Draw headline.
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.font = headFont;
  ctx.fillStyle = headlineColor;
  if (onImage) {
    ctx.shadowColor = "rgba(0,0,0,0.45)";
    ctx.shadowBlur = 12 * u;
    ctx.shadowOffsetY = 2 * u;
  }
  let y = startY;
  headLines.forEach((ln, i) => {
    ctx.fillText(ln, pad, y + i * headLineH);
  });
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;
  y += headBlockH;

  // Draw subheadline.
  if (subLines.length) {
    y += gapSmall;
    ctx.font = subFont;
    ctx.fillStyle = typeof subColor === "string" ? subColor : "#ffffff";
    subLines.forEach((ln, i) => {
      ctx.fillText(ln, pad, y + i * subLineH);
    });
    y += subBlockH;
  }

  // Draw CTA button.
  y += gapLarge;
  ctx.fillStyle = shade(accent, 0);
  roundRect(ctx, pad, y, ctaW, ctaH, 16 * u);
  ctx.fill();
  ctx.font = ctaFont;
  ctx.fillStyle = readableOn(accent);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(ctaLabel, pad + ctaW / 2, y + ctaH / 2 + 1);
}

export default function AdCanvas({ width, height, design, brand, image }: Props) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    draw(ctx, width, height, design, brand, image);
  }, [width, height, design, brand, image]);

  const download = () => {
    const canvas = ref.current;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(brand || "ad").toLowerCase().replace(/\s+/g, "-")}-${width}x${height}.png`;
    a.click();
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900">
        <canvas
          ref={ref}
          width={width}
          height={height}
          className="block h-auto w-full"
        />
      </div>
      <button
        onClick={download}
        className="self-start rounded-md bg-neutral-800 px-3 py-1.5 text-xs font-medium text-neutral-200 transition hover:bg-neutral-700"
      >
        Download PNG
      </button>
    </div>
  );
}

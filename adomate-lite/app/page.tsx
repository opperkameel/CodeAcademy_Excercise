"use client";

import { useEffect, useMemo, useState } from "react";
import AdCanvas from "@/components/AdCanvas";
import CopyCard from "@/components/CopyCard";
import { CHANNELS } from "@/lib/channels";
import type { GenerateRequest, GenerateResult } from "@/lib/schema";

const EXAMPLE: GenerateRequest = {
  brand: "Lumen Coffee",
  product: "Single-origin cold brew delivered fresh every week",
  audience: "Busy professionals who love good coffee but hate the morning queue",
  tone: "Warm, confident, a little playful",
  benefit: "Barista-grade cold brew at home, zero effort",
  color: "#0E7C5A",
  imageDataUrl: null,
};

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-400">
      {children}
    </label>
  );
}

const inputCls =
  "w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-100 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500";

export default function Home() {
  const [form, setForm] = useState<GenerateRequest>({
    brand: "",
    product: "",
    audience: "",
    tone: "",
    benefit: "",
    color: "#4F46E5",
    imageDataUrl: null,
  });
  const [imageEl, setImageEl] = useState<HTMLImageElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerateResult | null>(null);

  const set = <K extends keyof GenerateRequest>(k: K, v: GenerateRequest[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  // Load the uploaded image into an HTMLImageElement for the canvas.
  useEffect(() => {
    if (!form.imageDataUrl) {
      setImageEl(null);
      return;
    }
    const img = new Image();
    img.onload = () => setImageEl(img);
    img.onerror = () => setImageEl(null);
    img.src = form.imageDataUrl;
  }, [form.imageDataUrl]);

  const onFile = (file: File | null) => {
    if (!file) {
      set("imageDataUrl", null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => set("imageDataUrl", reader.result as string);
    reader.readAsDataURL(file);
  };

  const generate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed.");
      setResult(data as GenerateResult);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const canGenerate = form.brand.trim() && form.product.trim() && !loading;

  const design = result?.design;
  const brand = form.brand.trim() || "Your Brand";

  const creatives = useMemo(() => CHANNELS, []);

  return (
    <main className="mx-auto max-w-7xl px-5 py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">
          Adomate <span className="text-indigo-400">Lite</span>
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-neutral-400">
          Turn a short brief into on-brand ad copy for every channel and
          downloadable creatives at every size — powered by Claude. Your own
          lightweight, self-hostable take on Adomate.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
        {/* ---- Brief form ---- */}
        <section className="space-y-4">
          <div>
            <Label>Brand name *</Label>
            <input
              className={inputCls}
              value={form.brand}
              onChange={(e) => set("brand", e.target.value)}
              placeholder="Lumen Coffee"
            />
          </div>
          <div>
            <Label>Product / offer *</Label>
            <textarea
              className={inputCls}
              rows={2}
              value={form.product}
              onChange={(e) => set("product", e.target.value)}
              placeholder="Single-origin cold brew delivered fresh weekly"
            />
          </div>
          <div>
            <Label>Target audience</Label>
            <input
              className={inputCls}
              value={form.audience}
              onChange={(e) => set("audience", e.target.value)}
              placeholder="Busy professionals who love good coffee"
            />
          </div>
          <div>
            <Label>Brand voice / tone</Label>
            <input
              className={inputCls}
              value={form.tone}
              onChange={(e) => set("tone", e.target.value)}
              placeholder="Warm, confident, a little playful"
            />
          </div>
          <div>
            <Label>Key benefit</Label>
            <input
              className={inputCls}
              value={form.benefit}
              onChange={(e) => set("benefit", e.target.value)}
              placeholder="Barista-grade coffee at home, zero effort"
            />
          </div>
          <div>
            <Label>Brand color</Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={form.color}
                onChange={(e) => set("color", e.target.value)}
                className="h-9 w-12 cursor-pointer rounded border border-neutral-800 bg-neutral-900"
              />
              <input
                className={inputCls}
                value={form.color}
                onChange={(e) => set("color", e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label>Product image (optional)</Label>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => onFile(e.target.files?.[0] ?? null)}
              className="block w-full text-xs text-neutral-400 file:mr-3 file:rounded-md file:border-0 file:bg-neutral-800 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-neutral-200 hover:file:bg-neutral-700"
            />
            {form.imageDataUrl && (
              <div className="mt-2 flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={form.imageDataUrl}
                  alt="preview"
                  className="h-12 w-12 rounded object-cover"
                />
                <button
                  onClick={() => onFile(null)}
                  className="text-xs text-neutral-500 hover:text-neutral-300"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={generate}
              disabled={!canGenerate}
              className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? "Generating…" : "Generate campaign"}
            </button>
            <button
              onClick={() => setForm(EXAMPLE)}
              className="text-xs text-neutral-500 hover:text-neutral-300"
            >
              Load example
            </button>
          </div>

          {error && (
            <p className="rounded-lg border border-red-900/60 bg-red-950/40 px-3 py-2 text-xs text-red-300">
              {error}
            </p>
          )}
        </section>

        {/* ---- Results ---- */}
        <section className="min-w-0">
          {!result && !loading && (
            <div className="flex h-full min-h-[400px] items-center justify-center rounded-xl border border-dashed border-neutral-800 text-sm text-neutral-600">
              Fill in the brief and generate to see copy + creatives here.
            </div>
          )}

          {loading && (
            <div className="flex h-full min-h-[400px] flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-neutral-800 text-sm text-neutral-500">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-700 border-t-indigo-500" />
              Claude is art-directing your campaign…
            </div>
          )}

          {result && design && (
            <div className="space-y-8">
              <div className="rounded-xl border border-indigo-900/40 bg-indigo-950/20 p-4">
                <div className="text-[10px] font-semibold uppercase tracking-wide text-indigo-400">
                  Campaign concept
                </div>
                <p className="mt-1 text-sm text-neutral-200">
                  {result.campaignConcept}
                </p>
              </div>

              <div>
                <h2 className="mb-3 text-sm font-semibold text-neutral-300">
                  Creatives — one concept, every channel
                </h2>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {creatives.map((c) => (
                    <div key={c.id} className="space-y-1.5">
                      <div className="text-xs text-neutral-500">
                        {c.label} · {c.width}×{c.height}
                      </div>
                      <AdCanvas
                        width={c.width}
                        height={c.height}
                        design={design}
                        brand={brand}
                        image={imageEl}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="mb-3 text-sm font-semibold text-neutral-300">
                  Ad copy — tailored per platform
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {result.variants.map((v, i) => (
                    <CopyCard key={`${v.platform}-${i}`} variant={v} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      <footer className="mt-16 border-t border-neutral-900 pt-6 text-xs text-neutral-600">
        Adomate Lite · Next.js + Claude · creatives rendered locally in your
        browser via canvas.
      </footer>
    </main>
  );
}

"use client";

import { useState } from "react";
import type { CopyVariant } from "@/lib/schema";

function Field({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      /* clipboard unavailable */
    }
  };
  return (
    <div className="group">
      <div className="mb-0.5 flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-neutral-500">
          {label}
        </span>
        <button
          onClick={copy}
          className="text-[10px] text-neutral-500 opacity-0 transition group-hover:opacity-100 hover:text-indigo-400"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <p className="text-sm text-neutral-200">{value}</p>
    </div>
  );
}

export default function CopyCard({ variant }: { variant: CopyVariant }) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4">
      <div className="mb-3 inline-flex rounded-full bg-indigo-500/15 px-2.5 py-1 text-xs font-semibold text-indigo-300">
        {variant.platform}
      </div>
      <div className="space-y-3">
        <Field label="Headline" value={variant.headline} />
        <Field label="Primary text" value={variant.primaryText} />
        <Field label="Description" value={variant.description} />
        <Field label="CTA" value={variant.cta} />
      </div>
    </div>
  );
}

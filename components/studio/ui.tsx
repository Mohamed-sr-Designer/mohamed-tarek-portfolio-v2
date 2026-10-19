"use client";

import { createContext, useContext, useRef, useState } from "react";
import type { Overrides } from "@/lib/merge";
import type { GhConfig } from "@/lib/github";
import { assetUrl, knownAssets } from "@/lib/assets";

// Shared pieces of the dashboard: the document context and the form controls.

export type StudioCtx = {
  doc: Overrides;
  update: (fn: (d: Overrides) => void) => void;
  gh: GhConfig;
  /** uploads an image to the repo; returns its site path ("/uploads/x.webp") */
  upload: (file: File, targetPath?: string) => Promise<string>;
  /** local previews for images uploaded in this session (not yet deployed) */
  previews: Record<string, string>;
  toast: (msg: string, kind?: "ok" | "err") => void;
};

export const Studio = createContext<StudioCtx | null>(null);
export const useStudio = () => {
  const c = useContext(Studio);
  if (!c) throw new Error("outside studio");
  return c;
};

export function Btn({
  children,
  onClick,
  kind = "ghost",
  disabled,
  type = "button",
  title,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  kind?: "primary" | "ghost" | "danger";
  disabled?: boolean;
  type?: "button" | "submit";
  title?: string;
  className?: string;
}) {
  const style =
    kind === "primary"
      ? "border-mint bg-mint text-ink-900 font-semibold hover:brightness-110"
      : kind === "danger"
        ? "border-electric/50 bg-ink-800 text-electric hover:bg-electric hover:text-ink-900"
        : "border-line/20 bg-ink-800 text-bone-100 hover:border-mint/60 hover:text-mint";
  return (
    <button
      type={type}
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex min-h-[40px] items-center justify-center gap-2 rounded-full border px-4 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${style} ${className}`}
    >
      {children}
    </button>
  );
}

export function Field({
  label,
  value,
  onChange,
  multiline,
  dir,
  changed,
  onReset,
  placeholder,
  hint,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  dir?: "rtl" | "ltr";
  changed?: boolean;
  onReset?: () => void;
  placeholder?: string;
  hint?: string;
  type?: string;
}) {
  const long = multiline ?? value.length > 70;
  const cls =
    "mt-1.5 w-full rounded-xl border border-line/15 bg-ink-900 px-3.5 py-2.5 text-[15px] text-bone-50 outline-none transition-colors placeholder:text-bone-500 focus:border-mint/70";
  return (
    <label className="block">
      <span className="flex items-center justify-between gap-3 text-xs text-bone-400">
        <span className="flex min-w-0 items-center gap-2">
          {changed ? <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-electric" title="Edited" /> : null}
          <span className="truncate">{label}</span>
        </span>
        {changed && onReset ? (
          <button type="button" onClick={onReset} className="shrink-0 text-[11px] text-bone-400 underline-offset-2 hover:text-mint hover:underline">
            reset
          </button>
        ) : null}
      </span>
      {long ? (
        <textarea
          dir={dir}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          rows={Math.min(10, Math.max(3, Math.ceil(value.length / 70)))}
          className={`${cls} resize-y leading-relaxed`}
        />
      ) : (
        <input dir={dir} type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className={cls} />
      )}
      {hint ? <span className="mt-1 block text-[11px] text-bone-500">{hint}</span> : null}
    </label>
  );
}

export function Select<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs text-bone-400">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="mt-1.5 w-full rounded-xl border border-line/15 bg-ink-900 px-3.5 py-2.5 text-[15px] text-bone-50 outline-none focus:border-mint/70"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Card({ title, children, actions }: { title?: string; children: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-line/10 bg-ink-800 p-4 md:p-6">
      {title || actions ? (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          {title ? <h3 className="text-base font-semibold text-bone-50">{title}</h3> : <span />}
          {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}

/** Thumbnail for a site image path, falling back to this session's upload preview. */
export function Thumb({ src, className = "" }: { src: string; className?: string }) {
  const { previews } = useStudio();
  const [broken, setBroken] = useState(false);
  if (!src) return <div className={`grid place-items-center bg-ink-700 text-[10px] text-bone-500 ${className}`}>no image</div>;
  const url = previews[src] ?? assetUrl(src);
  return broken ? (
    <div className={`grid place-items-center bg-ink-700 p-1 text-center text-[10px] text-bone-500 ${className}`}>live after publish</div>
  ) : (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={url} alt="" loading="lazy" onError={() => setBroken(true)} className={`bg-ink-700 object-cover ${className}`} />
  );
}

/** Image path input: type or pick a known path, or upload a new file. */
export function ImageField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const { upload, toast } = useStudio();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const listId = "known-assets";
  return (
    <div>
      <span className="text-xs text-bone-400">{label}</span>
      <div className="mt-1.5 flex items-center gap-3">
        <Thumb src={value} className="h-14 w-14 shrink-0 rounded-lg" />
        <input
          list={listId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/work/... or https://..."
          className="min-w-0 flex-1 rounded-xl border border-line/15 bg-ink-900 px-3.5 py-2.5 text-sm text-bone-50 outline-none focus:border-mint/70"
        />
        <Btn
          disabled={busy}
          onClick={() => input.current?.click()}
          title="Upload a new image"
        >
          {busy ? "…" : "Upload"}
        </Btn>
        <input
          ref={input}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={async (e) => {
            const f = e.target.files?.[0];
            e.target.value = "";
            if (!f) return;
            setBusy(true);
            try {
              onChange(await upload(f));
              toast("Image uploaded");
            } catch (err) {
              toast(String((err as Error).message), "err");
            } finally {
              setBusy(false);
            }
          }}
        />
      </div>
    </div>
  );
}

export function KnownAssetsList() {
  return (
    <datalist id="known-assets">
      {knownAssets().map((k) => (
        <option key={k} value={k} />
      ))}
    </datalist>
  );
}

/** A list of strings edited as one textarea, one item per line. */
export function LinesField({
  label,
  value,
  onChange,
  dir,
  hint,
}: {
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
  dir?: "rtl" | "ltr";
  hint?: string;
}) {
  // local text so an empty line can exist while typing; the saved list drops
  // blank lines
  const [text, setText] = useState(value.join("\n"));
  return (
    <Field
      label={label}
      multiline
      dir={dir}
      hint={hint ?? "One per line"}
      value={text}
      onChange={(v) => {
        setText(v);
        onChange(v.split("\n").map((x) => x.trim()).filter(Boolean));
      }}
    />
  );
}

"use client";

import { useEffect, useState } from "react";
import { Media } from "@/components/ui/Media";
import { useLang } from "@/lib/i18n";

// Infinite scrolling strip at the bottom of the home page.
// Uses the same marquee animation as the client-logo strip.
//
// 37-49 are the ElSewedy posts added in v2. The wall is shuffled on every
// visit so the new set mixes in with the rest instead of arriving as one block,
// and no two visits open on the same row.
const all = Array.from(
  { length: 49 },
  (_, i) => `/slider/${String(i + 1).padStart(2, "0")}.webp`
);

function shuffle<T>(xs: T[]): T[] {
  const a = xs.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const split = (xs: string[]) => {
  const per = Math.ceil(xs.length / 2);
  return [xs.slice(0, per), xs.slice(per)];
};

function Row({ imgs, reverse }: { imgs: string[]; reverse?: boolean }) {
  const track = [...imgs, ...imgs];
  return (
    <div className="flex w-max">
      <div
        className={`flex w-max gap-4 pr-4 ${
          reverse ? "animate-marquee-rev" : "animate-marquee"
        }`}
      >
        {track.map((src, i) => (
          <div
            key={src + i}
            className="h-40 shrink-0 overflow-hidden rounded-xl bg-ink-700 sm:h-56"
          >
            <Media
              src={src}
              alt="Selected design"
              sizes="240px"
              className="h-full w-auto object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LoopSlider() {
  const { t } = useLang();
  // the static export renders the original order; the shuffle happens after
  // mount so the server HTML and the first client render still match
  const [rows, setRows] = useState(() => split(all));
  useEffect(() => setRows(split(shuffle(all))), []);

  return (
    <section className="overflow-hidden section-y">
      <div className="container-edge mx-auto mb-8 flex max-w-edge items-center justify-between gap-4 text-xs uppercase tracking-ultra text-bone-400">
        <span>{t.social.label}</span>
        <a href="#work" className="link-underline inline-flex min-h-[40px] shrink-0 items-center text-bone-200">
          {t.social.browse}
        </a>
      </div>

      <div className="flex flex-col gap-4">
        <Row imgs={rows[0]} />
        <Row imgs={rows[1]} reverse />
      </div>
    </section>
  );
}

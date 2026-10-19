import Image from "next/image";
import { assetUrl, getAsset } from "@/lib/assets";

// Optimized image wrapper. Pulls width/height/blur from the generated manifest
// so every image ships a blur-up placeholder and correct intrinsic ratio, and
// its URL carries a hash of the file's bytes so a replaced image is never
// served from a stale cache (see lib/assets.ts).
export function Media({
  src,
  alt,
  sizes = "100vw",
  priority = false,
  fill = false,
  className,
}: {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  fill?: boolean;
  className?: string;
}) {
  const meta = getAsset(src);
  const url = assetUrl(src);

  if (fill) {
    return (
      <Image
        src={url}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        placeholder={meta.blur ? "blur" : "empty"}
        blurDataURL={meta.blur || undefined}
        className={className}
      />
    );
  }

  return (
    <Image
      src={url}
      alt={alt}
      width={meta.width}
      height={meta.height}
      sizes={sizes}
      priority={priority}
      placeholder={meta.blur ? "blur" : "empty"}
      blurDataURL={meta.blur || undefined}
      className={className}
    />
  );
}

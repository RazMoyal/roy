"use client";

import Image from "next/image";
import { CldImage } from "next-cloudinary";

type SiteImageProps = {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
  loading?: "eager" | "lazy";
  /** Cloudinary quality syntax (e.g. "auto:eco", "auto:good"); ignored for local images. */
  quality?: string;
};

/**
 * Every image uploaded since the Cloudinary migration lives at
 * res.cloudinary.com and renders through CldImage, which applies Cloudinary's
 * own auto-format/auto-quality delivery. The original local seed photos
 * under /uploads (never migrated) still render through plain next/image.
 */
export function SiteImage({ src, alt, quality, ...props }: SiteImageProps) {
  if (src.includes("res.cloudinary.com")) {
    return <CldImage src={src} alt={alt} quality={quality} {...props} />;
  }
  return <Image src={src} alt={alt} {...props} />;
}

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { HOME_HERO_SLUG, isSlugFormat } from "@/lib/event-types";
import { SESSION_COOKIE, isValidSessionToken } from "@/lib/auth";
import {
  deleteEventImage,
  eventFolder,
  resourceTypeFromUrl,
  uploadEventImage,
} from "@/lib/cloudinary";

async function requireAuth() {
  const cookieStore = await cookies();
  return isValidSessionToken(cookieStore.get(SESSION_COOKIE)?.value);
}

export async function POST(request: Request) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const formData = await request.formData();
  const file = formData.get("file");
  const slug = formData.get("slug");

  if (typeof slug !== "string" || !isSlugFormat(slug)) {
    return NextResponse.json({ error: "Invalid event slug" }, { status: 400 });
  }

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  // Only the hero media slot accepts video; every other upload (gallery,
  // cover, banner) stays image-only. No MIME/extension allowlist beyond
  // that — some mobile browsers send an empty or generic file.type (notably
  // for HEIC), and a hand-maintained extension list would always lag behind
  // the formats people actually use. Cloudinary itself validates the
  // content against the requested resource_type and rejects anything that
  // doesn't match, so it's the single source of truth.
  const isHeroSlug = slug === HOME_HERO_SLUG;
  const resourceType = isHeroSlug && file.type.startsWith("video/") ? "video" : "image";
  try {
    const { publicId, url } = await uploadEventImage(buffer, slug, resourceType);
    return NextResponse.json({ id: publicId, url, resourceType });
  } catch {
    return NextResponse.json(
      { error: isHeroSlug ? "File must be an image or video" : "File must be an image" },
      { status: 400 },
    );
  }
}

/**
 * Recovers the Cloudinary public_id from a delivery URL, e.g.
 * https://res.cloudinary.com/<cloud>/image/upload/v169.../roy-events/slug/abc123.jpg
 * -> roy-events/slug/abc123
 */
function publicIdFromUrl(url: string): string | null {
  const match = url.match(
    /\/upload\/(?:[a-z]+_[^/]+\/)*(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/,
  );
  return match ? match[1] : null;
}

export async function DELETE(request: Request) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { slug, url } = (await request.json()) as {
    slug: string;
    url: string;
  };

  if (!isSlugFormat(slug)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const publicId = publicIdFromUrl(url);
  if (!publicId || !publicId.startsWith(`${eventFolder(slug)}/`)) {
    // Not a Cloudinary asset we own (e.g. one of the original local seed
    // images) — nothing to delete on our end.
    return NextResponse.json({ ok: true });
  }

  await deleteEventImage(publicId, resourceTypeFromUrl(url));
  return NextResponse.json({ ok: true });
}

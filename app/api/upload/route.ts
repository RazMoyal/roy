import { NextResponse } from "next/server";
import { isSlugFormat } from "@/lib/event-types";
import {
  deleteEventImage,
  eventFolder,
  uploadEventImage,
} from "@/lib/cloudinary";

export async function POST(request: Request) {
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

  // No MIME/extension allowlist here — some mobile browsers send an empty or
  // generic file.type (notably for HEIC), and a hand-maintained extension
  // list would always lag behind the formats people actually use. Cloudinary
  // itself validates the content against resource_type: "image" and rejects
  // anything that isn't a real image, so it's the single source of truth.
  try {
    const { publicId, url } = await uploadEventImage(buffer, slug);
    return NextResponse.json({ id: publicId, url });
  } catch {
    return NextResponse.json({ error: "File must be an image" }, { status: 400 });
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

  await deleteEventImage(publicId);
  return NextResponse.json({ ok: true });
}

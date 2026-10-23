import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { readSiteContent, writeSiteContent } from "@/lib/content";
import { isSlugFormat } from "@/lib/event-types";
import type { SiteContent } from "@/types/content";

export async function GET() {
  const content = await readSiteContent();
  return NextResponse.json(content);
}

export async function PUT(request: Request) {
  const body = (await request.json()) as SiteContent;

  const slugs = Object.keys(body.events ?? {});
  if (slugs.some((slug) => !isSlugFormat(slug))) {
    return NextResponse.json({ error: "Invalid event slug" }, { status: 400 });
  }

  const previous = await readSiteContent();
  await writeSiteContent(body);

  // Event types removed in the admin: drop the images uploaded for them.
  // Shared images at the root of /uploads are never touched.
  const removed = Object.keys(previous.events).filter(
    (slug) => !(slug in body.events),
  );
  for (const slug of removed) {
    const dir = path.join(process.cwd(), "public", "uploads", slug);
    await fs.rm(dir, { recursive: true, force: true });
  }

  return NextResponse.json({ ok: true });
}

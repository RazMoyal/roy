import { NextResponse } from "next/server";
import {
  readSiteContent,
  reconcileAllEventImages,
  writeSiteContent,
} from "@/lib/content";
import { isSlugFormat } from "@/lib/event-types";
import type { SiteContent } from "@/types/content";

export async function GET() {
  const content = await readSiteContent();
  const events = await reconcileAllEventImages(content.events);
  return NextResponse.json({ ...content, events });
}

export async function PUT(request: Request) {
  const body = (await request.json()) as SiteContent;

  const slugs = Object.keys(body.events ?? {});
  if (slugs.some((slug) => !isSlugFormat(slug))) {
    return NextResponse.json({ error: "Invalid event slug" }, { status: 400 });
  }

  const categorySlugs = Object.keys(body.categories ?? {});
  if (categorySlugs.some((slug) => !isSlugFormat(slug))) {
    return NextResponse.json(
      { error: "Invalid category slug" },
      { status: 400 },
    );
  }

  await writeSiteContent(body);

  return NextResponse.json({ ok: true });
}

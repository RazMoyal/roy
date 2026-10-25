import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  readSiteContent,
  reconcileAllEventImages,
  writeSiteContent,
} from "@/lib/content";
import { isSlugFormat } from "@/lib/event-types";
import { SESSION_COOKIE, isValidSessionToken } from "@/lib/auth";
import type { SiteContent } from "@/types/content";

async function requireAuth() {
  const cookieStore = await cookies();
  return isValidSessionToken(cookieStore.get(SESSION_COOKIE)?.value);
}

export async function GET() {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const content = await readSiteContent();
  const events = await reconcileAllEventImages(content.events);
  return NextResponse.json({ ...content, events });
}

export async function PUT(request: Request) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
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

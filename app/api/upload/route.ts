import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { isSlugFormat } from "@/lib/event-types";

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

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "File must be an image" }, { status: 400 });
  }

  const ext = path.extname(file.name) || ".jpg";
  const id = randomUUID();
  const filename = `${id}${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", slug);
  await fs.mkdir(uploadDir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(uploadDir, filename), buffer);

  const url = `/uploads/${slug}/${filename}`;
  return NextResponse.json({ id, url });
}

export async function DELETE(request: Request) {
  const { slug, url } = (await request.json()) as {
    slug: string;
    url: string;
  };

  if (!isSlugFormat(slug) || !url.startsWith(`/uploads/${slug}/`)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const filePath = path.join(process.cwd(), "public", url.replace(/^\//, ""));
  try {
    await fs.unlink(filePath);
  } catch {
    /* file may already be removed */
  }

  return NextResponse.json({ ok: true });
}

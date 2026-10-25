import { v2 as cloudinary } from "cloudinary";

// The cloud name isn't secret (it's visible in every delivery URL), so it's
// the NEXT_PUBLIC_ variant — shared with the client-side CldImage component.
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/** All uploads live under this root, namespaced per event type slug. */
const ROOT_FOLDER = "roy-events";

export function eventFolder(slug: string): string {
  return `${ROOT_FOLDER}/${slug}`;
}

export type UploadedImage = {
  publicId: string;
  url: string;
};

export type CloudinaryResourceType = "image" | "video";

export async function uploadEventImage(
  buffer: Buffer,
  slug: string,
  resourceType: CloudinaryResourceType = "image",
): Promise<UploadedImage> {
  const result = await cloudinary.uploader.upload(
    `data:application/octet-stream;base64,${buffer.toString("base64")}`,
    { folder: eventFolder(slug), resource_type: resourceType },
  );
  return { publicId: result.public_id, url: result.secure_url };
}

export async function deleteEventImage(
  publicId: string,
  resourceType: CloudinaryResourceType = "image",
): Promise<void> {
  await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
}

/** Cloudinary delivery URLs encode the resource type in the path (.../image/upload/... vs .../video/upload/...). */
export function resourceTypeFromUrl(url: string): CloudinaryResourceType {
  return url.includes("/video/upload/") ? "video" : "image";
}

export type CloudinaryImage = {
  id: string;
  url: string;
  createdAt: string;
};

/** Every image actually sitting in an event type's Cloudinary folder — the source of truth for what exists. */
export async function listEventImages(slug: string): Promise<CloudinaryImage[]> {
  const images: CloudinaryImage[] = [];
  let nextCursor: string | undefined;
  do {
    const result = await cloudinary.api.resources({
      type: "upload",
      resource_type: "image",
      prefix: `${eventFolder(slug)}/`,
      max_results: 500,
      next_cursor: nextCursor,
    });
    for (const resource of result.resources as Array<{
      public_id: string;
      secure_url: string;
      created_at: string;
    }>) {
      images.push({
        id: resource.public_id,
        url: resource.secure_url,
        createdAt: resource.created_at,
      });
    }
    nextCursor = result.next_cursor;
  } while (nextCursor);
  return images;
}

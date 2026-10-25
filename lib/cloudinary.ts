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

export async function uploadEventImage(
  buffer: Buffer,
  slug: string,
): Promise<UploadedImage> {
  const result = await cloudinary.uploader.upload(
    `data:application/octet-stream;base64,${buffer.toString("base64")}`,
    { folder: eventFolder(slug), resource_type: "image" },
  );
  return { publicId: result.public_id, url: result.secure_url };
}

export async function deleteEventImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

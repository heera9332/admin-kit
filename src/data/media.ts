import mediaData from "./media.json";

export type MediaType = "image" | "document" | "video" | "audio" | "archive" | "other";

export interface MediaItem {
  id: string;
  name: string;
  title: string;
  caption?: string;
  altText?: string;
  description?: string;
  url: string;
  thumbnailUrl?: string;
  type: MediaType;
  mimeType: string;
  size: number;
  dimensions?: { width: number; height: number };
  uploadedAt: string;
  author: string;
  extension: string;
}

export const initialMedia: MediaItem[] = mediaData.media as unknown as MediaItem[];

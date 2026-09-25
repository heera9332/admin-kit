import type { Metadata } from "next"
import { MediaFeature } from "@/features/media"

export const metadata: Metadata = {
  title: "Media Library",
  description: "Manage documents, images, audio, video and assets",
}

export default function MediaPage() {
  return <MediaFeature />
}

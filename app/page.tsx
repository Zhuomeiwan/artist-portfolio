import {groq} from "next-sanity";

import {Gallery, type Artwork} from "./Gallery";
import {client} from "@/sanity/lib/client";

const artworksQuery = groq`
  *[_type == "artwork"] | order(_createdAt desc) {
    _id,
    title,
    theme,
    medium,
    story,
    exif,
    materials,
    "imageUrl": image.asset->url,
    "aspectRatio": image.asset->metadata.dimensions.aspectRatio
  }
`;

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const artworks = await client
    .fetch<Artwork[]>(artworksQuery)
    .catch((error) => {
      console.error("Failed to fetch artworks from Sanity", error);
      return [];
    });

  return <Gallery artworks={artworks.filter((artwork) => artwork.imageUrl)} />;
}

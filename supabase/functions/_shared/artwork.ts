import type { SupabaseClient } from "npm:@supabase/supabase-js@2";

export type ArtworkRecord = {
  id: number;
  slug: string;
  is_fav_open: boolean;
  is_comment_open: boolean;
  is_comment_public: boolean;
};

export async function findArtwork(
  client: SupabaseClient,
  slug: string,
): Promise<ArtworkRecord | null> {
  const { data, error } = await client
    .from("artworks")
    .select(
      "id, slug, is_fav_open, is_comment_open, is_comment_public",
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data as ArtworkRecord | null;
}

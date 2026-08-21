import type { SupabaseClient } from "npm:@supabase/supabase-js@2";

export type ContentRecord = {
  id: string;
  content_type: string;
  slug: string;
  title: string;
  publication_state: "hidden" | "teaser" | "partial" | "published" | "archived";
  is_reaction_open: boolean;
  is_comment_open: boolean;
  is_comment_public: boolean;
  is_comment_reaction_open: boolean;
};

export type CommentTargetRecord = {
  id: string;
  public_id: string;
  content_id: string;
  status: "pending" | "published" | "rejected" | "hidden";
};

export async function findContent(
  client: SupabaseClient,
  contentType: string,
  slug: string,
): Promise<ContentRecord | null> {
  const { data, error } = await client
    .from("content_items")
    .select(
      "id, content_type, slug, title, publication_state, is_reaction_open, is_comment_open, is_comment_public, is_comment_reaction_open",
    )
    .eq("content_type", contentType)
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data as ContentRecord | null;
}

export async function findCommentTarget(
  client: SupabaseClient,
  publicId: string,
): Promise<CommentTargetRecord | null> {
  const { data, error } = await client
    .from("community_comments")
    .select("id, public_id, content_id, status")
    .eq("public_id", publicId)
    .maybeSingle();

  if (error) throw error;
  return data as CommentTargetRecord | null;
}

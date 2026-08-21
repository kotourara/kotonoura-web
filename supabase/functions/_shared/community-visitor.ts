import type { SupabaseClient } from "npm:@supabase/supabase-js@2";

export type CommunityVisitorRecord = {
  visitor_hash: string;
  status: "active" | "blocked";
};

export async function touchCommunityVisitor(
  client: SupabaseClient,
  visitorHash: string,
): Promise<CommunityVisitorRecord> {
  const { data, error } = await client
    .from("community_visitors")
    .upsert(
      {
        visitor_hash: visitorHash,
        last_seen_at: new Date().toISOString(),
      },
      { onConflict: "visitor_hash" },
    )
    .select("visitor_hash, status")
    .single();

  if (error) throw error;
  return data as CommunityVisitorRecord;
}

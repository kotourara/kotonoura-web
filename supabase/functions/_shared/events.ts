import type { SupabaseClient } from "npm:@supabase/supabase-js@2";

export type InteractionEventType = "fav_toggle" | "comment_submit";
export type InteractionEventResult = "accepted" | "blocked" | "rejected";

export async function recordInteractionEvent(
  client: SupabaseClient,
  values: {
    artworkId: number | null;
    visitorHash: string;
    eventType: InteractionEventType;
    eventResult: InteractionEventResult;
  },
): Promise<void> {
  const { error } = await client.from("interaction_events").insert({
    artwork_id: values.artworkId,
    visitor_hash: values.visitorHash,
    event_type: values.eventType,
    event_result: values.eventResult,
  });

  if (error) {
    // 主処理を失敗させないが、サーバーログには残す。
    console.error("Failed to record interaction event", error);
  }
}

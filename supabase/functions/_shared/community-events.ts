import type { SupabaseClient } from "npm:@supabase/supabase-js@2";

export type CommunityTargetType = "content" | "comment";
export type CommunityEventResult = "accepted" | "blocked" | "rejected";

export type CommunityEventValues = {
  contentId: string | null;
  commentId?: string | null;
  visitorHash: string;
  targetType: CommunityTargetType;
  eventType: string;
  reactionType?: string | null;
  eventResult: CommunityEventResult;
  metadata?: Record<string, unknown>;
};

export async function recordCommunityEvent(
  client: SupabaseClient,
  values: CommunityEventValues,
): Promise<void> {
  const { error } = await client.from("community_events").insert({
    content_id: values.contentId,
    comment_id: values.commentId ?? null,
    visitor_hash: values.visitorHash,
    target_type: values.targetType,
    event_type: values.eventType,
    reaction_type: values.reactionType ?? null,
    event_result: values.eventResult,
    metadata: values.metadata ?? {},
  });

  if (error) {
    // 履歴記録の失敗で、favやコメントの主処理は失敗させない。
    console.error("Failed to record community event", error);
  }
}

export function recordCommunityEventInBackground(
  client: SupabaseClient,
  values: CommunityEventValues,
): void {
  const task = recordCommunityEvent(client, values);
  const edgeRuntime = (
    globalThis as typeof globalThis & {
      EdgeRuntime?: { waitUntil(promise: Promise<unknown>): void };
    }
  ).EdgeRuntime;

  if (edgeRuntime?.waitUntil) {
    edgeRuntime.waitUntil(task);
    return;
  }

  // ローカル実行などwaitUntilが存在しない環境でも、主処理を待たせない。
  void task;
}

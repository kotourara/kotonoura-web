-- 公開状態の正本はサイト内データとし、Supabaseは明示的な上書き時だけ使用する。
-- Supabase SQL Editorで一度だけ実行する。再実行しても問題ない。

alter table public.content_items
  add column if not exists publication_override boolean not null default false;

-- 移行時は既存作品をすべて通常運用へ戻す。
-- publication_state / publish_at / publication_sections の値自体は保持する。
update public.content_items
set publication_override = false
where publication_override is distinct from false;

comment on column public.content_items.publication_override is
  'true の場合のみ Supabase の publication_state / publish_at / publication_sections でサイト内公開設定を上書きする';

create index if not exists content_items_publication_override_idx
  on public.content_items (content_type, publication_override)
  where publication_override = true;

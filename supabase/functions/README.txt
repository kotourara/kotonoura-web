配置先:
  C:\Users\rickt\OneDrive\デスクトップ\web\project\supabase\functions

今回追加・更新する関数:
  get-content-state      コンテンツfav状態・集計取得
  toggle-reaction        コンテンツfav／コメントfav共通切替
  submit-comment         共通コンテンツへのコメント送信
  get-public-comments    公開コメント＋コメントfav状態取得

共通処理:
  _shared/content.ts
  _shared/community.ts
  _shared/community-events.ts
  _shared/community-visitor.ts

旧関数は移行確認まで削除しません:
  get-artwork-state
  toggle-artwork-fav

反映順:
  1. Supabase SQL Editorで community-engagement.sql を実行
  2. functions と config.toml をプロジェクトへ上書き
  3. 以下をデプロイ

PowerShell例:
  supabase functions deploy get-content-state
  supabase functions deploy toggle-reaction
  supabase functions deploy submit-comment
  supabase functions deploy get-public-comments

必要なSecrets:
  VISITOR_HASH_SECRET
  ALLOWED_ORIGINS

このZIPには秘密値を含みません。

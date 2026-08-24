const CONSULTATION_RECIPIENT = "koto989urara@gmail.com";

const PLAN_LABELS = {
  custom: "【改】カスタムモデリング",
  one: "【壱】モデリング",
  two: "【弐】原画＋フルモデリング",
  three: "【参】フルプロデュース",
  extreme: "【極】高密度フルプロデュース",
  other: "【他】その他のご相談"
};

const MODEL_STATE_LABELS = {
  working: "動作するLive2Dモデルがある",
  parts: "パーツ分け済み原画がある",
  unseparated: "未分けの立ち絵・原画がある",
  design: "キャラクターデザインのみがある",
  preparing: "これから用意する",
  other: "その他"
};

function doPost(e) {
  const parameters = e && e.parameters ? e.parameters : {};
  const requestId = sanitizeRequestId(getFirst(parameters, "request_id"));

  try {
    if (getFirst(parameters, "website")) {
      return createResponse(true, requestId, "送信を受け付けました。");
    }

    validateSubmission(parameters);

    const senderName = getFirst(parameters, "お名前・活動名");
    const senderEmail = getFirst(parameters, "返信用メールアドレス");
    const planId = getFirst(parameters, "希望プラン");
    const planLabel = PLAN_LABELS[planId] || planId;
    const subject = `【制作相談】${planLabel}｜${senderName}`;
    const body = buildMailBody(parameters, planLabel);

    MailApp.sendEmail({
      to: CONSULTATION_RECIPIENT,
      replyTo: senderEmail,
      name: "琴ノ裏工房 制作相談フォーム",
      subject,
      body
    });

    return createResponse(true, requestId, "制作相談を送信しました。");
  } catch (error) {
    console.error(error);
    return createResponse(
      false,
      requestId,
      "送信処理でエラーが発生しました。入力内容を確認し、時間を置いて再度お試しください。"
    );
  }
}

function validateSubmission(parameters) {
  const planId = getFirst(parameters, "希望プラン");
  const budget = getFirst(parameters, "予算");
  const environment = getFirst(parameters, "使用予定環境");
  const modelState = getFirst(parameters, "現在のモデル状態");
  const ageGroup = getFirst(parameters, "年齢区分");
  const email = getFirst(parameters, "返信用メールアドレス");

  requireValue(planId, "希望プラン");
  requireValue(getFirst(parameters, "希望納期"), "希望納期");
  requireValue(budget, "予算");
  requireValue(getFirst(parameters, "ご依頼形態"), "ご依頼形態");
  requireValue(getFirst(parameters, "制作実績公開"), "制作実績の公開条件");
  requireValue(getFirst(parameters, "お名前・活動名"), "お名前・活動名");
  requireValue(email, "返信用メールアドレス");
  requireValue(getFirst(parameters, "活動先URL・Xアカウント"), "活動先URL・Xアカウント");
  requireValue(ageGroup, "年齢区分");
  requireChecked(parameters, "素材権利確認");
  requireChecked(parameters, "返信期限確認");
  requireChecked(parameters, "制作規約確認");
  requireChecked(parameters, "プライバシーポリシー確認");

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u.test(email)) {
    throw new Error("メールアドレスの形式が不正です。");
  }

  if (budget === "明確な上限がある") {
    requireValue(getFirst(parameters, "予算上限額"), "予算上限額");
  }

  if (planId !== "other") {
    requireValue(environment, "使用予定環境");
    requireValue(modelState, "現在のモデル状態");
  }

  if (environment === "その他") {
    requireValue(getFirst(parameters, "使用予定ソフト"), "使用予定ソフト");
  }

  if (environment && environment !== "nizima LIVE") {
    requireChecked(parameters, "対応環境確認");
  }

  if (modelState === "other") {
    requireValue(getFirst(parameters, "モデル状態その他"), "モデル状態その他");
  }

  if (planId === "one") {
    requireValue(getFirst(parameters, "加筆許諾"), "加筆許諾");
    if (modelState === "unseparated" && getAll(parameters, "追加オプション").indexOf("原画調整") === -1) {
      throw new Error("未分け原画の場合は原画調整が必要です。");
    }
  }

  if (planId === "custom") {
    requireValue(getFirst(parameters, "モデリング許諾"), "モデリング許諾");
    if (getAll(parameters, "希望カスタム").length === 0) {
      throw new Error("希望するカスタムが未選択です。");
    }
  }

  if (getAll(parameters, "追加利用範囲").indexOf("その他") !== -1) {
    requireValue(getFirst(parameters, "追加利用範囲その他"), "その他の利用内容");
  }

  if (ageGroup === "未成年") {
    requireChecked(parameters, "親権者同意");
  }
}

function buildMailBody(parameters, planLabel) {
  const modelStateKey = getFirst(parameters, "現在のモデル状態");
  const modelStateLabel = MODEL_STATE_LABELS[modelStateKey] || modelStateKey;
  const customSelections = getAll(parameters, "希望カスタム");
  const options = getAll(parameters, "追加オプション");
  const additionalUse = getAll(parameters, "追加利用範囲");
  const lines = [
    "琴ノ裏工房の制作相談フォームから送信されました。",
    "",
    "────────────────────────",
    "■ 希望条件",
    "────────────────────────",
    `希望プラン：${planLabel}`,
    `希望納期：${displayValue(getFirst(parameters, "希望納期"))}`,
    `予算：${displayValue(getFirst(parameters, "予算"))}`,
    `予算上限額：${appendUnit(getFirst(parameters, "予算上限額"), "万円程度")}`,
    `ご依頼形態：${displayValue(getFirst(parameters, "ご依頼形態"))}`,
    `制作実績の公開：${displayValue(getFirst(parameters, "制作実績公開"))}`,
    "",
    "────────────────────────",
    "■ 制作条件・素材",
    "────────────────────────",
    `希望カスタム：${customSelections.length ? customSelections.join("、") : "なし"}`,
    `追加オプション：${options.length ? options.join("、") : "なし"}`,
    `追加利用範囲：${additionalUse.length ? additionalUse.join("、") : "なし"}`,
    `追加利用範囲（その他）：${displayValue(getFirst(parameters, "追加利用範囲その他"))}`,
    `使用予定環境：${displayValue(getFirst(parameters, "使用予定環境"))}`,
    `使用予定ソフト：${displayValue(getFirst(parameters, "使用予定ソフト"))}`,
    `対応環境確認：${checkedLabel(parameters, "対応環境確認")}`,
    `現在のモデル状態：${displayValue(modelStateLabel)}`,
    `モデル状態補足：${displayValue(getFirst(parameters, "モデル状態その他"))}`,
    `加筆許諾：${displayValue(getFirst(parameters, "加筆許諾"))}`,
    `モデリング許諾：${displayValue(getFirst(parameters, "モデリング許諾"))}`,
    "",
    "────────────────────────",
    "■ 連絡先・確認事項",
    "────────────────────────",
    `お名前 / 活動名：${displayValue(getFirst(parameters, "お名前・活動名"))}`,
    `返信用メールアドレス：${displayValue(getFirst(parameters, "返信用メールアドレス"))}`,
    `活動先URL / Xアカウント：${displayValue(getFirst(parameters, "活動先URL・Xアカウント"))}`,
    `年齢区分：${displayValue(getFirst(parameters, "年齢区分"))}`,
    `親権者同意：${checkedLabel(parameters, "親権者同意")}`,
    `素材権利確認：${checkedLabel(parameters, "素材権利確認")}`,
    `返信期限確認：${checkedLabel(parameters, "返信期限確認")}`,
    `制作規約確認：${checkedLabel(parameters, "制作規約確認")}`,
    `プライバシーポリシー確認：${checkedLabel(parameters, "プライバシーポリシー確認")}`,
    "",
    "────────────────────────",
    "■ ご相談内容",
    "────────────────────────",
    displayValue(getFirst(parameters, "ご相談内容")),
    "",
    "────────────────────────",
    `送信日時：${displayValue(getFirst(parameters, "submitted_at"))}`,
    `リクエストID：${displayValue(getFirst(parameters, "request_id"))}`
  ];

  return lines.join("\n");
}

function getFirst(parameters, key) {
  const values = parameters[key];
  if (!values || values.length === 0) return "";
  return String(values[0]).trim();
}

function getAll(parameters, key) {
  const values = parameters[key];
  if (!values) return [];
  return values.map(function (value) {
    return String(value).trim();
  }).filter(Boolean);
}

function requireValue(value, label) {
  if (!String(value || "").trim()) {
    throw new Error(`${label}が未入力です。`);
  }
}

function requireChecked(parameters, key) {
  if (!getFirst(parameters, key)) {
    throw new Error(`${key}が未確認です。`);
  }
}

function displayValue(value) {
  return String(value || "").trim() || "未入力";
}

function appendUnit(value, unit) {
  const normalized = String(value || "").trim();
  return normalized ? `${normalized}${unit}` : "未入力";
}

function checkedLabel(parameters, key) {
  return getFirst(parameters, key) ? "確認済み" : "未確認";
}

function sanitizeRequestId(value) {
  return String(value || "")
    .replace(/[^a-zA-Z0-9_-]/g, "")
    .slice(0, 100);
}

function createResponse(ok, requestId, message) {
  const payload = JSON.stringify({
    type: "kotono-ura-consultation-response",
    ok: Boolean(ok),
    requestId: sanitizeRequestId(requestId),
    message: String(message || "")
  }).replace(/</g, "\\u003c");

  const html = [
    "<!doctype html>",
    '<html lang="ja"><head><meta charset="utf-8"></head><body>',
    `<script>window.top.postMessage(${payload}, "*");<\/script>`,
    "</body></html>"
  ].join("");

  return HtmlService
    .createHtmlOutput(html)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

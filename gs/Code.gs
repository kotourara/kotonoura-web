const CONSULTATION_RECIPIENT = "koto989urara@gmail.com";
const CONSULTATION_STUDIO_NAME = "琴ノ裏工房";
const CONSULTATION_STAFF_NAME = "琴麗等";

const PLAN_LABELS = {
  custom: "【改】カスタムモデリング",
  one: "【壱】モデリング",
  two: "【弐】原画＋フルモデリング",
  three: "【参】フルプロデュース",
  extreme: "【極】高密度フルプロデュース",
  other: "【他】その他のご相談"
};

const PLAN_MINIMUM_PRICES = {
  custom: 3,
  one: 45,
  two: 60,
  three: 80,
  extreme: 95
};

const CUSTOM_MINIMUM_PRICES = {
  "①目元フルカスタム": 10,
  "②ジト目差分": 3,
  "③瞳モチーフ演出": 5,
  "①母音表現強化": 4,
  "②くちびる表情強化": 5,
  "③骨格連動": 3,
  "①〜③口元フルカスタム": 10,
  "④よだれ口差分": 4,
  "⑤頬ぷく差分": 5,
  "①しなやか髪揺れ": 6,
  "②傾き髪垂れ": 5,
  "①〜②髪質フルカスタム": 10
};

const OPTION_MINIMUM_PRICES = {
  "表情差分追加": 0.5,
  "特殊ギミック追加": 1,
  "実装サポート": 1.5,
  "SNS運用相談": 1.5
};

const MODEL_STATE_LABELS = {
  working: "動作するLive2Dモデルがある",
  parts: "パーツ分け済み原画がある",
  unseparated: "未分けの立ち絵・原画がある",
  design: "キャラクターデザインのみがある",
  preparing: "これから用意する",
  other: "その他"
};

const DECISION_LABELS = {
  A: "受注可能見込み",
  B: "素材・情報確認後に判断",
  C: "条件変更なら受注可能",
  D: "受注不可候補"
};

const DECISION_RANK = { A: 0, B: 1, C: 2, D: 3 };

/*
 * 打合せ候補の抽出条件。
 * 返信は自動送信されないため、候補日時は送信前に必ず目検してください。
 * startHour / endHour は候補を探す時間帯です。
 */
const MEETING_CONFIG = {
  timeZone: "Asia/Tokyo",
  minLeadHours: 48,
  searchDays: 10,
  durationMinutes: 60,
  bufferMinutes: 30,
  stepMinutes: 30,
  startHour: 13,
  endHour: 20,
  maxCandidates: 3
};

function doPost(e) {
  const parameters = e && e.parameters ? e.parameters : {};
  const requestId = sanitizeRequestId(getFirst(parameters, "request_id"));

  try {
    if (getFirst(parameters, "website")) {
      return createResponse(true, requestId, "送信を受け付けました。");
    }

    validateSubmission(parameters);

    const duplicateKey = requestId ? `consultation:${requestId}` : "";
    const cache = CacheService.getScriptCache();
    if (duplicateKey && cache.get(duplicateKey)) {
      return createResponse(true, requestId, "制作相談を送信しました。");
    }

    const senderName = getFirst(parameters, "お名前・活動名");
    const senderEmail = getFirst(parameters, "返信用メールアドレス");
    const planId = getFirst(parameters, "希望プラン");
    const planLabel = PLAN_LABELS[planId] || planId;
    const assessment = assessSubmission(parameters);

    let meetingResult = { candidates: [], error: "" };
    if (assessment.code === "A") {
      meetingResult = getMeetingCandidatesSafely();
      if (meetingResult.error) {
        assessment.flags.push(`打合せ候補の自動取得失敗：${meetingResult.error}`);
      }
      if (meetingResult.candidates.length) {
        assessment.flags.push("打合せ候補はCalendarから自動抽出。送信直前に空き状況を再確認する。");
      }
    }

    const draftData = buildReplyDraft(parameters, assessment, meetingResult.candidates);
    const draftResult = createReplyDraftSafely(senderEmail, draftData.subject, draftData.body);

    if (!draftResult.ok) {
      assessment.flags.push(`Gmail下書きの自動作成失敗：${draftResult.error}`);
    }

    const adminSubject = `【${assessment.code}｜${assessment.stage}】${planLabel}｜${senderName}`;
    const adminBody = buildAdminMailBody(
      parameters,
      planLabel,
      assessment,
      draftData,
      draftResult,
      meetingResult.candidates
    );

    MailApp.sendEmail({
      to: CONSULTATION_RECIPIENT,
      replyTo: senderEmail,
      name: "琴ノ裏工房 制作相談フォーム",
      subject: adminSubject,
      body: adminBody
    });

    if (duplicateKey) {
      cache.put(duplicateKey, "processed", 21600);
    }

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

/*
 * 初回だけApps Scriptエディタから手動実行してください。
 * Gmail下書き作成とCalendar参照に必要な権限確認だけを行い、メール送信や予定作成はしません。
 */
function authorizeConsultationWorkflow() {
  const aliases = GmailApp.getAliases();
  const calendar = CalendarApp.getDefaultCalendar();
  return {
    gmailAuthorized: Array.isArray(aliases),
    calendarName: calendar ? calendar.getName() : ""
  };
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

function assessSubmission(parameters) {
  const planId = getFirst(parameters, "希望プラン");
  const budget = getFirst(parameters, "予算");
  const deadlineStatus = getFirst(parameters, "希望納期受付状態");
  const requestType = getFirst(parameters, "ご依頼形態");
  const portfolio = getFirst(parameters, "制作実績公開");
  const environment = getFirst(parameters, "使用予定環境");
  const modelState = getFirst(parameters, "現在のモデル状態");
  const ageGroup = getFirst(parameters, "年齢区分");
  const artPermission = getFirst(parameters, "加筆許諾");
  const modelPermission = getFirst(parameters, "モデリング許諾");
  const options = getAll(parameters, "追加オプション");
  const additionalUse = getAll(parameters, "追加利用範囲");
  const estimate = estimateMinimumPrice(parameters);

  const assessment = {
    code: ["custom", "one", "other"].indexOf(planId) !== -1 ? "B" : "A",
    stage: "",
    template: "",
    reasons: [],
    flags: [],
    nextActions: [],
    conditions: [],
    estimate
  };

  function raise(code, reason, condition) {
    if (DECISION_RANK[code] > DECISION_RANK[assessment.code]) {
      assessment.code = code;
    }
    if (reason) pushUnique(assessment.reasons, reason);
    if (condition) pushUnique(assessment.conditions, condition);
  }

  if (planId === "custom") {
    pushUnique(assessment.reasons, "既存モデルの編集データ確認が必要");
    pushUnique(assessment.flags, "既存モデル品質を必須目検：原画の崩れ・既存モデリングの補正・追加実装で問題が悪目立ちしないか確認する。");
    pushUnique(assessment.flags, "必須素材：cmo3＋原画PSD。can3はモデル構造により必要。");
  }

  if (planId === "one") {
    pushUnique(assessment.reasons, "持込原画とパーツ構造の確認が必要");
    pushUnique(assessment.flags, "原画PSDを確認してから正式な制作可否・追加調整範囲を判断する。");
  }

  if (planId === "other") {
    pushUnique(assessment.reasons, "掲載外のため制作範囲の追加確認が必要");
  }

  if (!deadlineStatus) {
    raise("B", "希望納期の受付状態を取得できていない");
    pushUnique(assessment.flags, "希望納期の受付状態が未取得。Orderページの最新版反映と受付状況を目検する。");
  } else if (deadlineStatus === "closed") {
    raise(
      "C",
      "希望納期が受付停止中",
      "ご希望納期は現在受付停止中のため、制作時期の調整が必要です。"
    );
  } else if (deadlineStatus === "ask") {
    raise("B", "希望納期が要相談");
    pushUnique(assessment.flags, "希望納期の成立可否を目検する。");
  } else if (deadlineStatus === "limited") {
    pushUnique(assessment.flags, "希望納期は残り僅か。返信時点で枠が残っているか再確認する。");
  }

  if (budget === "明確な上限がある") {
    const cap = Number(getFirst(parameters, "予算上限額"));
    if (Number.isFinite(cap) && estimate.amount !== null && cap < estimate.amount) {
      raise(
        "C",
        `予算上限${cap}万円が現時点の最低見込み${formatManYen(estimate.amount)}を下回る`,
        `ご予算上限は${cap}万円程度とのことですが、現在の選択内容では少なくとも${formatManYen(estimate.amount)}を見込んでいます。内容またはご予算の調整が必要です。`
      );
    }
  }

  if (budget === "掲載している最低価格付近" && (getAll(parameters, "希望カスタム").length || options.length)) {
    pushUnique(assessment.flags, "予算は最低価格付近。追加項目により掲載最低価格を上回る可能性を確認する。");
  }

  if (estimate.hasUnknownAddOn) {
    pushUnique(assessment.flags, "原画調整など要見積項目あり。概算下限だけで確定しない。");
  }

  if (planId === "custom") {
    if (modelPermission === "確認が難しい") {
      raise(
        "D",
        "既存モデルへの追加モデリング許諾を確認できない",
        "既存モデルへの追加モデリングに必要な許諾確認が難しいため、現状のままではお引き受けできません。"
      );
    } else if (modelPermission === "これから確認する") {
      raise("B", "モデリング許諾の取得待ち");
      pushUnique(assessment.flags, "素材確認前にモデリング許諾の取得状況を確認する。");
    }
  }

  if (planId === "one") {
    if (artPermission === "確認・追加発注が難しい") {
      raise(
        "D",
        "原画の加筆・調整許諾を確認できない",
        "Live2D制作に必要な加筆・調整の許諾確認が難しいため、現状のままではお引き受けできません。"
      );
    } else if (artPermission === "これから確認する") {
      raise("B", "原画の加筆許諾の取得待ち");
    } else if (artPermission === "元イラストレーターへ追加発注できる") {
      raise("B", "必要に応じて元イラストレーターとの追加調整が必要");
    }

    if (modelState === "design" || modelState === "preparing") {
      raise(
        "C",
        "【壱】の制作開始に必要な原画が未準備",
        "【壱】は原画持ち込みを前提とするため、原画をご用意いただくか、原画制作を含む【弐】以降への変更をご相談ください。"
      );
    }
  }

  if (options.indexOf("特殊ギミック追加") !== -1) {
    raise("B", "特殊ギミックの仕様確認が必要");
    pushUnique(assessment.flags, "特殊ギミック：何が／何をきっかけに／どう動くか、参考資料を確認する。");
  }

  if (requestType === "事務所・法人所属" || requestType === "法人からの直接依頼") {
    raise("B", "法人・事務所案件の利用条件確認が必要");
    pushUnique(assessment.flags, "契約主体・利用者・実績公開条件・二次利用範囲を確認する。");
  }

  if (additionalUse.length) {
    raise("B", "追加利用範囲の条件確認が必要");
    pushUnique(assessment.flags, `追加利用範囲：${additionalUse.join("、")}`);
  }

  if (portfolio === "公開不可") {
    raise("B", "制作実績を公開できない条件の確認が必要");
    pushUnique(assessment.flags, "公開不可案件。受注可否・追加条件を目検する。");
  } else if (portfolio === "公開時期は相談したい") {
    pushUnique(assessment.flags, "実績公開時期を打合せ時に確認する。");
  }

  if (environment && environment !== "nizima LIVE") {
    pushUnique(assessment.flags, `${environment}利用予定。nizima LIVE基準・互換性サポート対象外の案内を返信に残す。`);
  }

  if (ageGroup === "未成年") {
    raise("B", "未成年案件の契約・親権者同意確認が必要");
    pushUnique(assessment.flags, "親権者同意はフォーム上確認済み。契約時の確認方法を目検する。");
  }

  finalizeAssessment(assessment, planId);
  return assessment;
}

function finalizeAssessment(assessment, planId) {
  if (assessment.code === "D") {
    assessment.stage = "受注不可確認";
    assessment.template = "decline";
    assessment.nextActions = ["不可理由を原文と照合", "問題なければ不可テンプレートを送信"];
    return;
  }

  if (assessment.code === "C") {
    assessment.stage = "条件調整";
    assessment.template = "condition";
    assessment.nextActions = ["変更条件を目検", "条件変更テンプレートを送信"];
    return;
  }

  if (assessment.code === "A") {
    assessment.stage = "日程調整";
    assessment.template = "meeting";
    assessment.nextActions = ["自由記述を目検", "Calendar候補を再確認", "打合せ型下書きを送信"];
    return;
  }

  if (planId === "custom") {
    assessment.stage = "素材確認";
    assessment.template = "custom-materials";
    assessment.nextActions = ["自由記述を目検", "cmo3・PSD要求下書きを確認", "素材受領後に既存品質を判定"];
  } else if (planId === "one") {
    assessment.stage = "素材確認";
    assessment.template = "one-materials";
    assessment.nextActions = ["自由記述を目検", "PSD・許諾要求下書きを確認", "素材受領後に制作可否を判定"];
  } else if (planId === "other") {
    assessment.stage = "追加確認";
    assessment.template = "additional-info";
    assessment.nextActions = ["制作範囲を目検", "不足情報を追記", "追加確認型下書きを送信"];
  } else {
    assessment.stage = "追加確認";
    assessment.template = "additional-info";
    assessment.nextActions = ["要確認フラグを目検", "不足情報を追記", "追加確認型下書きを送信"];
  }
}

function estimateMinimumPrice(parameters) {
  const planId = getFirst(parameters, "希望プラン");
  const selections = normalizeCustomSelections(getAll(parameters, "希望カスタム"));
  const options = getAll(parameters, "追加オプション");
  let amount = Object.prototype.hasOwnProperty.call(PLAN_MINIMUM_PRICES, planId)
    ? PLAN_MINIMUM_PRICES[planId]
    : null;
  const notes = [];
  let hasUnknownAddOn = false;

  if (planId === "custom") {
    const customTotal = selections.reduce(function (sum, label) {
      return sum + (CUSTOM_MINIMUM_PRICES[label] || 0);
    }, 0);
    amount = Math.max(PLAN_MINIMUM_PRICES.custom, customTotal);
  }

  if (amount !== null) {
    options.forEach(function (option) {
      if (Object.prototype.hasOwnProperty.call(OPTION_MINIMUM_PRICES, option)) {
        amount += OPTION_MINIMUM_PRICES[option];
      }
    });
  }

  if (options.indexOf("原画調整") !== -1) {
    hasUnknownAddOn = true;
    notes.push("原画調整：要見積");
  }

  if (planId === "other") {
    notes.push("掲載外：要見積");
  }

  return { amount, notes, hasUnknownAddOn };
}

function normalizeCustomSelections(selections) {
  const values = selections.slice();
  const ignored = new Set();

  if (values.indexOf("①〜③口元フルカスタム") !== -1) {
    ignored.add("①母音表現強化");
    ignored.add("②くちびる表情強化");
    ignored.add("③骨格連動");
  }

  if (values.indexOf("①〜②髪質フルカスタム") !== -1) {
    ignored.add("①しなやか髪揺れ");
    ignored.add("②傾き髪垂れ");
  }

  return values.filter(function (value) {
    return !ignored.has(value);
  });
}

function buildReplyDraft(parameters, assessment, meetingCandidates) {
  const senderName = getFirst(parameters, "お名前・活動名");
  const planId = getFirst(parameters, "希望プラン");
  const planLabel = PLAN_LABELS[planId] || planId;
  const requestId = sanitizeRequestId(getFirst(parameters, "request_id"));
  const subject = `【琴ノ裏工房】制作相談について｜受付番号：${requestId || "確認中"}`;
  const intro = [
    `${senderName} 様`,
    "",
    "この度は制作相談をお送りいただき、ありがとうございます。",
    `${CONSULTATION_STUDIO_NAME} 制作担当の${CONSULTATION_STAFF_NAME}です。`,
    "ご相談内容を確認しました。",
    ""
  ];
  const outro = [
    "",
    "ご確認のほど、よろしくお願いいたします🙇",
    "",
    CONSULTATION_STUDIO_NAME,
    `制作担当：${CONSULTATION_STAFF_NAME}`
  ];

  let main = [];

  if (assessment.template === "custom-materials") {
    main = buildCustomMaterialsDraft(parameters, assessment);
  } else if (assessment.template === "one-materials") {
    main = buildOneMaterialsDraft(parameters, assessment);
  } else if (assessment.template === "meeting") {
    main = buildMeetingDraft(parameters, assessment, meetingCandidates);
  } else if (assessment.template === "condition") {
    main = buildConditionDraft(parameters, assessment);
  } else if (assessment.template === "decline") {
    main = buildDeclineDraft(assessment);
  } else {
    main = buildAdditionalInfoDraft(parameters, assessment);
  }

  return {
    subject,
    body: intro.concat(main, outro).join("\n"),
    planLabel
  };
}

function buildCustomMaterialsDraft(parameters, assessment) {
  const lines = [
    "現時点では制作を前向きに検討できますが、正式な制作可否・お見積りの前に、既存モデルの制作データを確認させてください。",
    "",
    `■ 現時点の概算下限`,
    formatEstimate(assessment.estimate),
    "",
    "■ ご共有いただきたいもの",
    "・編集元の .cmo3 データ",
    "・原画PSD（必須）",
    "・.can3 データ（お手元にある場合）",
    "・ご希望の動きに参考動画・画像等がある場合は、その資料",
    "",
    ".can3 はモデルの構造によって確認をお願いする場合があります。",
    "第三者が制作した原画・モデルの場合は、今回の追加モデリング・改変について許諾を確認できるものもあわせてお願いいたします。",
    "",
    "ファイル容量が大きい場合は、Google Drive等の共有URLで問題ありません。",
    "素材確認後、既存モデルとの相性や必要な調整範囲を含めて、正式な制作可否をご案内します。"
  ];

  appendEnvironmentNote(lines, parameters);
  appendAdditionalQuestions(lines, parameters);
  return lines;
}

function buildOneMaterialsDraft(parameters, assessment) {
  const modelState = getFirst(parameters, "現在のモデル状態");
  const lines = [
    "現時点では制作を前向きに検討できますが、正式な制作可否・お見積りの前に、原画データを確認させてください。",
    "",
    "■ 現時点の概算下限",
    formatEstimate(assessment.estimate),
    "",
    "■ ご共有いただきたいもの",
    modelState === "unseparated" ? "・レイヤーを保持した原寸PSD" : "・Live2D用にパーツ分けされた原寸PSD",
    "・キャラクター設定資料（お持ちの場合）",
    "・原画制作者・権利関係を確認できる情報",
    ""
  ];

  if (modelState === "unseparated") {
    lines.push("未分け原画のため、原画調整・パーツ分けを含めて確認します。追加費用はPSD確認後にご案内します。", "");
  }

  const artPermission = getFirst(parameters, "加筆許諾");
  if (artPermission === "これから確認する") {
    lines.push("また、Live2D制作に必要な加筆・調整について、原画制作者への許諾確認をお願いいたします。", "");
  } else if (artPermission === "元イラストレーターへ追加発注できる") {
    lines.push("必要な加筆が生じた場合は、元イラストレーター様への追加発注を含めて進行方法をご相談します。", "");
  }

  lines.push("ファイル容量が大きい場合は、Google Drive等の共有URLで問題ありません。", "素材確認後、正式な制作可否と具体的なお見積り範囲をご案内します。");

  appendEnvironmentNote(lines, parameters);
  appendAdditionalQuestions(lines, parameters);
  return lines;
}

function buildMeetingDraft(parameters, assessment, meetingCandidates) {
  const lines = [
    "現時点の内容で、制作を前向きに進められる見込みです。",
    "",
    "■ 現時点の概算下限",
    formatEstimate(assessment.estimate),
    "",
    `■ ご希望納期`,
    formatDeadline(getFirst(parameters, "希望納期")),
    "",
    "詳細な仕様を整理するため、初回打合せを60分程度で予定しています。",
    "下記のうち、ご都合のよい日時をお知らせください。",
    ""
  ];

  if (meetingCandidates.length) {
    meetingCandidates.forEach(function (candidate) {
      lines.push(`・${candidate.label}`);
    });
  } else {
    lines.push("【要入力：Calendarから候補日時を3件確認】");
    lines.push("・[候補日時1]");
    lines.push("・[候補日時2]");
    lines.push("・[候補日時3]");
  }

  lines.push(
    "",
    "いずれも難しい場合は、ご都合のよい日時を2〜3候補いただければ調整します。",
    "",
    "また、現在お持ちの設定資料・参考画像等がありましたら、打合せ前までにご共有ください。",
    "未確定の部分については、そのままで問題ありません。"
  );

  appendEnvironmentNote(lines, parameters);
  return lines;
}

function buildConditionDraft(parameters, assessment) {
  const lines = [
    "制作内容を確認しました。",
    "制作自体を検討できる内容ですが、現在いただいている条件のままでは進行が難しいため、下記の調整をお願いしたいです。",
    "",
    "■ 調整が必要な点"
  ];

  if (assessment.conditions.length) {
    assessment.conditions.forEach(function (condition) {
      lines.push(`・${condition}`);
    });
  } else {
    lines.push("・【要確認：調整条件を追記】");
  }

  lines.push(
    "",
    "上記の条件で問題なければ、引き続き制作内容の確認へ進めます。",
    "ご検討の上、ご希望をお知らせください。"
  );

  appendEnvironmentNote(lines, parameters);
  return lines;
}

function buildDeclineDraft(assessment) {
  const lines = [
    "ご相談内容を確認しました。",
    "",
    "今回のご相談については、下記の理由から現状の条件ではお引き受けすることができません。",
    ""
  ];

  assessment.conditions.forEach(function (condition) {
    lines.push(`・${condition}`);
  });

  lines.push("", "ご希望に沿えず恐縮ですが、ご了承いただけますと幸いです。");
  return lines;
}

function buildAdditionalInfoDraft(parameters, assessment) {
  const lines = [
    "制作を検討するにあたり、いくつか追加で確認したい点があります。",
    "",
    "■ 確認したい内容"
  ];

  const questions = getAdditionalQuestions(parameters);
  if (questions.length) {
    questions.forEach(function (question) {
      lines.push(`・${question}`);
    });
  } else {
    lines.push("・【要入力：自由記述と要確認フラグを見て不足事項を追記】");
  }

  lines.push("", "ご回答を確認後、制作可否・お見積り・次の進行をご案内します。");
  appendEnvironmentNote(lines, parameters);
  return lines;
}

function appendEnvironmentNote(lines, parameters) {
  const environment = getFirst(parameters, "使用予定環境");
  if (!environment || environment === "nizima LIVE") return;

  lines.push(
    "",
    "■ 使用環境について",
    "制作・動作確認はnizima LIVEを基準に行います。",
    `${environment}で使用できる場合がありますが、互換性・設定案内・動作保証はサポート対象外となります。`
  );
}

function appendAdditionalQuestions(lines, parameters) {
  const questions = getAdditionalQuestions(parameters);
  if (!questions.length) return;

  lines.push("", "■ あわせて確認したい内容");
  questions.forEach(function (question) {
    lines.push(`・${question}`);
  });
}

function getAdditionalQuestions(parameters) {
  const questions = [];
  const options = getAll(parameters, "追加オプション");
  const additionalUse = getAll(parameters, "追加利用範囲");
  const requestType = getFirst(parameters, "ご依頼形態");
  const portfolio = getFirst(parameters, "制作実績公開");
  const ageGroup = getFirst(parameters, "年齢区分");
  const deadlineStatus = getFirst(parameters, "希望納期受付状態");

  if (options.indexOf("特殊ギミック追加") !== -1) {
    questions.push("特殊ギミックについて「何が」「何をきっかけに」「どう動くか」をお知らせください。参考動画・画像があればあわせてお願いします。");
  }

  if (requestType === "事務所・法人所属" || requestType === "法人からの直接依頼" || additionalUse.length) {
    questions.push("契約主体・実際の利用者と、グッズ・有料コンテンツ・広告等を含む利用予定範囲をお知らせください。");
  }

  if (portfolio === "公開不可") {
    questions.push("制作実績を公開できない理由・期間・公開可能な範囲があればお知らせください。");
  }

  if (ageGroup === "未成年") {
    questions.push("契約時に親権者または法定代理人の同意確認をお願いする場合があります。");
  }

  if (deadlineStatus === "ask") {
    questions.push("希望時期の前後で、どの程度まで制作時期を調整可能かお知らせください。");
  }

  return questions;
}

function createReplyDraftSafely(recipient, subject, body) {
  try {
    const draft = GmailApp.createDraft(recipient, subject, body, {
      name: `${CONSULTATION_STUDIO_NAME} 制作担当：${CONSULTATION_STAFF_NAME}`
    });
    return {
      ok: true,
      draftId: draft.getId(),
      messageId: draft.getMessageId(),
      error: ""
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      draftId: "",
      messageId: "",
      error: safeErrorMessage(error)
    };
  }
}

function getMeetingCandidatesSafely() {
  try {
    return {
      candidates: findMeetingCandidates(),
      error: ""
    };
  } catch (error) {
    console.error(error);
    return {
      candidates: [],
      error: safeErrorMessage(error)
    };
  }
}

function findMeetingCandidates() {
  const calendar = CalendarApp.getDefaultCalendar();
  const now = new Date();
  const earliestStart = new Date(now.getTime() + MEETING_CONFIG.minLeadHours * 60 * 60 * 1000);
  const base = getTokyoDateParts(now);
  const candidates = [];

  for (let dayOffset = 0; dayOffset < MEETING_CONFIG.searchDays; dayOffset += 1) {
    if (candidates.length >= MEETING_CONFIG.maxCandidates) break;

    const target = addCalendarDays(base.year, base.month, base.day, dayOffset);
    let candidateForDay = null;

    for (
      let minuteOfDay = MEETING_CONFIG.startHour * 60;
      minuteOfDay + MEETING_CONFIG.durationMinutes <= MEETING_CONFIG.endHour * 60;
      minuteOfDay += MEETING_CONFIG.stepMinutes
    ) {
      const hour = Math.floor(minuteOfDay / 60);
      const minute = minuteOfDay % 60;
      const start = createTokyoDate(target.year, target.month, target.day, hour, minute);
      if (start < earliestStart) continue;

      const end = new Date(start.getTime() + MEETING_CONFIG.durationMinutes * 60 * 1000);
      const checkStart = new Date(start.getTime() - MEETING_CONFIG.bufferMinutes * 60 * 1000);
      const checkEnd = new Date(end.getTime() + MEETING_CONFIG.bufferMinutes * 60 * 1000);
      const busyEvents = calendar.getEvents(checkStart, checkEnd).filter(function (event) {
        return !event.isAllDayEvent();
      });

      if (busyEvents.length === 0) {
        candidateForDay = {
          start,
          end,
          label: formatMeetingCandidate(start, end)
        };
        break;
      }
    }

    if (candidateForDay) candidates.push(candidateForDay);
  }

  return candidates;
}

function buildAdminMailBody(parameters, planLabel, assessment, draftData, draftResult, meetingCandidates) {
  const lines = [
    "【一次判定票】",
    `判定：${assessment.code}｜${DECISION_LABELS[assessment.code]}`,
    `現在工程：${assessment.stage}`,
    `使用テンプレート：${assessment.template}`,
    `概算下限：${formatEstimate(assessment.estimate)}`,
    "",
    "■ 次アクション"
  ];

  assessment.nextActions.forEach(function (action) {
    lines.push(`・${action}`);
  });

  lines.push("", "■ 判定理由");
  if (assessment.reasons.length) {
    assessment.reasons.forEach(function (reason) {
      lines.push(`・${reason}`);
    });
  } else {
    lines.push("・自動判定上の追加条件なし");
  }

  lines.push("", "■ 必須目検");
  lines.push("・自由記述に、フォーム選択だけでは拾えない条件がないか");
  if (assessment.flags.length) {
    assessment.flags.forEach(function (flag) {
      lines.push(`・${flag}`);
    });
  }

  if (assessment.code === "A") {
    lines.push("・日程候補は下書き送信直前にCalendarを再確認する");
  }

  lines.push("", "■ 返信下書き");
  if (draftResult.ok) {
    lines.push("状態：Gmail下書き作成済み");
    lines.push(`件名：${draftData.subject}`);
    lines.push(`Draft ID：${draftResult.draftId}`);
    lines.push("→ Gmailの「下書き」を開き、本文を目検してから手動送信してください。");
  } else {
    lines.push("状態：自動作成失敗");
    lines.push(`理由：${draftResult.error}`);
    lines.push("→ 下記『返信下書き本文』をコピーして手動作成してください。");
  }

  if (meetingCandidates.length) {
    lines.push("", "■ 自動抽出した打合せ候補");
    meetingCandidates.forEach(function (candidate) {
      lines.push(`・${candidate.label}`);
    });
  }

  lines.push(
    "",
    "────────────────────────",
    "■ 返信下書き本文",
    "────────────────────────",
    draftData.body,
    "",
    "────────────────────────",
    "■ フォーム受信内容",
    "────────────────────────",
    buildSubmissionDetails(parameters, planLabel)
  );

  return lines.join("\n");
}

function buildSubmissionDetails(parameters, planLabel) {
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
    `希望納期受付状態：${displayValue(getFirst(parameters, "希望納期受付状態"))}`,
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

function formatEstimate(estimate) {
  const parts = [];
  if (estimate.amount !== null) {
    parts.push(formatManYen(estimate.amount));
  } else {
    parts.push("要見積");
  }
  if (estimate.notes.length) {
    parts.push(`（${estimate.notes.join("／")}）`);
  }
  return parts.join("");
}

function formatManYen(amount) {
  const normalized = Math.round(Number(amount) * 10) / 10;
  return `${String(normalized)}万円〜`;
}

function formatDeadline(value) {
  const normalized = String(value || "").trim();
  const match = normalized.match(/^(\d{4})-(\d{2})(以降)?$/);
  if (!match) return displayValue(normalized);
  const suffix = match[3] ? "以降" : "中";
  return `${Number(match[1])}年${Number(match[2])}月${suffix}`;
}

function formatMeetingCandidate(start, end) {
  const parts = getTokyoDateParts(start);
  const weekday = ["日", "月", "火", "水", "木", "金", "土"][getLocalWeekday(parts.year, parts.month, parts.day)];
  const startTime = Utilities.formatDate(start, MEETING_CONFIG.timeZone, "HH:mm");
  const endTime = Utilities.formatDate(end, MEETING_CONFIG.timeZone, "HH:mm");
  return `${parts.month}月${parts.day}日（${weekday}）${startTime}〜${endTime}`;
}

function getTokyoDateParts(date) {
  const raw = Utilities.formatDate(date, MEETING_CONFIG.timeZone, "yyyy,M,d").split(",");
  return {
    year: Number(raw[0]),
    month: Number(raw[1]),
    day: Number(raw[2])
  };
}

function addCalendarDays(year, month, day, offset) {
  const date = new Date(Date.UTC(year, month - 1, day + offset, 12, 0, 0));
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate()
  };
}

function createTokyoDate(year, month, day, hour, minute) {
  return new Date(Date.UTC(year, month - 1, day, hour - 9, minute, 0));
}

function getLocalWeekday(year, month, day) {
  return new Date(Date.UTC(year, month - 1, day, 12, 0, 0)).getUTCDay();
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

function pushUnique(list, value) {
  if (value && list.indexOf(value) === -1) list.push(value);
}

function safeErrorMessage(error) {
  if (!error) return "不明なエラー";
  return String(error.message || error).replace(/[\r\n]+/g, " ").slice(0, 300);
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

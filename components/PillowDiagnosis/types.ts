export type DiagnosisAnswers = {
  sleeping_position: string | null;
  height: string | null;
  material_preference: string | null;
  order_interest: string | null;
  price_range: string | null;
};

export type QuestionOption = {
  label: string;
  value: string;
};

export type QuestionDef = {
  id: keyof DiagnosisAnswers;
  question: string;
  description: string;
  options: QuestionOption[];
};

export const MATERIAL_MAP: Record<string, string[]> = {
  soft: ["低反発", "羽毛"],
  firm: ["高反発", "そばがら", "ラテックス"],
  fluffy: ["ポリエステル"],
};

export const PRICE_RANGES: Record<string, { min: number; max: number }> = {
  "~5000": { min: 0, max: 5000 },
  "~10000": { min: 0, max: 10000 },
  "~20000": { min: 0, max: 20000 },
  "20000+": { min: 20000, max: Infinity },
};

export const QUESTIONS: QuestionDef[] = [
  {
    id: "sleeping_position",
    question: "普段の寝姿勢は？",
    description: "一番よくする寝姿勢を教えてください",
    options: [
      { label: "仰向け", value: "仰向け" },
      { label: "横向き", value: "横向き" },
      { label: "うつ伏せ", value: "うつ伏せ" },
    ],
  },
  {
    id: "height",
    question: "枕の高さの好みは？",
    description: "好みの枕の高さを選んでください",
    options: [
      { label: "低め", value: "低め" },
      { label: "普通", value: "普通" },
      { label: "高め", value: "高め" },
    ],
  },
  {
    id: "material_preference",
    question: "どんな素材が好み？",
    description: "お好みの感触に近いものを選んでください",
    options: [
      { label: "やわらかめ（低反発・羽毛）", value: "soft" },
      { label: "しっかりめ（高反発・そばがら）", value: "firm" },
      { label: "ふわふわ（ポリエステル）", value: "fluffy" },
    ],
  },
  {
    id: "order_interest",
    question: "オーダーメイドに興味ある？",
    description: "オーダーメイド枕に興味がありますか？",
    options: [
      { label: "はい", value: "yes" },
      { label: "いいえ", value: "no" },
      { label: "どちらでも", value: "either" },
    ],
  },
  {
    id: "price_range",
    question: "予算はどれくらい？",
    description: "枕にかけられる予算を選んでください",
    options: [
      { label: "〜5,000円", value: "~5000" },
      { label: "〜10,000円", value: "~10000" },
      { label: "〜20,000円", value: "~20000" },
      { label: "20,000円〜", value: "20000+" },
    ],
  },
];

export const INITIAL_ANSWERS: DiagnosisAnswers = {
  sleeping_position: null,
  height: null,
  material_preference: null,
  order_interest: null,
  price_range: null,
};

export type DiagnosisRecord = {
  id: number;
  sleeping_position: string;
  height: string;
  material_preference: string;
  order_interest: string;
  price_range: string;
  created_at: string;
};

export function recordToAnswers(record: DiagnosisRecord): DiagnosisAnswers {
  return {
    sleeping_position: record.sleeping_position,
    height: record.height,
    material_preference: record.material_preference,
    order_interest: record.order_interest,
    price_range: record.price_range,
  };
}

export const SESSION_KEY = "pillow_diagnosis_answers";

// スコアリング用の型
export type ScoredPost<T> = {
  post: T;
  score: number;
  maxScore: number;
};

// 投稿のスコアリング関数（おすすめ順ソートに使用）
export function scorePosts<
  T extends {
    sleeping_position?: string;
    height?: string;
    material?: string;
    order_type?: string;
    price?: number;
    favorites_count?: number;
  },
>(posts: T[], answers: DiagnosisAnswers): ScoredPost<T>[] {
  return posts
    .map((post) => {
      let score = 0;
      let maxScore = 0;

      if (answers.sleeping_position) {
        maxScore += 3;
        const vals = (post.sleeping_position || "")
          .split(",")
          .map((s) => s.trim());
        if (vals.includes(answers.sleeping_position)) score += 3;
      }

      if (answers.height) {
        maxScore += 3;
        const vals = (post.height || "").split(",").map((s) => s.trim());
        if (vals.includes(answers.height)) score += 3;
      }

      if (answers.material_preference) {
        maxScore += 2;
        const targets = MATERIAL_MAP[answers.material_preference] || [];
        const vals = (post.material || "").split(",").map((s) => s.trim());
        if (targets.some((t) => vals.includes(t))) score += 2;
      }

      if (answers.order_interest) {
        maxScore += 1;
        const orderType = (post.order_type || "").trim();
        if (answers.order_interest === "yes") {
          if (
            orderType === "フルオーダーメイド" ||
            orderType === "セミオーダーメイド"
          )
            score += 1;
        } else if (answers.order_interest === "no") {
          if (
            orderType !== "フルオーダーメイド" &&
            orderType !== "セミオーダーメイド"
          )
            score += 1;
        } else {
          score += 1;
        }
      }

      if (answers.price_range && post.price != null) {
        maxScore += 2;
        const range = PRICE_RANGES[answers.price_range];
        if (range && post.price >= range.min && post.price <= range.max)
          score += 2;
      }

      return { post, score, maxScore };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return (b.post.favorites_count || 0) - (a.post.favorites_count || 0);
    });
}

import { Post } from "@/hooks/usePosts";

export type PillowAxisKey =
  | "softness"
  | "height"
  | "breathability"
  | "value"
  | "customizability"
  | "positionCoverage";

export type PillowAxisScore = {
  key: PillowAxisKey;
  label: string;
  score: number; // 0-5 (0 = no data)
  hasData: boolean;
};

export type PillowChartData = {
  axes: PillowAxisScore[];
  hasAnyData: boolean;
};

const SOFTNESS_MAP: Record<string, number> = {
  低反発: 5,
  羽毛: 5,
  ポリエステル: 3,
  高反発: 1,
  そばがら: 1,
  ラテックス: 1,
};

const BREATHABILITY_MAP: Record<string, number> = {
  そばがら: 5,
  ラテックス: 3,
  ポリエステル: 3,
  低反発: 1,
  高反発: 1,
  羽毛: 1,
};

const HEIGHT_MAP: Record<string, number> = {
  高め: 5,
  普通: 3,
  低め: 1,
};

function averageFromMap(
  csvField: string | undefined,
  map: Record<string, number>
): { score: number; hasData: boolean } {
  if (!csvField || csvField.trim() === "") {
    return { score: 0, hasData: false };
  }
  const items = csvField
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const recognized = items.filter((item) => item in map);
  if (recognized.length === 0) {
    return { score: 3, hasData: true };
  }
  const avg =
    recognized.reduce((sum, item) => sum + map[item], 0) / recognized.length;
  return { score: Math.round(avg), hasData: true };
}

export function calculatePillowScores(post: Post): PillowChartData {
  const softness = averageFromMap(post.material, SOFTNESS_MAP);
  const breathability = averageFromMap(post.material, BREATHABILITY_MAP);
  const height = averageFromMap(post.height, HEIGHT_MAP);

  // コスパ
  let valueScore: { score: number; hasData: boolean };
  if (post.price == null || post.price === 0) {
    valueScore = { score: 0, hasData: false };
  } else if (post.price <= 5000) {
    valueScore = { score: 5, hasData: true };
  } else if (post.price <= 10000) {
    valueScore = { score: 4, hasData: true };
  } else if (post.price <= 20000) {
    valueScore = { score: 3, hasData: true };
  } else if (post.price <= 50000) {
    valueScore = { score: 2, hasData: true };
  } else {
    valueScore = { score: 1, hasData: true };
  }

  // カスタマイズ性
  let customScore: { score: number; hasData: boolean };
  const orderType = (post.order_type || "").trim();
  if (!orderType) {
    customScore = { score: 0, hasData: false };
  } else if (orderType === "フルオーダーメイド") {
    customScore = { score: 5, hasData: true };
  } else if (orderType === "セミオーダーメイド") {
    customScore = { score: 3, hasData: true };
  } else {
    customScore = { score: 1, hasData: true };
  }

  // 寝姿勢対応力
  let positionScore: { score: number; hasData: boolean };
  if (!post.sleeping_position || post.sleeping_position.trim() === "") {
    positionScore = { score: 0, hasData: false };
  } else {
    const count = post.sleeping_position
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean).length;
    if (count >= 3) positionScore = { score: 5, hasData: true };
    else if (count === 2) positionScore = { score: 3, hasData: true };
    else positionScore = { score: 2, hasData: true };
  }

  const axes: PillowAxisScore[] = [
    { key: "softness", label: "やわらかさ", ...softness },
    { key: "height", label: "高さ", ...height },
    { key: "breathability", label: "通気性", ...breathability },
    { key: "value", label: "コスパ", ...valueScore },
    { key: "customizability", label: "カスタマイズ性", ...customScore },
    { key: "positionCoverage", label: "寝姿勢対応", ...positionScore },
  ];

  return {
    axes,
    hasAnyData: axes.some((a) => a.hasData),
  };
}

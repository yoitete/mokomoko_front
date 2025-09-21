import { useMemo } from "react";
import { useGet } from "./useSWRAPI";

// 季節特集の型定義
export type SeasonalCampaign = {
  id?: number;
  name: string;
  description: string;
  subtitle: string;
  color_theme: string;
  start_month?: number;
  end_month?: number;
  link_path: string;
  button_text: string;
  highlight_text: string;
  highlight_color: string;
  campaign_type?: string;
  active?: boolean;
};

// 第1特集（メイン特集）の静的データ
const seasonalCampaigns: SeasonalCampaign[] = [
  {
    id: 1,
    name: "クリスマス特集",
    description: "心まで温まる、クリスマス限定のふわもこ毛布",
    subtitle:
      "冬の夜をやさしく包み込む、とっておきのブランケットをご用意しました",
    color_theme: "red",
    start_month: 12,
    end_month: 2,
    link_path: "/christmas",
    button_text: "詳しくはこちら →",
    highlight_text: "大切な人へのギフトにも、自分へのご褒美にもぴったり！",
    highlight_color: "red",
    active: true,
  },
  {
    id: 2,
    name: "母の日特集",
    description: "お母さんに感謝を込めて、特別なふわもこ毛布",
    subtitle: "日頃の感謝の気持ちを込めて、心地よい温もりをお届けします",
    color_theme: "pink",
    start_month: 3,
    end_month: 5,
    link_path: "/mothers-day",
    button_text: "詳しくはこちら →",
    highlight_text: "お母さんへの特別な贈り物にぴったり！",
    highlight_color: "pink",
    active: true,
  },
  {
    id: 3,
    name: "夏でも快適！ひんやり毛布特集",
    description: "暑い夏でも心地よい、ひんやり感触の特別な毛布",
    subtitle: "エアコンの効いた部屋で、快適な眠りをサポートします",
    color_theme: "blue",
    start_month: 6,
    end_month: 8,
    link_path: "/summer-cool",
    button_text: "詳しくはこちら →",
    highlight_text: "夏の快適な睡眠をサポート！",
    highlight_color: "blue",
    active: true,
  },
  {
    id: 4,
    name: "ハロウィン特集",
    description: "秋の夜長を楽しむ、ハロウィン限定デザインの毛布",
    subtitle: "オレンジと黒の特別なデザインで、秋の雰囲気を演出",
    color_theme: "orange",
    start_month: 9,
    end_month: 11,
    link_path: "/halloween",
    button_text: "詳しくはこちら →",
    highlight_text: "ハロウィンの特別な夜にぴったり！",
    highlight_color: "orange",
    active: true,
  },
];

// 第2特集（サブ特集）の静的データ
const secondSeasonalCampaigns: SeasonalCampaign[] = [
  {
    id: 5,
    name: "受験応援！あったか毛布特集",
    description: "合格への道を、あたたかさで支える",
    subtitle: "冬の受験勉強は、寒さとの戦いでもあります",
    color_theme: "indigo",
    start_month: 12,
    end_month: 2,
    link_path: "/exam-support",
    button_text: "詳しくはこちら →",
    highlight_text: "集中力を高める、あなただけの学習パートナー",
    highlight_color: "indigo",
    active: true,
  },
  {
    id: 6,
    name: "新生活応援特集",
    description: "新しいスタートを温かくサポート",
    subtitle: "新生活の始まりに、心地よい毛布で快適な環境を",
    color_theme: "green",
    start_month: 3,
    end_month: 5,
    link_path: "/new-life-support",
    button_text: "詳しくはこちら →",
    highlight_text: "新生活を快適にスタート！",
    highlight_color: "green",
    active: true,
  },
  {
    id: 7,
    name: "父の日ギフト特集",
    description: "お父さんに感謝を込めて、上質な毛布を",
    subtitle: "いつも家族を支えてくれるお父さんへの特別なギフト",
    color_theme: "blue",
    start_month: 6,
    end_month: 8,
    link_path: "/fathers-day",
    button_text: "詳しくはこちら →",
    highlight_text: "お父さんへの感謝の気持ちを形に",
    highlight_color: "blue",
    active: true,
  },
  {
    id: 8,
    name: "秋のくつろぎ毛布特集",
    description: "秋の夜長をゆったりと過ごす、極上の毛布",
    subtitle: "読書や映画鑑賞のお供に、心地よいくつろぎタイムを",
    color_theme: "yellow",
    start_month: 9,
    end_month: 11,
    link_path: "/autumn-relax",
    button_text: "詳しくはこちら →",
    highlight_text: "秋の夜長を特別な時間に",
    highlight_color: "yellow",
    active: true,
  },
];

// 現在の月に基づいて適切な特集を取得する関数
const getCurrentSeasonalCampaign = (): SeasonalCampaign => {
  const currentMonth = new Date().getMonth() + 1; // 1-12

  if (currentMonth >= 12 || currentMonth <= 2) {
    return seasonalCampaigns[0]; // クリスマス特集
  } else if (currentMonth >= 3 && currentMonth <= 5) {
    return seasonalCampaigns[1]; // 母の日特集
  } else if (currentMonth >= 6 && currentMonth <= 8) {
    return seasonalCampaigns[2]; // 夏特集
  } else {
    return seasonalCampaigns[3]; // ハロウィン特集
  }
};

// 現在の月に基づいて適切な第2特集を取得する関数
const getCurrentSecondSeasonalCampaign = (): SeasonalCampaign => {
  const currentMonth = new Date().getMonth() + 1; // 1-12

  if (currentMonth >= 12 || currentMonth <= 2) {
    return secondSeasonalCampaigns[0]; // 受験応援特集
  } else if (currentMonth >= 3 && currentMonth <= 5) {
    return secondSeasonalCampaigns[1]; // 新生活応援特集
  } else if (currentMonth >= 6 && currentMonth <= 8) {
    return secondSeasonalCampaigns[2]; // 父の日ギフト特集
  } else {
    return secondSeasonalCampaigns[3]; // 秋のくつろぎ毛布特集
  }
};

// 色のテーマに基づくスタイルを生成する関数
export const getColorClasses = (colorTheme: string) => {
  switch (colorTheme) {
    case "red":
      return {
        title: "text-red-600",
        highlight: "text-red-500",
        badge: "bg-red-50 text-red-600",
      };
    case "pink":
      return {
        title: "text-pink-600",
        highlight: "text-pink-500",
        badge: "bg-pink-50 text-pink-600",
      };
    case "blue":
      return {
        title: "text-blue-600",
        highlight: "text-blue-500",
        badge: "bg-blue-50 text-blue-600",
      };
    case "orange":
      return {
        title: "text-orange-600",
        highlight: "text-orange-500",
        badge: "bg-orange-50 text-orange-600",
      };
    case "green":
      return {
        title: "text-green-600",
        highlight: "text-green-500",
        badge: "bg-green-50 text-green-600",
      };
    case "indigo":
      return {
        title: "text-indigo-600",
        highlight: "text-indigo-500",
        badge: "bg-indigo-50 text-indigo-600",
      };
    case "yellow":
      return {
        title: "text-yellow-600",
        highlight: "text-yellow-500",
        badge: "bg-yellow-50 text-yellow-600",
      };
    default:
      return {
        title: "text-red-600",
        highlight: "text-red-500",
        badge: "bg-red-50 text-red-600",
      };
  }
};

// 現在の季節特集を取得するhook（静的版）
export const useCurrentSeasonalCampaign = () => {
  const campaign = useMemo(() => getCurrentSeasonalCampaign(), []);
  const colorClasses = useMemo(
    () => getColorClasses(campaign.color_theme),
    [campaign.color_theme]
  );

  return {
    data: campaign,
    colorClasses,
    isLoading: false,
    error: null,
  };
};

// 現在の第2季節特集を取得するhook（静的版）
export const useCurrentSecondSeasonalCampaign = () => {
  const campaign = useMemo(() => getCurrentSecondSeasonalCampaign(), []);
  const colorClasses = useMemo(
    () => getColorClasses(campaign.color_theme),
    [campaign.color_theme]
  );

  return {
    data: campaign,
    colorClasses,
    isLoading: false,
    error: null,
  };
};

// API版（将来的に使用）
export const useCurrentSeasonalCampaignAPI = () => {
  const { data, error, isLoading } = useGet<SeasonalCampaign>(
    "/seasonal_campaigns/current"
  );

  // データが存在しない場合はnullを返す（フォールバックしない）
  const campaign = data || null;
  const colorClasses = useMemo(
    () => (campaign ? getColorClasses(campaign.color_theme) : null),
    [campaign?.color_theme]
  );

  return {
    data: campaign,
    colorClasses,
    isLoading,
    error,
  };
};

// 第2特集API版（将来的に使用）
export const useCurrentSecondSeasonalCampaignAPI = () => {
  const { data, error, isLoading } = useGet<SeasonalCampaign>(
    "/seasonal_campaigns/current_secondary"
  );

  // データが存在しない場合はnullを返す（フォールバックしない）
  const campaign = data || null;
  const colorClasses = useMemo(
    () => (campaign ? getColorClasses(campaign.color_theme) : null),
    [campaign?.color_theme]
  );

  return {
    data: campaign,
    colorClasses,
    isLoading,
    error,
  };
};

// 全ての季節特集を取得するhook（管理用）
export const useSeasonalCampaigns = () => {
  return useGet<SeasonalCampaign[]>("/seasonal_campaigns");
};

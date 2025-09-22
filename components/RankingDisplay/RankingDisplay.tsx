import { RankingCrown } from "@/components/RankingCrown/RankingCrown";

interface RankingDisplayProps {
  index: number;
}

export const RankingDisplay = ({ index }: RankingDisplayProps) => {
  const rank = index + 1;

  // 1-3位: 王冠表示
  if (rank <= 3) {
    return <RankingCrown rank={rank} />;
  }

  // 4-10位: 数字バッジ表示
  if (rank <= 10) {
    return (
      <span className="text-sm font-bold text-gray-700 bg-gray-100 rounded px-1.5 py-0.5 min-w-[24px] flex items-center justify-center shadow-sm">
        {rank}
      </span>
    );
  }

  // 10位以降は表示しない
  return null;
};

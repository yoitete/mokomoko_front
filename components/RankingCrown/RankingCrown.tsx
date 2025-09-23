import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown } from "@fortawesome/free-solid-svg-icons";

interface RankingCrownProps {
  rank: number;
}

const crownConfigs = {
  1: {
    textColor: "text-yellow-500",
    numberColor: "text-yellow-900",
    auraColor: "from-yellow-300/30 to-yellow-500/30",
    animateClass: "animate-pulse",
  },
  2: {
    textColor: "text-gray-500",
    numberColor: "text-gray-800",
    auraColor: "from-gray-300/30 to-gray-500/30",
    animateClass: "",
  },
  3: {
    textColor: "text-orange-600",
    numberColor: "text-orange-900",
    auraColor: "from-orange-300/30 to-orange-600/30",
    animateClass: "",
  },
};

export const RankingCrown = ({ rank }: RankingCrownProps) => {
  if (rank < 1 || rank > 3) return null;

  const config = crownConfigs[rank as keyof typeof crownConfigs];

  return (
    <div className="relative inline-block">
      {/* 背景のオーラ効果 */}
      <div
        className={`absolute inset-0 bg-gradient-to-r ${config.auraColor} rounded-full blur-md scale-125 ${config.animateClass}`}
      ></div>
      {/* 王冠本体 */}
      <FontAwesomeIcon
        icon={faCrown}
        className={`relative ${config.textColor} text-3xl drop-shadow-2xl filter brightness-125 hover:scale-110 transition-all duration-300 hover:rotate-6 hover:brightness-150`}
      />
      {/* 順位数字 */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-0.5">
        <span
          className={`${config.numberColor} text-base font-black drop-shadow-sm`}
        >
          {rank}
        </span>
      </div>
    </div>
  );
};

"use client";

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { PillowChartData, PillowAxisScore } from "@/lib/pillowScoring";

interface PillowRadarChartProps {
  data: PillowChartData;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTick(props: any, axes: PillowAxisScore[]) {
  const { x, y, payload } = props;
  const numX = Number(x) || 0;
  const numY = Number(y) || 0;
  const axis = axes[payload?.index];
  const color = axis?.hasData ? "#5A4A4A" : "#C4B5B5";

  const cx = 140;
  const cy = 120;
  const offsetY = numY < cy - 50 ? -6 : numY > cy + 50 ? 10 : 0;
  const offsetX = numX < cx - 50 ? -8 : numX > cx + 50 ? 8 : 0;

  return (
    <text
      x={numX + offsetX}
      y={numY + offsetY}
      textAnchor={numX < cx ? "end" : numX > cx ? "start" : "middle"}
      fill={color}
      fontSize={10}
      fontFamily="'Noto Sans JP', sans-serif"
      dominantBaseline="central"
    >
      {payload?.value}
    </text>
  );
}

export default function PillowRadarChart({ data }: PillowRadarChartProps) {
  const chartData = data.axes.map((axis) => ({
    label: axis.label,
    score: axis.score,
    fullMark: 5,
  }));

  const strokeColor = data.hasAnyData ? "#7E6565" : "#C4B5B5";
  const fillColor = data.hasAnyData
    ? "rgba(126,101,101,0.2)"
    : "rgba(126,101,101,0.05)";
  const gridColor = data.hasAnyData ? "#C4B5B5" : "#D5CCCC";

  return (
    <div style={{ width: 280, height: 240 }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={chartData} cx="50%" cy="50%" outerRadius="50%">
          <PolarGrid stroke={gridColor} />
          <PolarAngleAxis
            dataKey="label"
            tick={(props) => CustomTick(props, data.axes)}
          />
          <PolarRadiusAxis
            domain={[0, 5]}
            tick={false}
            axisLine={false}
            tickCount={6}
          />
          <Radar
            dataKey="score"
            stroke={strokeColor}
            fill={fillColor}
            fillOpacity={1}
            strokeWidth={1.5}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

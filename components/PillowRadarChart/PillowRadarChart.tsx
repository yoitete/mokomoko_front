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

  const offsetY = numY < 60 ? -4 : numY > 140 ? 8 : 0;
  const offsetX = numX < 60 ? -2 : numX > 140 ? 2 : 0;

  return (
    <text
      x={numX + offsetX}
      y={numY + offsetY}
      textAnchor={numX < 100 ? "end" : numX > 100 ? "start" : "middle"}
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
    <div style={{ width: 220, height: 220 }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={chartData} cx="50%" cy="50%" outerRadius="60%">
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

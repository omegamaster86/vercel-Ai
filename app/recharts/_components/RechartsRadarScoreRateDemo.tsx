"use client";

import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

type ScoreRateDatum = {
  subject: string;
  background: number;
  you: number;
  average: number;
};

type RadarDotProps = {
  cx?: number;
  cy?: number;
};

const scoreRateData: ScoreRateDatum[] = [
  { subject: "労基・安衛", background: 100, you: 60, average: 45 },
  { subject: "労災", background: 100, you: 40, average: 30 },
  { subject: "雇用", background: 100, you: 55, average: 42 },
  { subject: "労一", background: 100, you: 42, average: 25 },
  { subject: "社一", background: 100, you: 48, average: 50 },
  { subject: "健康保険", background: 100, you: 32, average: 40 },
  { subject: "厚生年金", background: 100, you: 80, average: 45 },
  { subject: "国民年金", background: 100, you: 58, average: 48 },
];

const AverageStarDot = ({ cx = 0, cy = 0 }: RadarDotProps) => (
  <text
    x={cx}
    y={cy + 5}
    textAnchor="middle"
    fontSize={14}
    fill="#4b5563"
    aria-hidden
  >
    ★
  </text>
);

export function RechartsRadarScoreRateDemo() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-center text-3xl font-extrabold text-gray-800">
        科目別の得点率
      </h2>

      <div className="mx-auto mt-4 h-[720px] w-full max-w-[760px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart
            cx="50%"
            cy="53%"
            outerRadius="68%"
            data={scoreRateData}
            accessibilityLayer={false}
          >
            <PolarGrid stroke="#dcdcfc" gridType="polygon" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: "#32323e", fontSize: 35, fontWeight: 700 }}
            />
            <PolarRadiusAxis
              domain={[0, 80]}
              tickCount={10}
              tick={false}
              axisLine={false}
            />

            <Radar
              dataKey="background"
              stroke="none"
              fill="#FFFDEC"
              fillOpacity={0.55}
              dot={false}
              legendType="none"
              isAnimationActive={false}
            />
            <Radar
              name="あなたの得点率"
              dataKey="you"
              stroke="#facc15"
              fill="#fde047"
              fillOpacity={0.16}
              strokeWidth={4}
              dot={{
                r: 7,
                fill: "#facc15",
                stroke: "#eab308",
                strokeWidth: 2,
              }}
            />
            <Radar
              name="平均得点率"
              dataKey="average"
              stroke="#4b5563"
              fill="#6b7280"
              fillOpacity={0.07}
              strokeWidth={3}
              dot={<AverageStarDot />}
            />

            <Legend
              verticalAlign="top"
              align="center"
              iconType="line"
              wrapperStyle={{
                top: 8,
                fontSize: 26,
                fontWeight: 700,
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

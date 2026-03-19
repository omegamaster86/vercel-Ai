"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

type DeviationComparisonDatum = {
  subject: string;
  current: number;
  previous: number;
};

const deviationComparisonData: DeviationComparisonDatum[] = [
  { subject: "労基・安衛", current: 64, previous: 44 },
  { subject: "労災", current: 64, previous: 32 },
  { subject: "雇用", current: 57, previous: 65 },
  { subject: "労一", current: 38, previous: 51 },
  { subject: "社一", current: 64, previous: 44 },
  { subject: "健康保険", current: 70, previous: 57 },
  { subject: "厚生年金", current: 62, previous: 50 },
  { subject: "国民年金", current: 47, previous: 50 },
];

const domainMin = 20;
const domainMax = 80;
const xAxisTicks = [20, 30, 40, 50, 60, 70, 80];

export function RechartsDeviationComparisonDemo() {
  return (
    <div className="px-2 py-4">
      <h2 className="text-center text-4xl font-extrabold text-zinc-800">
        前回との比較（偏差値）
      </h2>

      <div className="mx-auto mt-6 h-[620px] w-full max-w-[960px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={deviationComparisonData}
            layout="vertical"
            margin={{ top: 58, right: 20, left: 12 }}
            barGap="-80%"
            accessibilityLayer={false}
          >
            <CartesianGrid
              vertical={false}
              horizontal={false}
              stroke="#d4d4d8"
              strokeDasharray="0"
            />
            <XAxis
              type="number"
              domain={[domainMin, domainMax]}
              ticks={xAxisTicks}
              orientation="top"
              tickLine={false}
              axisLine={{ stroke: "#a1a1aa" }}
              tick={{ fill: "#a1a1aa", fontSize: 24, fontWeight: 700 }}
            />
            <YAxis
              type="category"
              dataKey="subject"
              width={170}
              interval={0}
              tickMargin={10}
              tickLine={false}
              axisLine={{ stroke: "#a1a1aa" }}
              tick={{ fill: "#27272a", fontSize: 28, fontWeight: 800 }}
            />

            <Legend
              verticalAlign="top"
              align="left"
              iconType="square"
              wrapperStyle={{
                top: -2,
                left: 4,
                fontSize: 22,
                fontWeight: 700,
              }}
              formatter={(value) => (
                <span className="text-zinc-600">{String(value)}</span>
              )}
            />

            <Bar
              dataKey="previous"
              name="前回の偏差値（2025/2/28）"
              fill="#e5e7eb"
              radius={[0, 0, 0, 0]}
              barSize={26}
            />
            <Bar
              dataKey="current"
              name="今回の偏差値（2025/8/31）"
              fill="#facc15"
              radius={[0, 0, 0, 0]}
              barSize={26}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

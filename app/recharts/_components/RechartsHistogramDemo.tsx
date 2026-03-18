"use client";

import { useMemo, useState } from "react";
import {
  CartesianGrid,
  ComposedChart,
  ReferenceArea,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type HistogramBin = {
  score: number;
  count: number;
};

const histogramData: HistogramBin[] = [
  { score: 2.5, count: 6 },
  { score: 7.5, count: 12 },
  { score: 12.5, count: 24 },
  { score: 17.5, count: 46 },
  { score: 22.5, count: 58 },
  { score: 27.5, count: 80 },
  { score: 32.5, count: 74 },
  { score: 37.5, count: 58 },
  { score: 42.5, count: 40 },
  { score: 47.5, count: 28 },
  { score: 52.5, count: 22 },
  { score: 57.5, count: 18 },
  { score: 62.5, count: 12 },
  { score: 67.5, count: 6 },
];

const MIN_SCORE = 0;
const MAX_SCORE = 70;
const BIN_WIDTH = 5;

const clampScore = (value: number) =>
  Math.max(MIN_SCORE, Math.min(MAX_SCORE, value));

const getCountByScore = (score: number) => {
  const normalized = clampScore(score);
  const binIndex = Math.min(
    histogramData.length - 1,
    Math.max(0, Math.floor(normalized / BIN_WIDTH)),
  );

  return histogramData[binIndex]?.count ?? 0;
};

export function RechartsHistogramDemo() {
  const [lineScoreInput, setLineScoreInput] = useState("49");
  const [blueScoreInput, setBlueScoreInput] = useState("48");
  const [starScoreInput, setStarScoreInput] = useState("58");

  const lineScore = clampScore(Number(lineScoreInput) || 0);
  const blueScore = clampScore(Number(blueScoreInput) || 0);
  const starScore = clampScore(Number(starScoreInput) || 0);

  const { blueY, starY } = useMemo(() => {
    const blueCount = getCountByScore(blueScore);
    const starCount = getCountByScore(starScore);

    return {
      blueY: Math.max(blueCount, 5),
      starY: Math.max(starCount, 5),
    };
  }, [blueScore, starScore]);

  return (
    <div className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="text-sm text-gray-700">
          <span className="mb-1 block font-medium">赤線の点数</span>
          <input
            type="number"
            min={MIN_SCORE}
            max={MAX_SCORE}
            value={lineScoreInput}
            onChange={(event) => setLineScoreInput(event.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </label>

        <label className="text-sm text-gray-700">
          <span className="mb-1 block font-medium">青丸の点数</span>
          <input
            type="number"
            min={MIN_SCORE}
            max={MAX_SCORE}
            value={blueScoreInput}
            onChange={(event) => setBlueScoreInput(event.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </label>

        <label className="text-sm text-gray-700">
          <span className="mb-1 block font-medium">星の点数</span>
          <input
            type="number"
            min={MIN_SCORE}
            max={MAX_SCORE}
            value={starScoreInput}
            onChange={(event) => setStarScoreInput(event.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </label>
      </div>

      <div className="histogram-chart h-[420px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={histogramData}
            margin={{ top: 24, right: 24, left: 8, bottom: 24 }}
            barGap={0}
            barCategoryGap="0%"
            accessibilityLayer={false}
          >
            <CartesianGrid stroke="#e5e7eb" vertical={false} />
            <XAxis
              type="number"
              dataKey="score"
              domain={[MIN_SCORE, MAX_SCORE]}
              ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
              label={{ value: "(点)", position: "insideBottom", offset: -8 }}
            />
            <YAxis
              type="number"
              domain={[0, 120]}
              ticks={[0, 30, 60, 90, 120]}
              label={{ value: "(人)", position: "insideTopLeft", offset: 0 }}
            />
            <Tooltip
              cursor={false}
              formatter={(value) => [`${String(value ?? 0)}人`, "人数"]}
              labelFormatter={(label) => {
                const numericLabel =
                  typeof label === "number" ? label : Number(label) || 0;
                return `${Math.max(0, numericLabel - BIN_WIDTH / 2)} - ${Math.min(MAX_SCORE, numericLabel + BIN_WIDTH / 2)}点`;
              }}
            />
            {histogramData.map((bin) => (
              <ReferenceArea
                key={bin.score}
                className="histogram-bin-area"
                x1={bin.score - BIN_WIDTH / 2}
                x2={bin.score + BIN_WIDTH / 2}
                y1={0}
                y2={bin.count}
                fill="#f1d627"
                strokeOpacity={0}
                ifOverflow="extendDomain"
              />
            ))}

            <ReferenceLine
              x={lineScore}
              stroke="#ef4444"
              strokeWidth={2}
              ifOverflow="extendDomain"
            />

            <ReferenceDot
              x={blueScore}
              y={blueY}
              r={10}
              fill="#9ec5fe"
              stroke="#3b82f6"
              strokeWidth={2}
              ifOverflow="extendDomain"
            />

            <ReferenceDot
              x={starScore}
              y={starY}
              ifOverflow="extendDomain"
              shape={({ cx, cy }) => (
                <text
                  x={cx}
                  y={(cy ?? 0) + 8}
                  textAnchor="middle"
                  fontSize={28}
                  fill="#fde047"
                  stroke="#ca8a04"
                  strokeWidth={0.8}
                >
                  ★
                </text>
              )}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <style jsx global>{`
        .histogram-chart .recharts-surface:focus,
        .histogram-chart .recharts-surface:focus-visible {
          outline: none !important;
        }
        .histogram-chart .histogram-bin-area,
        .histogram-chart .histogram-bin-area * {
          pointer-events: none;
        }
        .histogram-chart .recharts-reference-area-rect:focus,
        .histogram-chart .recharts-reference-area-rect:focus-visible {
          outline: none !important;
          stroke: none !important;
        }
      `}</style>
    </div>
  );
}

import type { SurveySummary } from "@/types";

type SurveySummaryCardProps = {
  summary: SurveySummary;
};

export function SurveySummaryCard({ summary }: SurveySummaryCardProps) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
        Survey Overview
      </p>
      <h1 className="mt-2 text-lg font-semibold text-gray-900">{summary.title}</h1>

      <dl className="mt-4 grid gap-4 text-sm text-gray-700 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <dt className="text-xs text-gray-500">所要時間</dt>
          <dd className="mt-1 font-semibold">{summary.durationMinutes}分</dd>
        </div>
        <div>
          <dt className="text-xs text-gray-500">報酬金額</dt>
          <dd className="mt-1 font-semibold">{summary.rewardYen}円</dd>
        </div>
        <div>
          <dt className="text-xs text-gray-500">回答数</dt>
          <dd className="mt-1 font-semibold">{summary.responseCount}</dd>
        </div>
        <div>
          <dt className="text-xs text-gray-500">回答期限</dt>
          <dd className="mt-1 font-semibold">{summary.deadline}</dd>
        </div>
      </dl>
    </section>
  );
}

import type { SurveyResponse } from "@/types";

type SurveyResponsesTableProps = {
  responses: SurveyResponse[];
  totalCount: number;
};

export function SurveyResponsesTable({
  responses,
  totalCount,
}: SurveyResponsesTableProps) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-[1100px] table-fixed border-collapse text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700">
              <th className="px-3 py-3">回答者名</th>
              <th className="px-3 py-3">大学名</th>
              <th className="px-3 py-3">学年</th>
              <th className="px-3 py-3">学部</th>
              <th className="px-3 py-3">学科</th>
              <th className="px-3 py-3">回答日時</th>
              <th className="px-3 py-3">Q1</th>
              <th className="px-3 py-3">Q2</th>
              <th className="px-3 py-3">Q3</th>
            </tr>
          </thead>
          <tbody>
            {responses.map((response) => (
              <tr key={response.id} className="border-b border-gray-100 text-gray-800">
                <td className="px-3 py-3">{response.respondentName}</td>
                <td className="px-3 py-3">{response.university}</td>
                <td className="px-3 py-3">{response.grade}</td>
                <td className="px-3 py-3">{response.faculty}</td>
                <td className="px-3 py-3">{response.department}</td>
                <td className="px-3 py-3">{response.answeredAt}</td>
                <td className="px-3 py-3">{response.q1}</td>
                <td className="px-3 py-3">{response.q2}</td>
                <td className="px-3 py-3">{response.q3}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-gray-600">
        <p>全{totalCount}件中 1-10件を表示</p>
        <div className="inline-flex items-center gap-2">
          <button
            type="button"
            className="rounded border border-gray-300 px-2 py-1 text-gray-500"
          >
            {"<"}
          </button>
          <button
            type="button"
            className="rounded border border-blue-600 bg-blue-600 px-2 py-1 text-white"
          >
            1
          </button>
          <button
            type="button"
            className="rounded border border-gray-300 px-2 py-1 text-gray-700"
          >
            2
          </button>
          <button
            type="button"
            className="rounded border border-gray-300 px-2 py-1 text-gray-700"
          >
            3
          </button>
          <button
            type="button"
            className="rounded border border-gray-300 px-2 py-1 text-gray-700"
          >
            {">"}
          </button>
        </div>
      </div>
    </section>
  );
}

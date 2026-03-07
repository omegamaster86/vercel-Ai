import type { SurveyResponse, SurveySummary } from "@/types";
import { SurveyResponsesTable } from "./_components/SurveyResponsesTable";
import { SurveySummaryCard } from "./_components/SurveySummaryCard";

const surveySummary: SurveySummary = {
  title: "夏休みの自由研究課題に関するアンケート",
  durationMinutes: 8,
  rewardYen: 300,
  responseCount: 21,
  deadline: "2025/11/30",
};

const responses: SurveyResponse[] = [
  {
    id: "res-001",
    respondentName: "ヤマダタロウ",
    university: "東京大学",
    grade: "3年",
    faculty: "工学部",
    department: "情報工学科",
    answeredAt: "2025/12/17 12:00",
    q1: "解答が入ります",
    q2: "解答が入ります",
    q3: "解答が入ります",
  },
  {
    id: "res-002",
    respondentName: "サトウハナコ",
    university: "早稲田大学",
    grade: "2年",
    faculty: "商学部",
    department: "経営学科",
    answeredAt: "2025/12/17 12:08",
    q1: "解答が入ります",
    q2: "解答が入ります",
    q3: "解答が入ります",
  },
  {
    id: "res-003",
    respondentName: "スズキイチロウ",
    university: "慶應義塾大学",
    grade: "4年",
    faculty: "理工学部",
    department: "機械工学科",
    answeredAt: "2025/12/17 12:12",
    q1: "解答が入ります",
    q2: "解答が入ります",
    q3: "解答が入ります",
  },
];

export default function SurveyResultsPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <SurveySummaryCard summary={surveySummary} />
        <SurveyResponsesTable responses={responses} totalCount={21} />
      </div>
    </main>
  );
}

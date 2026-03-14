import { SurveyResultTable } from "./_components/SurveyResultTable";

const rows = Array.from({ length: 10 }).map((_, index) => ({
  id: `row-${index + 1}`,
  respondentName: "ヤマダタロウ",
  university: "東京大学",
  grade: "3年",
  faculty: "工学部",
  department: "情報工学科",
  answeredAt: "2025/12/17 12:00",
  q1: "解答が入ります",
  q2: "解答が入ります",
  q3: "解答が入ります",
  q4: "解答が入ります",
  q5: "解答が入ります",
}));

export default function FigmaCarpeDiemPage() {
  return (
    <main className="min-h-screen bg-white px-4 py-8">
      <div className="mx-auto w-full max-w-[1160px]">
        <SurveyResultTable rows={rows} />
      </div>
    </main>
  );
}

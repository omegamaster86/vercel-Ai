type SurveyResultRow = {
  id: string;
  respondentName: string;
  university: string;
  grade: string;
  faculty: string;
  department: string;
  answeredAt: string;
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  q5: string;
};

type SurveyResultTableProps = {
  rows: SurveyResultRow[];
};

const COLUMNS = [
  "解答者名",
  "大学名",
  "学年",
  "学部",
  "学科",
  "回答日時",
  "Q1",
  "Q2",
  "Q3",
  "Q4",
  "Q5",
] as const;

export function SurveyResultTable({ rows }: SurveyResultTableProps) {
  return (
    <section className="overflow-x-auto">
      <div className="min-w-[1160px]">
        <div className="h-10 border-b border-[#E1E1E1] bg-white px-4">
          <ul className="flex h-full items-stretch gap-3">
            {COLUMNS.map((label) => (
              <li
                key={label}
                className="flex w-[120px] items-center text-[13px] font-bold leading-normal text-[#222222]"
              >
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col">
          {rows.map((row) => (
            <article
              key={row.id}
              className="h-16 border-b border-[#E1E1E1] bg-white px-4"
            >
              <ul className="flex h-full items-stretch gap-3">
                <li className="flex w-[120px] items-center text-[13px] font-medium leading-normal text-[#222222]">
                  {row.respondentName}
                </li>
                <li className="flex w-[120px] items-center text-[13px] font-medium leading-normal text-[#222222]">
                  {row.university}
                </li>
                <li className="flex w-[120px] items-center text-[13px] font-medium leading-normal text-[#222222]">
                  {row.grade}
                </li>
                <li className="flex w-[120px] items-center text-[13px] font-medium leading-normal text-[#222222]">
                  {row.faculty}
                </li>
                <li className="flex w-[120px] items-center text-[13px] font-medium leading-normal text-[#222222]">
                  {row.department}
                </li>
                <li className="flex w-[120px] items-center text-[13px] font-medium leading-normal text-[#222222]">
                  {row.answeredAt}
                </li>
                <li className="flex w-[120px] items-center text-[13px] font-medium leading-normal text-[#222222]">
                  {row.q1}
                </li>
                <li className="flex w-[120px] items-center text-[13px] font-medium leading-normal text-[#222222]">
                  {row.q2}
                </li>
                <li className="flex w-[120px] items-center text-[13px] font-medium leading-normal text-[#222222]">
                  {row.q3}
                </li>
                <li className="flex w-[120px] items-center text-[13px] font-medium leading-normal text-[#222222]">
                  {row.q4}
                </li>
                <li className="flex w-[120px] items-center text-[13px] font-medium leading-normal text-[#222222]">
                  {row.q5}
                </li>
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

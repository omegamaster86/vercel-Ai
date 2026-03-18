import { RechartsHistogramDemo } from "./_components/RechartsHistogramDemo";

export default function RechartsPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">択一式</h1>
        <p className="text-sm text-gray-600">
          入力した点数で、赤線・青丸・星マーカーをヒストグラム上に表示します。
        </p>
        <RechartsHistogramDemo />
      </div>
    </main>
  );
}
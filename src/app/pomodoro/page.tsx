import PomodoroSection from "@/components/pomodoro-section";

export default function PomodoroPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <h1 className="text-3xl font-bold mb-6">Pomodoro Timer</h1>
      <PomodoroSection />
    </main>
  );
}

// This layout disables the default app layout for the Pomodoro page, making it full-viewport and immersive.
import type { ReactNode } from "react";

export default function PomodoroLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

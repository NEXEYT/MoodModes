import { Variants } from "framer-motion";

export const scifiTheme = {
  name: "Sci-Fi / Space Mission",
  background: "bg-cover bg-center text-cyan-200",
  backgroundImage: "/scifi-bg.jpg",
  fontClass: "font-sans",
  soundEffects: {
    timerEnd: "/sounds/scifi/mission-complete.mp3",
  },
  animationVariants: {
    button: {
      hover: { scale: 1.1, boxShadow: "0 0 12px #00eaff" },
      tap: { scale: 0.95 },
    },
    screen: {
      initial: { opacity: 0, scale: 0.95, y: 40 },
      animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5 } },
      exit: { opacity: 0, scale: 0.95, y: -40 },
    },
    dashboard: {
      hover: { scale: 1.04, boxShadow: "0 0 10px #00eaff" },
    },
  } satisfies Record<string, Variants>,
};

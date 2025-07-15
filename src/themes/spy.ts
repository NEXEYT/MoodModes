import { Variants } from "framer-motion";

export const spyTheme = {
  name: "Spy Thriller",
  background: "bg-cover bg-center text-green-400",
  backgroundImage: "/spy-bg.jpg", // Add this property for image
  fontClass: "font-mono",
  soundEffects: {
    timerEnd: "/sounds/spy/mission-complete.mp3",
  },
  animationVariants: {
    button: {
      hover: { scale: 1.08, boxShadow: "0 0 8px #39ff14" },
      tap: { scale: 0.96 },
    },
    screen: {
      initial: { opacity: 0, y: 40 },
      animate: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80 } },
      exit: { opacity: 0, y: -40 },
    },
    code: {
      hover: { scale: 1.03, color: "#39ff14" },
    },
  } satisfies Record<string, Variants>,
};

export type Theme = typeof spyTheme;

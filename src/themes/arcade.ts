import { Variants } from "framer-motion";

export const arcadeTheme = {
  name: "Arcade / Retro",
  background: "bg-cover bg-center text-yellow-300",
  backgroundImage: "/arcade-bg.jpg",
  fontClass: "font-arcade",
  soundEffects: {
    timerEnd: "/sounds/arcade/gameover.mp3",
  },
  animationVariants: {
    button: {
      hover: { scale: 1.12, boxShadow: "0 0 12px #fbbf24" },
      tap: { scale: 0.94 },
    },
    screen: {
      initial: { opacity: 0, scale: 0.8, y: 40 },
      animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4 } },
      exit: { opacity: 0, scale: 0.8, y: -40 },
    },
    pixel: {
      hover: { scale: 1.05, filter: "contrast(1.2)" },
    },
  } satisfies Record<string, Variants>,
};

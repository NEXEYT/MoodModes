import { Variants } from "framer-motion";

export type ThemeKey =
  | "spy"
  | "scifi"
  | "arcade";

export interface ThemeConfig {
  key: ThemeKey;
  name: string;
  heading: string;
  backgroundClass: string;
  fontClass: string;
  taskPrefix: string;
  taskBoxClass: string;
  taskSounds: {
    taskAdd: string;
    taskComplete: string;
  };
  backgroundMedia?: string; // mp4/gif path
  animationVariants?: {
    taskItem?: Variants;
  };
}

export const themeConfigs: Record<ThemeKey, ThemeConfig> = {
  spy: {
    key: "spy",
    name: "Spy Thriller",
    heading: "Agent: Focus Protocol",
    backgroundClass: "bg-black",
    fontClass: "font-mono",
    taskPrefix: "Encrypted Directive:",
    taskBoxClass: "bg-[#001b1b] border border-[#00ff99] text-[#00ff99] font-mono",
    taskSounds: {
      taskAdd: "/sounds/spy/terminal-type.wav",
      taskComplete: "/sounds/spy/access-granted.mp3",
    },
    backgroundMedia: "/backgrounds/spy.mp4",
    animationVariants: {
      taskItem: {
        initial: { opacity: 0, y: -20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 20 },
      },
    },
  },
  scifi: {
    key: "scifi",
    name: "Sci-Fi / Space Mission",
    heading: "Mission Control",
    backgroundClass: "bg-gradient-to-br from-[#0b0e20] to-black",
    fontClass: "font-orbitron",
    taskPrefix: "Protocol:",
    taskBoxClass: "bg-gradient-to-br from-[#0b0e20] to-black text-[#00c2ff] border border-[#00c2ff] font-orbitron",
    taskSounds: {
      taskAdd: "/sounds/scifi/switch.wav",
      taskComplete: "/sounds/scifi/radar-ping.mp3",
    },
    backgroundMedia: "/backgrounds/scifi.mp4",
    animationVariants: {
      taskItem: {
        initial: { opacity: 0, y: -30 },
        animate: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.3 } },
        exit: { opacity: 0, y: 30 },
      },
    },
  },
  arcade: {
    key: "arcade",
    name: "Arcade / Retro",
    heading: "Task Invaders",
    backgroundClass: "bg-black",
    fontClass: "font-press_start_2p",
    taskPrefix: "Level:",
    taskBoxClass: "bg-black border border-pink-500 text-green-400 font-press_start_2p",
    taskSounds: {
      taskAdd: "/sounds/arcade/jump.wav",
      taskComplete: "/sounds/arcade/coin.wav",
    },
    backgroundMedia: "/backgrounds/arcade.mp4",
    animationVariants: {
      taskItem: {
        initial: { opacity: 0, y: -60, scale: 0.7 },
        animate: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", bounce: 0.5 } },
        exit: { opacity: 0, y: 60, scale: 0.7 },
      },
    },
  },
};

export function getThemeConfig(themeName: string) {
  const key = (Object.keys(themeConfigs) as ThemeKey[]).find(
    k => themeConfigs[k].name === themeName
  );
  return key ? themeConfigs[key] : themeConfigs.spy;
}

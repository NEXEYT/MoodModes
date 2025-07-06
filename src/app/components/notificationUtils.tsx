
import { taskTypeNotificationContent, TaskType } from "./taskTypeNotificationContent";
import dayjs from "dayjs";

export function getNotificationStage(task: { done: boolean; deadline: string }) {
  if (task.done) return null;
  const now = dayjs();
  const deadline = dayjs(task.deadline);
  const stage1 = 72, stage2 = 24, stage3 = 6;
  const diff = deadline.diff(now, "hour");
  if (diff <= 0) return null;
  if (diff <= stage3) return 3;
  if (diff <= stage2) return 2;
  if (diff <= stage1) return 1;
  return 0;
}

export function getTaskNotificationContent(
  task: { type: TaskType; deadline: string; themeName?: string },
  stage: number
) {
  const daysLeft = Math.ceil(dayjs(task.deadline).diff(dayjs(), 'day'));
  const hoursLeft = Math.max(1, Math.ceil(dayjs(task.deadline).diff(dayjs(), 'hour')));
  const minutesLeft = Math.max(1, Math.ceil(dayjs(task.deadline).diff(dayjs(), 'minute')));
  const type: TaskType = task.type || '';
  const theme = (task.themeName || '').toLowerCase();

  // Theme-based notification content (custom for each theme+type+stage)
  const themeTypeMessages: Record<string, Record<string, Record<number, (d: number, h: number, m: number) => React.ReactNode>>> = {
    'spy thriller': {
      everyday: {
        1: (d) => <>Agent: {d} days left. Maintain cover and stay sharp.</>,
        2: () => <>Agent: Less than a day left. Rendezvous imminent.</>,
        3: (d, h, m) => <>Agent: {h} hours ({m} min) left. Finalize your mission dossier!</>,
      },
      math: {
        1: (d) => <>Agent: {d} days left. Crack the code for the operation.</>,
        2: () => <>Agent: Less than a day left. Prepare for cipher decryption.</>,
        3: (d, h, m) => <>Agent: {h} hours ({m} min) left. Solve the equation to unlock the safe!</>,
      },
      english: {
        1: (d) => <>Agent: {d} days left. Compose your secret report.</>,
        2: () => <>Agent: Less than a day left. Edit your message for HQ.</>,
        3: (d, h, m) => <>Agent: {h} hours ({m} min) left. Transmit your final draft!</>,
      },
      science: {
        1: (d) => <>Agent: {d} days left. Prepare your experiment log.</>,
        2: () => <>Agent: Less than a day left. Analyze and report findings.</>,
        3: (d, h, m) => <>Agent: {h} hours ({m} min) left. Submit your results to HQ!</>,
      },
      history: {
        1: (d) => <>Agent: {d} days left. Chronicle your covert journey.</>,
        2: () => <>Agent: Less than a day left. Archive your discoveries.</>,
        3: (d, h, m) => <>Agent: {h} hours ({m} min) left. Complete your logbook!</>,
      },
      other: {
        1: (d) => <>Agent: {d} days left. Stay vigilant for new intel.</>,
        2: () => <>Agent: Less than a day left. Prepare for the next operation.</>,
        3: (d, h, m) => <>Agent: {h} hours ({m} min) left. Complete your mission!</>,
      },
    },
    'sci-fi / space mission': {
      everyday: {
        1: (d) => <>Mission: {d} days left. Maintain life support and systems check.</>,
        2: () => <>Mission: Less than a day left. Prepare for countdown.</>,
        3: (d, h, m) => <>Mission: {h} hours ({m} min) left. Initiate launch sequence!</>,
      },
      math: {
        1: (d) => <>Mission: {d} days left. Calculate trajectory for orbit.</>,
        2: () => <>Mission: Less than a day left. Finalize navigation equations.</>,
        3: (d, h, m) => <>Mission: {h} hours ({m} min) left. Solve for mission success!</>,
      },
      english: {
        1: (d) => <>Mission: {d} days left. Compose your log for the archives.</>,
        2: () => <>Mission: Less than a day left. Edit and transmit your message.</>,
        3: (d, h, m) => <>Mission: {h} hours ({m} min) left. Final draft required for uplink!</>,
      },
      science: {
        1: (d) => <>Mission: {d} days left. Prepare your experiment log.</>,
        2: () => <>Mission: Less than a day left. Analyze and report findings.</>,
        3: (d, h, m) => <>Mission: {h} hours ({m} min) left. Submit your results to Mission Control!</>,
      },
      history: {
        1: (d) => <>Mission: {d} days left. Chronicle your journey.</>,
        2: () => <>Mission: Less than a day left. Archive your discoveries.</>,
        3: (d, h, m) => <>Mission: {h} hours ({m} min) left. Complete your logbook!</>,
      },
      other: {
        1: (d) => <>Mission: {d} days left. Stay vigilant, new quest awaits.</>,
        2: () => <>Mission: Less than a day left. Prepare for the next challenge.</>,
        3: (d, h, m) => <>Mission: {h} hours ({m} min) left. Complete your mission!</>,
      },
    },
    'fantasy rpg': {
      everyday: {
        1: (d) => <>Quest: {d} days left. Prepare your party and supplies.</>,
        2: () => <>Quest: Less than a day left. The final battle approaches.</>,
        3: (d, h, m) => <>Quest: {h} hours ({m} min) left. Complete your quest for glory!</>,
      },
      math: {
        1: (d) => <>Quest: {d} days left. Solve the ancient riddle.</>,
        2: () => <>Quest: Less than a day left. The puzzle awaits your mind.</>,
        3: (d, h, m) => <>Quest: {h} hours ({m} min) left. Unlock the magic door!</>,
      },
      english: {
        1: (d) => <>Quest: {d} days left. Write your legend in the tome.</>,
        2: () => <>Quest: Less than a day left. Edit your epic tale.</>,
        3: (d, h, m) => <>Quest: {h} hours ({m} min) left. Scribe your final words!</>,
      },
      science: {
        1: (d) => <>Quest: {d} days left. Brew your potions and study the stars.</>,
        2: () => <>Quest: Less than a day left. Complete your magical research.</>,
        3: (d, h, m) => <>Quest: {h} hours ({m} min) left. Present your findings to the guild!</>,
      },
      history: {
        1: (d) => <>Quest: {d} days left. Chronicle your adventure.</>,
        2: () => <>Quest: Less than a day left. Archive your saga.</>,
        3: (d, h, m) => <>Quest: {h} hours ({m} min) left. Complete your logbook!</>,
      },
      other: {
        1: (d) => <>Quest: {d} days left. A new adventure awaits.</>,
        2: () => <>Quest: Less than a day left. Prepare for the unknown.</>,
        3: (d, h, m) => <>Quest: {h} hours ({m} min) left. Complete your mission!</>,
      },
    },
    'theatre / drama': {
      everyday: {
        1: (d) => <>Act: {d} days left. Rehearse your lines and cues.</>,
        2: () => <>Act: Less than a day left. The curtain rises soon.</>,
        3: (d, h, m) => <>Act: {h} hours ({m} min) left. Take your place on stage!</>,
      },
      math: {
        1: (d) => <>Act: {d} days left. Calculate the perfect timing.</>,
        2: () => <>Act: Less than a day left. The spotlight is on your solution.</>,
        3: (d, h, m) => <>Act: {h} hours ({m} min) left. Deliver your answer with flair!</>,
      },
      english: {
        1: (d) => <>Act: {d} days left. Write your monologue.</>,
        2: () => <>Act: Less than a day left. Edit your script.</>,
        3: (d, h, m) => <>Act: {h} hours ({m} min) left. Perform your final lines!</>,
      },
      science: {
        1: (d) => <>Act: {d} days left. Prepare your stage experiment.</>,
        2: () => <>Act: Less than a day left. Analyze your dramatic results.</>,
        3: (d, h, m) => <>Act: {h} hours ({m} min) left. Present your findings to the audience!</>,
      },
      history: {
        1: (d) => <>Act: {d} days left. Chronicle your dramatic journey.</>,
        2: () => <>Act: Less than a day left. Archive your performance.</>,
        3: (d, h, m) => <>Act: {h} hours ({m} min) left. Complete your logbook!</>,
      },
      other: {
        1: (d) => <>Act: {d} days left. The next act awaits.</>,
        2: () => <>Act: Less than a day left. Prepare for your encore.</>,
        3: (d, h, m) => <>Act: {h} hours ({m} min) left. Complete your mission!</>,
      },
    },
    'greek mythology': {
      everyday: {
        1: (d) => <>Trial: {d} days left. Prepare for the gods' challenge.</>,
        2: () => <>Trial: Less than a day left. Zeus is watching.</>,
        3: (d, h, m) => <>Trial: {h} hours ({m} min) left. Complete your heroic deed!</>,
      },
      math: {
        1: (d) => <>Trial: {d} days left. Solve the riddle of the Sphinx.</>,
        2: () => <>Trial: Less than a day left. The Oracle awaits your answer.</>,
        3: (d, h, m) => <>Trial: {h} hours ({m} min) left. Prove your wisdom to the gods!</>,
      },
      english: {
        1: (d) => <>Trial: {d} days left. Write your epic for Olympus.</>,
        2: () => <>Trial: Less than a day left. Edit your mythic tale.</>,
        3: (d, h, m) => <>Trial: {h} hours ({m} min) left. Scribe your final words!</>,
      },
      science: {
        1: (d) => <>Trial: {d} days left. Prepare your experiment for the gods.</>,
        2: () => <>Trial: Less than a day left. Analyze your divine results.</>,
        3: (d, h, m) => <>Trial: {h} hours ({m} min) left. Present your findings to Olympus!</>,
      },
      history: {
        1: (d) => <>Trial: {d} days left. Chronicle your mythic journey.</>,
        2: () => <>Trial: Less than a day left. Archive your legend.</>,
        3: (d, h, m) => <>Trial: {h} hours ({m} min) left. Complete your logbook!</>,
      },
      other: {
        1: (d) => <>Trial: {d} days left. The next labor awaits.</>,
        2: () => <>Trial: Less than a day left. Prepare for your fate.</>,
        3: (d, h, m) => <>Trial: {h} hours ({m} min) left. Complete your mission!</>,
      },
    },
    'arcade / retro': {
      everyday: {
        1: (d) => <>Level: {d} days left. Get ready for the next stage.</>,
        2: () => <>Level: Less than a day left. Insert coin to continue.</>,
        3: (d, h, m) => <>Level: {h} hours ({m} min) left. Beat the high score!</>,
      },
      math: {
        1: (d) => <>Level: {d} days left. Calculate your bonus points.</>,
        2: () => <>Level: Less than a day left. Prepare for the boss fight.</>,
        3: (d, h, m) => <>Level: {h} hours ({m} min) left. Solve to win the game!</>,
      },
      english: {
        1: (d) => <>Level: {d} days left. Write your name on the leaderboard.</>,
        2: () => <>Level: Less than a day left. Edit your entry for the hall of fame.</>,
        3: (d, h, m) => <>Level: {h} hours ({m} min) left. Enter your final initials!</>,
      },
      science: {
        1: (d) => <>Level: {d} days left. Prepare your power-ups and gadgets.</>,
        2: () => <>Level: Less than a day left. Analyze your score multipliers.</>,
        3: (d, h, m) => <>Level: {h} hours ({m} min) left. Present your findings to the arcade master!</>,
      },
      history: {
        1: (d) => <>Level: {d} days left. Chronicle your retro journey.</>,
        2: () => <>Level: Less than a day left. Archive your high scores.</>,
        3: (d, h, m) => <>Level: {h} hours ({m} min) left. Complete your logbook!</>,
      },
      other: {
        1: (d) => <>Level: {d} days left. The next challenge awaits.</>,
        2: () => <>Level: Less than a day left. Prepare for the next round.</>,
        3: (d, h, m) => <>Level: {h} hours ({m} min) left. Complete your mission!</>,
      },
    },
  };

  // Fallback to old logic if no theme/type match
  const themeKey = theme in themeTypeMessages ? theme : 'sci-fi / space mission';
  const typeKey = type in themeTypeMessages[themeKey] ? type : 'everyday';
  const msgFn = themeTypeMessages[themeKey]?.[typeKey]?.[stage];
  if (msgFn) {
    const msg = msgFn(daysLeft, hoursLeft, minutesLeft);
    return (
      <div className={`px-2 py-1 rounded text-xs font-semibold animate-pulse ${stage === 1 ? 'bg-green-600/20 text-green-300' : stage === 2 ? 'bg-yellow-600/20 text-yellow-300' : 'bg-red-600/20 text-red-300'}`}>
        {msg}
      </div>
    );
  }
  // fallback to default
  const notifFn = taskTypeNotificationContent[type]?.[stage];
  if (!notifFn) return null;
  const notifContent = notifFn(daysLeft, hoursLeft);
  return notifContent ? (
    <div className={`px-2 py-1 rounded text-xs font-semibold animate-pulse ${stage === 1 ? 'bg-green-600/20 text-green-300' : stage === 2 ? 'bg-yellow-600/20 text-yellow-300' : 'bg-red-600/20 text-red-300'}`}>
      {notifContent}
    </div>
  ) : null;
}

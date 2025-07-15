"use client";
import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Settings, Volume2, VolumeX } from 'lucide-react';
import { SpotifyWidget } from "@/components/spotify-widget";

const PomodoroSection = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('work'); // 'work', 'shortBreak', 'longBreak'
  // const [round, setRound] = useState(1); // unused
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [workDuration, setWorkDuration] = useState(25);
  const [shortBreakDuration, setShortBreakDuration] = useState(5);
  const [longBreakDuration, setLongBreakDuration] = useState(15);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Eerie dark background - foggy forest at night
  const backgroundImage = 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1920&q=80'; // Foggy forest, night
  const backgroundOverlay = 'bg-black/80';

  // Timer logic: auto-continue unless paused, play audio reliably
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds(prevSeconds => {
          if (prevSeconds > 0) {
            return prevSeconds - 1;
          } else if (minutes > 0) {
            setMinutes(m => m - 1);
            return 59;
          } else {
            // Timer finished: play sound and auto-advance
            if (soundEnabled) {
              // Use a promise to ensure play is called in user gesture context
              const audio = new Audio('/bell.wav');
              audio.volume = 0.7;
              audio.play().catch(() => {});
            }
            setTimeout(() => {
              handleTimerComplete();
            }, 100); // slight delay to allow sound to play
            return 0;
          }
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, minutes, soundEnabled]);


  // --- Customizable timer sequence ---
  // User can set the order and frequency of timers
  const [timerSequence, setTimerSequence] = useState([
    { type: 'work', count: 4 },
    { type: 'shortBreak', count: 4 },
    { type: 'longBreak', count: 1 },
  ]);
  const [currentStep, setCurrentStep] = useState(0);

  // Build the full sequence array based on user settings
  const buildSequence = () => {
    const seq: string[] = [];
    timerSequence.forEach(item => {
      for (let i = 0; i < item.count; i++) seq.push(item.type);
    });
    return seq;
  };

  // When timer completes, move to next in sequence and auto-start
  const handleTimerComplete = () => {
    const sequence = buildSequence();
    let nextStep = currentStep + 1;
    if (nextStep >= sequence.length) nextStep = 0;
    setCurrentStep(nextStep);
    const nextType = sequence[nextStep];
    setMode(nextType);
    setSeconds(0);
    if (nextType === 'work') setMinutes(workDuration);
    else if (nextType === 'shortBreak') setMinutes(shortBreakDuration);
    else setMinutes(longBreakDuration);
    setIsRunning(true); // auto-continue
  };

  // When user changes sequence, reset to first step
  useEffect(() => {
    setCurrentStep(0);
  }, [timerSequence]);

  // (removed duplicate handleTimerComplete)

  const setTimerMode = (newMode: 'work' | 'shortBreak' | 'longBreak') => {
    setIsRunning(false);
    setMode(newMode);
    setSeconds(0);
    if (newMode === 'work') setMinutes(workDuration);
    else if (newMode === 'shortBreak') setMinutes(shortBreakDuration);
    else setMinutes(longBreakDuration);
    // Also update currentStep to match the first occurrence of this mode in sequence
    const sequence = buildSequence();
    const idx = sequence.findIndex(t => t === newMode);
    setCurrentStep(idx >= 0 ? idx : 0);
  };

  // Update timer immediately when duration changes and mode matches
  useEffect(() => {
    if (mode === 'work') setMinutes(workDuration);
  }, [workDuration, mode]);
  useEffect(() => {
    if (mode === 'shortBreak') setMinutes(shortBreakDuration);
  }, [shortBreakDuration, mode]);
  useEffect(() => {
    if (mode === 'longBreak') setMinutes(longBreakDuration);
  }, [longBreakDuration, mode]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSeconds(0);
    if (mode === 'work') {
      setMinutes(workDuration);
    } else if (mode === 'shortBreak') {
      setMinutes(shortBreakDuration);
    } else {
      setMinutes(longBreakDuration);
    }
  };

  const formatTime = (mins: number, secs: number) => {
    const safeMins = Math.max(0, mins);
    const safeSecs = Math.max(0, secs);
    return `${safeMins.toString().padStart(2, '0')}:${safeSecs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 w-full h-full min-h-screen min-w-screen overflow-hidden scrollbar-hide dark bg-black" style={{overflow: 'hidden'}}>
      {/* Cinematic Background Image */}
      <div 
        className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: `url(${backgroundImage})` }}
        aria-label="Cinematic background"
      />
      {/* Overlay */}
      <div className={`fixed inset-0 w-full h-full ${backgroundOverlay} z-0`} />
      {/* Cinematic Vignette Overlay */}
      <div className="pointer-events-none fixed inset-0 z-20" style={{background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 60%, rgba(0,0,0,0.7) 100%)'}} />
      {/* Main Content */}
      <div className="relative z-10 flex flex-col h-full min-h-screen justify-between">
        {/* Controls Right Side (fixed, row, above navbar) */}
        <div className="fixed top-24 right-8 flex flex-row gap-4 z-40">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-3 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all hover:scale-105 backdrop-blur-sm"
            aria-label="Open settings"
            style={{display: 'flex'}}
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-3 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all hover:scale-105 backdrop-blur-sm"
            aria-label="Toggle sound"
            style={{display: 'flex'}}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>

        {/* Centered Timer Section */}
        <div className="flex flex-col items-center justify-center flex-grow px-6">
          {/* Mode Selection */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setTimerMode('work')}
              className={`px-6 py-3 rounded-full transition-all font-medium ${
                mode === 'work' 
                  ? 'bg-white text-gray-800 shadow-lg' 
                  : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
              }`}
            >
              Timer
            </button>
            <button
              onClick={() => setTimerMode('shortBreak')}
              className={`px-6 py-3 rounded-full transition-all font-medium ${
                mode === 'shortBreak' 
                  ? 'bg-white text-gray-800 shadow-lg' 
                  : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
              }`}
            >
              Short Break
            </button>
            <button
              onClick={() => setTimerMode('longBreak')}
              className={`px-6 py-3 rounded-full transition-all font-medium ${
                mode === 'longBreak' 
                  ? 'bg-white text-gray-800 shadow-lg' 
                  : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
              }`}
            >
              Long Break
            </button>
          </div>

          {/* Timer Display */}
          <div className="text-center mb-8">
            {/* Dramatic Theme Message */}
            <div className="mb-4">
              {(() => {
                // Dramatic, theme-based motivational messages
                let message = '';
                let sub = '';
                let color = 'text-white';
                if (mode === 'work') {
                  message = `MISSION: FOCUS`;
                  sub = `The world fades. Only your task remains. Every second counts.`;
                  color = 'text-red-400';
                } else if (mode === 'shortBreak') {
                  message = `INTERLUDE: RECOVER`;
                  sub = `A fleeting moment. Breathe. The next challenge awaits.`;
                  color = 'text-blue-300';
                } else if (mode === 'longBreak') {
                  message = `RECHARGE: HERO'S REST`;
                  sub = `You have earned this. Gather your strength for the next mission.`;
                  color = 'text-green-300';
                }
                return (
                  <>
                    <div className={`text-3xl md:text-4xl font-extrabold drop-shadow-lg text-center select-none animate-pulse-slow uppercase tracking-widest ${color}`}>
                      {message}
                    </div>
                    <div className="text-lg md:text-xl font-medium text-white/80 drop-shadow text-center select-none mt-2 animate-fade-in">
                      {sub}
                    </div>
                  </>
                );
              })()}
            </div>
            <div className="text-8xl md:text-9xl font-bold text-white mb-6 font-mono tracking-wider drop-shadow-lg">
              {formatTime(minutes, seconds)}
            </div>
            {/* Controls */}
            <div className="flex justify-center gap-6">
              <button
                onClick={toggleTimer}
                className="flex items-center gap-3 px-8 py-4 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all hover:scale-105 font-medium text-lg backdrop-blur-sm"
              >
                {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                {isRunning ? 'Pause' : 'Start'}
              </button>
              <button
                onClick={resetTimer}
                className="flex items-center gap-3 px-8 py-4 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all hover:scale-105 font-medium text-lg backdrop-blur-sm"
              >
                <RotateCcw className="w-6 h-6" />
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Spotify Widget - Bottom Left, always same playlist */}
        <div className="absolute bottom-6 left-6">
          <SpotifyWidget />
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div
            className="fixed bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 max-w-sm min-w-[340px] flex flex-col items-center animate-slide-in z-40"
            style={{
              top: '4.5rem', // slightly above the button
              right: '0.5rem', // panel hugs the right edge
              minWidth: '340px',
              maxWidth: '26rem',
            }}
          >
            {/* Settings button inside panel, top right, floating above content */}
            <button
              onClick={() => setShowSettings(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all hover:scale-110 backdrop-blur-sm z-50"
              aria-label="Close settings panel"
              type="button"
            >
              <Settings className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-semibold text-white mb-6">Settings</h3>
            <div className="space-y-6 w-full">
              {/* Timer Sequence Customization */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
                  Timer Sequence
                  <span className="relative group cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="inline w-4 h-4 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth="2" /><text x="12" y="16" textAnchor="middle" fontSize="12" fill="currentColor">i</text></svg>
                    <span className="absolute left-1/2 -translate-x-1/2 mt-2 w-56 bg-black/90 text-white text-xs rounded px-3 py-2 opacity-0 group-hover:opacity-100 transition pointer-events-none z-50">
                      Use ↑ and ↓ to reorder timers. Remove with ×. The order determines the timer flow.
                    </span>
                  </span>
                </label>
                <div className="flex flex-col gap-2">
                  {timerSequence.map((item, idx) => (
                    <div key={item.type + idx} className="flex items-center gap-2">
                      <select
                        className="bg-white/80 text-black rounded px-2 py-1 border border-white/30 focus:outline-none"
                        value={item.type}
                        onChange={e => {
                          const newSeq = [...timerSequence];
                          newSeq[idx].type = e.target.value;
                          setTimerSequence(newSeq);
                        }}
                      >
                        <option value="work">Work</option>
                        <option value="shortBreak">Short Break</option>
                        <option value="longBreak">Long Break</option>
                      </select>
                      <input
                        type="number"
                        min={1}
                        max={10}
                        value={item.count}
                        onChange={e => {
                          const newSeq = [...timerSequence];
                          newSeq[idx].count = Math.max(1, parseInt(e.target.value) || 1);
                          setTimerSequence(newSeq);
                        }}
                        className="w-16 px-2 py-1 rounded bg-white/20 border border-white/30 text-white focus:outline-none"
                      />
                      <button
                        className="text-white/70 hover:text-white px-2"
                        onClick={() => {
                          if (timerSequence.length > 1) {
                            setTimerSequence(timerSequence.filter((_, i) => i !== idx));
                          }
                        }}
                        title="Remove"
                        type="button"
                      >
                        &times;
                      </button>
                      {idx > 0 && (
                        <button
                          className="text-white/70 hover:text-white px-1"
                          onClick={() => {
                            const newSeq = [...timerSequence];
                            [newSeq[idx - 1], newSeq[idx]] = [newSeq[idx], newSeq[idx - 1]];
                            setTimerSequence(newSeq);
                          }}
                          title="Move Up"
                          type="button"
                        >
                          ↑
                        </button>
                      )}
                      {idx < timerSequence.length - 1 && (
                        <button
                          className="text-white/70 hover:text-white px-1"
                          onClick={() => {
                            const newSeq = [...timerSequence];
                            [newSeq[idx + 1], newSeq[idx]] = [newSeq[idx], newSeq[idx + 1]];
                            setTimerSequence(newSeq);
                          }}
                          title="Move Down"
                          type="button"
                        >
                          ↓
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Work Duration (minutes)
                </label>
                <input
                  type="number"
                  value={workDuration}
                  onChange={(e) => setWorkDuration(parseInt(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm"
                  min="1"
                  max="60"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Short Break (minutes)
                </label>
                <input
                  type="number"
                  value={shortBreakDuration}
                  onChange={(e) => setShortBreakDuration(parseInt(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm"
                  min="1"
                  max="30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Long Break (minutes)
                </label>
                <input
                  type="number"
                  value={longBreakDuration}
                  onChange={(e) => setLongBreakDuration(parseInt(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm"
                  min="1"
                  max="60"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PomodoroSection;
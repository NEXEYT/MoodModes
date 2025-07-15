
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TaskItem from "./components/TaskItem";
import { useTheme } from "./ThemeContext";
import { getThemeConfig } from "./themeConfig";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);


interface Task {
  id: number;
  created_at: string;
  name: string;
  deadline: string;
  done: boolean;
  description: string;
  type: string | null;
}

export default function TodoList() {
  // Returns notification stage (1, 2, 3) based on deadline proximity
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<{ [id: number]: { timeoutId: NodeJS.Timeout, expiresAt: number } }>({});
  const [, forceUpdate] = useState(0);
  //
  const { theme } = useTheme();
  const themeConfig = getThemeConfig(theme.name);
  const heading = themeConfig.heading;
  useEffect(() => {
    fetchTasks();
  }, []);
  async function fetchTasks() {
    setLoading(true);
    const { data, error } = await supabase.from("tasks").select("*").order("id", { ascending: false });
    if (!error && data) {
      setTasks(data.map(task => ({
        ...task,
        created_at: dayjs.utc(task.created_at).local().format(),
        deadline: dayjs.utc(task.deadline).local().format(),
      })));
    }
    setLoading(false);
  }
  async function addTask(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !deadline) return;
    const now = dayjs();
    let deadlineDate: dayjs.Dayjs;
    if (deadline.length > 10) {
      deadlineDate = dayjs(deadline);
    } else {
      deadlineDate = dayjs(deadline, "YYYY-MM-DD").endOf("day");
    }
    if (deadlineDate.diff(now, "minute") < 30) {
      alert("Deadline must be at least 30 minutes from now.");
      return;
    }
    const { data, error } = await supabase.from("tasks").insert([{ name: input, deadline, done: false, description, type }]).select();
    if (error) {
      alert("Supabase error: " + error.message);
      console.error("Supabase insert error", error);
      return;
    }
    if (data) setTasks([data[0], ...tasks]);
    setInput("");
    setDeadline("");
    setDescription("");
    setType("");
  }
  async function deleteTask(id: number) {
    setTasks(tasks => tasks.filter(task => task.id !== id));
    setPendingDelete(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
    await supabase.from("tasks").delete().eq("id", id);
  }
  return (
    <div className="fixed w-full h-full min-h-screen min-w-screen flex flex-col items-center justify-center overflow-hidden top-0 left-0">
      {/* THEME VIDEO/GIF BACKGROUND */}
      {themeConfig.backgroundMedia && (
        themeConfig.backgroundMedia.endsWith('.mp4') ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0"
            src={themeConfig.backgroundMedia}
          />
        ) : (
          <Image
            src={themeConfig.backgroundMedia}
            alt="Theme background"
            className="absolute inset-0 w-full h-full object-cover z-0"
            fill
            priority
          />
        )
      )}
      {/* Overlay for darken effect and text color (semi-transparent) */}
      <div
        className={`fixed inset-0 w-full min-h-screen min-w-screen z-10 pointer-events-none`}
        style={{
          background: themeConfig.backgroundClass.includes('gradient')
            ? undefined
            : 'rgba(0,0,0,0.6)',
          backgroundImage: themeConfig.backgroundClass.includes('gradient')
            ? undefined
            : undefined,
          color: '#fff',
        }}
      />
      {/* Main content */}
      <div className="relative z-20 w-full flex flex-col items-center justify-center">
      {/* Spacer after navbar */}
      <div style={{ height: 48 }} />
      <h1 className="text-3xl font-bold mb-8 mt-2 text-white drop-shadow-lg tracking-tight text-center w-full" style={{letterSpacing: 1}}>{heading}</h1>
      <form onSubmit={addTask} className="flex flex-col gap-3 mb-8 w-full max-w-2xl border-b border-neutral-700 pb-6 items-center justify-center">
        <div className="flex flex-wrap gap-3 mb-2 items-center">
          <label className="text-sm text-neutral-300">Type:</label>
          <select
            value={type}
            onChange={e => setType(e.target.value)}
            className="bg-neutral-900 border border-neutral-700 text-white rounded px-3 py-2 focus:outline-none w-36 min-w-[120px] max-w-[150px]"
            required
          >
            <option value="" disabled>Select type</option>
            <option value="everyday">Everyday Task</option>
            <option value="math">Math</option>
            <option value="english">English</option>
            <option value="science">Science</option>
            <option value="history">History</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="flex items-center gap-3">
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Task name..."
            className="flex-1 bg-transparent border-none shadow-none text-lg font-medium focus:ring-0 focus:outline-none text-white placeholder-neutral-400"
            style={{ color: '#fff' }}
          />
          <Input
            type="date"
            value={deadline}
            onChange={e => setDeadline(e.target.value)}
            placeholder="Deadline"
            className="w-36 bg-transparent border-none shadow-none text-base focus:ring-0 focus:outline-none text-white focus:border-none focus:shadow-none placeholder-neutral-400"
            style={{ colorScheme: 'dark', color: '#fff' }}
          />
          <Button type="submit" disabled={loading || !input.trim() || !deadline} className="rounded-md px-4 py-2 font-semibold bg-neutral-900 text-white hover:bg-neutral-800 transition">
            Add
          </Button>
        </div>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Description (optional)"
          className="w-full bg-transparent border-none rounded-md p-2 text-base min-h-[48px] resize-none focus:ring-0 focus:outline-none focus:border-none focus:shadow-none text-white placeholder-neutral-400 dark:placeholder-neutral-500 transition-colors"
          style={{ color: '#fff' }}
        />
      </form>
      <div className="w-full flex flex-col items-center justify-center" style={{ flex: 1, minHeight: 0 }}>
        <div className="w-full max-w-2xl flex-1 overflow-y-auto pb-8 mx-auto justify-center" style={{ minHeight: 0 }}>
          <AnimatePresence>
            {tasks.length === 0 && !loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center text-neutral-400 py-8">
                No tasks yet!
              </motion.div>
            )}
            {tasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onDelete={deleteTask}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
      {/* NotificationToaster removed */}
      </div>
    </div>
  );
}
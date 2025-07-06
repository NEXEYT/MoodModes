import { motion } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import dayjs from "dayjs";
import { useTheme } from "../ThemeContext";
import { getThemeConfig } from "../themeConfig";

interface Task {
  id: number;
  created_at: string;
  name: string;
  deadline: string;
  done: boolean;
  description: string;
  type: string | null;
}

interface TaskItemProps {
  task: Task;
  onDelete?: (id: number) => void;
}

import React from "react";
import { supabase } from "@/lib/supabase";
const TaskItem = ({
  task,
  onDelete,
}: TaskItemProps) => {
  // Checkbox completion handler with 7s delete timer
  const [pendingDelete, setPendingDelete] = React.useState(false);
  const [deleteTimeout, setDeleteTimeout] = React.useState<NodeJS.Timeout | null>(null);
  const [countdown, setCountdown] = React.useState<number | null>(null);

  const handleCheckboxChange = (checked: boolean | "indeterminate") => {
    if (checked === "indeterminate") return;
    if (checked) {
      setPendingDelete(true);
      setCountdown(7);
      // Start countdown interval
      const interval = setInterval(() => {
        setCountdown(prev => {
          if (prev === null) return null;
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      // Start delete timeout
      const timeout = setTimeout(async () => {
        // Remove from DB
        await supabase.from("tasks").delete().eq("id", task.id);
        if (onDelete) onDelete(task.id);
      }, 7000);
      setDeleteTimeout(timeout);
    } else {
      setPendingDelete(false);
      setCountdown(null);
      if (deleteTimeout) clearTimeout(deleteTimeout);
    }
  };
  const { theme } = useTheme();
  const themeConfig = getThemeConfig(theme.name);



  // Status logic
  let status = "Incomplete";
  let statusColor = "bg-yellow-100 text-yellow-800";
  if (task.done) {
    status = "Complete";
    statusColor = "bg-green-100 text-green-800";
  } else {
    const today = dayjs().startOf("day");
    const deadline = dayjs(task.deadline);
    if (deadline.isBefore(today)) {
      status = "Past deadline";
      statusColor = "bg-red-100 text-red-800";
    } else if (deadline.diff(today, "day") <= 2) {
      status = "Close to deadline";
      statusColor = "bg-orange-100 text-orange-800";
    }
  }

  // Checkbox removed; now using a button for completion toggle

  // Theme font and animation
  const fontClass = themeConfig.fontClass;
  const taskBoxClass = themeConfig.taskBoxClass;
  const prefix = themeConfig.taskPrefix;
  // Framer Motion expects TargetAndTransition, not generic object
  type VariantObj = import('framer-motion').TargetAndTransition;
  const variants = themeConfig.animationVariants?.taskItem as { initial: VariantObj; animate: VariantObj; exit: VariantObj } || {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  function getDeadlineLabel() {
    const now = dayjs();
    const deadline = dayjs(task.deadline);
    if (now.isAfter(deadline)) {
      const diff = now.diff(deadline, 'minute');
      if (diff < 60) return `Passed ${diff} min ago`;
      if (diff < 1440) return `Passed ${Math.floor(diff/60)} hr ago`;
      return `Passed ${Math.floor(diff/1440)} days ago`;
    }
    const diffDays = deadline.diff(now, 'day');
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    return `Due in ${diffDays} days`;
  }

  return (
    <motion.div
      className={`flex items-start justify-between p-4 my-2 rounded-lg shadow-md transition-all duration-300 ease-in-out ${taskBoxClass} ${fontClass}`}
      initial={variants.initial}
      animate={variants.animate}
      exit={variants.exit}
    >
      <div className="flex-1 mr-4">
        <div className="flex items-center mb-2 gap-2">
          <Checkbox
            checked={pendingDelete}
            onCheckedChange={handleCheckboxChange}
            aria-checked={pendingDelete}
            aria-label={pendingDelete ? `Task will be deleted soon` : `Mark ${task.name} as complete`}
            className={`mr-2 transition-all duration-200 ${pendingDelete ? 'opacity-60 scale-90' : 'opacity-100 scale-100'}`}
          />
          <span className={`text-lg font-semibold select-text ${pendingDelete ? 'line-through opacity-60' : ''} ${pendingDelete ? 'line-dashed' : ''}`}>
            {prefix} {task.name}
          </span>
          {pendingDelete && countdown !== null && countdown > 0 && (
            <span className="ml-2 text-xs text-red-500 animate-pulse">Deleting in {countdown}s...</span>
          )}
        </div>
        <div className="text-sm mb-2">
          <span className={`px-2 py-1 rounded-full ${statusColor}`}>
            {status}
          </span>
        </div>
        {/* Show description if present */}
        {task.description && (
          <div className="text-sm text-white/80 mb-2">
            {task.description}
          </div>
        )}
        {/* Show deadline time instead of created_at */}
        <div className="text-xs text-gray-500">
          Deadline: {dayjs(task.deadline).format("MMM D, YYYY h:mm A")}
        </div>
        {/* Theme-relevant line for incomplete tasks */}
        {!task.done && (
          <div className="text-xs mt-1" style={{ color: themeConfig.key === 'spy' ? '#00ff99' : themeConfig.key === 'scifi' ? '#00c2ff' : themeConfig.key === 'arcade' ? '#ff69b4' : '#fff' }}>
            {themeConfig.key === 'spy' && 'Agent: This directive is still active. Proceed with caution.'}
            {themeConfig.key === 'scifi' && 'Mission Control: Task incomplete. Awaiting your next move.'}
            {themeConfig.key === 'arcade' && 'Insert coin to continue your quest!'}
          </div>
        )}

      </div>
      <div className="flex flex-col items-end">
        <span className="text-xs text-gray-400 mt-1">
          {getDeadlineLabel()}
        </span>
      </div>
    </motion.div>
  );
};

export default TaskItem;

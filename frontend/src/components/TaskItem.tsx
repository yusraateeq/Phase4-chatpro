"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Task } from "@/types/task";
import { EditTaskDialog } from "@/components/EditTaskDialog";
import { DeleteTaskDialog } from "@/components/DeleteTaskDialog";
import { CheckCircle2, Terminal } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface TaskItemProps {
  task: Task;
  onToggleComplete: (taskId: string) => void;
  onTaskUpdated: (task: Task) => void;
  onTaskDeleted: (taskId: string) => void;
}

export function TaskItem({
  task,
  onToggleComplete,
  onTaskUpdated,
  onTaskDeleted,
}: TaskItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  const formattedDate = new Date(task.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  // Apex Protocol Geometry (Polygonal Clip)
  const CLIP_PATH = "polygon(1.5rem 0%, 100% 0%, 100% calc(100% - 1.5rem), calc(100% - 1.5rem) 100%, 0% 100%, 0% 1.5rem)";

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.005, transition: { duration: 0.3 } }}
      className="relative group p-[1px] transition-all duration-700 w-full"
    >
      {/* Reactive Atmospheric Depth Glow */}
      <AnimatePresence>
        {isHovered && !task.is_completed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute -inset-4 md:-inset-8 bg-primary/10 blur-[40px] md:blur-[80px] -z-10 rounded-full"
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

      <div
        style={{ clipPath: CLIP_PATH }}
        className={cn(
          "relative overflow-hidden transition-all duration-500",
          task.is_completed ? "bg-white/5 opacity-40 grayscale-[0.8]" : "bg-gradient-to-br from-primary/30 via-transparent to-white/10"
        )}
      >
        <div className={cn("relative flex items-center w-full min-h-[100px] p-4 md:p-6 gap-4 md:gap-6 bg-[#030014]")}> 
          {/* Slim Left Tag */}
          <div className="flex flex-col items-center justify-center w-16 md:w-20 shrink-0">
            <div className="rotate-90 text-xs font-black uppercase tracking-wide text-white/30">TASK</div>
            <div className="mt-2 text-[10px] text-white/40 font-mono">{formattedDate}</div>
            <div className={cn("mt-2 w-1 h-8 rounded-full", task.is_completed ? "bg-primary" : "bg-white/10")}/>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h3 className={cn("font-black text-lg md:text-2xl lg:text-3xl truncate", task.is_completed && "line-through italic text-white/40")}>{task.title}</h3>
                {task.description && (
                  <p className="text-white/70 text-sm md:text-base leading-tight font-mono truncate">{`>> ${task.description}`}</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <div className="flex gap-1 md:gap-2 p-1 md:p-2 bg-white/[0.02] border border-white/6 rounded-md">
                  <EditTaskDialog task={task} onTaskUpdated={onTaskUpdated} />
                  <DeleteTaskDialog task={task} onTaskDeleted={onTaskDeleted} />
                </div>
              </div>
            </div>
          </div>

          {/* Compact Checkbox */}
          <div className="shrink-0">
            <button onClick={() => onToggleComplete(task.id)} className={cn("h-10 w-10 md:h-12 md:w-12 flex items-center justify-center rounded-md border-2 transition-all", task.is_completed ? "bg-primary border-primary" : "border-white/10 bg-white/[0.02]") }>
              {task.is_completed ? <CheckCircle2 className="h-5 w-5 text-white" /> : <Terminal className="h-5 w-5 text-white/30" />}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

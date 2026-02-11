/**
 * TaskList component.
 * Fetches and displays all tasks for the authenticated user.
 */
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Task } from "@/types/task";
import { TaskItem } from "@/components/TaskItem";
import { tasksApi, ApiError } from "@/lib/api";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Inbox, RefreshCw } from "lucide-react";

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await tasksApi.getAll();
      setTasks(data);
    } catch (err) {
      if (err instanceof ApiError) {
        const message = err.data?.detail || "Failed to load tasks";
        setError(message);
        toast.error(message);
      } else {
        setError("An unexpected error occurred");
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleToggleComplete = async (taskId: string) => {
    // Optimistic update
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? { ...task, is_completed: !task.is_completed }
          : task
      )
    );

    try {
      const updatedTask = await tasksApi.toggleComplete(taskId);
      // Update with server response
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === taskId ? updatedTask : task))
      );
      toast.success(
        updatedTask.is_completed
          ? "Task marked as complete"
          : "Task marked as incomplete"
      );
    } catch (err) {
      // Rollback on error
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId
            ? { ...task, is_completed: !task.is_completed }
            : task
        )
      );
      if (err instanceof ApiError) {
        toast.error(err.data?.detail || "Failed to update task");
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const handleTaskDeleted = (taskId: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-24 bg-white/5 animate-pulse rounded-2xl border border-white/5"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Card className="bg-destructive/10 border-destructive/20 glass">
          <CardContent className="py-12 text-center">
            <p className="text-destructive font-medium mb-6">{error}</p>
            <Button onClick={fetchTasks} variant="outline" className="gap-2 border-destructive/20 hover:bg-destructive/10">
              <RefreshCw className="h-4 w-4" />
              Try again
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (tasks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="glass border-white/5">
          <CardContent className="py-20 text-center">
            <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
              <Inbox className="h-8 w-8 text-white/30" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Your workspace is empty</h3>
            <p className="text-white/40 max-w-xs mx-auto">
              Ready to manifest your goals? Start by creating your first task.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const completedCount = tasks.filter((t) => t.is_completed).length;
  const totalCount = tasks.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-white/40 uppercase tracking-widest">
            {totalCount} task{totalCount !== 1 ? "s" : ""}
          </span>
          <div className="h-1 w-1 rounded-full bg-white/20" />
          <span className="text-sm font-medium text-primary/70 uppercase tracking-widest">
            {completedCount} completed
          </span>
        </div>
      </div>

      <motion.div
        layout
        className="space-y-6"
      >
        <AnimatePresence mode="popLayout">
          {tasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, x: -20 }}
              transition={{
                duration: 0.3,
                delay: index * 0.05,
                type: "spring",
                stiffness: 100
              }}
              layout
            >
              <TaskItem
                task={task}
                onToggleComplete={handleToggleComplete}
                onTaskUpdated={handleTaskUpdated}
                onTaskDeleted={handleTaskDeleted}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

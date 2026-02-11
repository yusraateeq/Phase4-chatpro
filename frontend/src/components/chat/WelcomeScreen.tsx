"use client";

import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/Logo";

interface WelcomeScreenProps {
  onStarterPrompt: (prompt: string) => void;
}

const starterPrompts = [
  {
    title: "Create a task",
    description: "Add a new task to my todo list",
    prompt: "Create a new task for me: Review project documentation",
  },
  {
    title: "List my tasks",
    description: "Show all my pending tasks",
    prompt: "Show me all my pending tasks",
  },
  {
    title: "Help me organize",
    description: "Get productivity tips",
    prompt: "Give me some tips to organize my day better",
  },
  {
    title: "Complete a task",
    description: "Mark a task as done",
    prompt: "What tasks do I have? I'd like to mark one as complete.",
  },
];

export function WelcomeScreen({ onStarterPrompt }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-full py-12 sm:py-0 px-4 max-w-4xl mx-auto space-y-8 sm:space-y-12 animate-in fade-in duration-700">
      {/* Logo Section */}
      <div className="relative group">
        <Logo size={80} className="sm:hidden relative z-10" />
        <Logo size={120} className="hidden sm:block relative z-10" />
        <div className="absolute -top-2 -right-2 bg-background border rounded-full p-2 shadow-xl animate-bounce z-20">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
      </div>

      {/* Welcome Text */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
          Welcome to <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-400">Todo Pro</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-lg mx-auto leading-relaxed">
          Manifest Your Goals with Agent. How can I help you today?
        </p>
      </div>

      {/* Starter Prompts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl px-4">
        {starterPrompts.map((item, index) => (
          <Button
            key={index}
            variant="outline"
            className="h-auto p-6 justify-start text-left flex flex-col items-start gap-2 bg-card hover:bg-primary/5 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 rounded-2xl border-muted/50 group"
            onClick={() => onStarterPrompt(item.prompt)}
          >
            <div className="flex items-center gap-2 w-full">
              <span className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">{item.title}</span>
              <div className="h-1.5 w-1.5 rounded-full bg-primary/30 group-hover:bg-primary ml-auto transition-colors" />
            </div>
            <span className="text-sm text-muted-foreground leading-snug">{item.description}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { Pencil, Trash2, Check, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConversationSummary } from "@/types/chat";
import { cn } from "@/lib/utils";

interface ConversationItemProps {
  conversation: ConversationSummary;
  isActive: boolean;
  onSelect: () => void;
  onRename: (title: string) => void;
  onDelete: () => void;
}

export function ConversationItem({
  conversation,
  isActive,
  onSelect,
  onRename,
  onDelete,
}: ConversationItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(conversation.title || "");
  const [showActions, setShowActions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleStartEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditTitle(conversation.title || "");
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (editTitle.trim()) {
      onRename(editTitle.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditTitle(conversation.title || "");
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveEdit();
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  };

  const displayTitle = conversation.title || "New conversation";

  return (
    <div
      className={cn(
        "group relative flex items-center gap-3 px-3 py-2.5 rounded-2xl cursor-pointer transition-all duration-300",
        isActive
          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]"
          : "text-sidebar-muted hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
      )}
      onClick={onSelect}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => !isEditing && setShowActions(false)}
    >
      <div className={cn(
        "h-8 w-8 rounded-xl flex items-center justify-center transition-colors",
        isActive ? "bg-white/20" : "bg-sidebar-accent group-hover:bg-primary/10"
      )}>
        <MessageSquare className={cn("h-4 w-4", isActive ? "text-white" : "group-hover:text-primary")} />
      </div>

      {isEditing ? (
        <div className="flex-1 flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <Input
            ref={inputRef}
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-8 px-2 py-1 text-sm bg-background border-none rounded-xl focus-visible:ring-1 focus-visible:ring-primary"
          />
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 flex-shrink-0 hover:bg-primary/10 hover:text-primary rounded-xl"
            onClick={handleSaveEdit}
          >
            <Check className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <>
          <span className="flex-1 truncate text-xs font-bold tracking-tight">{displayTitle}</span>

          {/* Action buttons */}
          {showActions && (
            <div className="flex items-center gap-1 animate-in fade-in slide-in-from-right-2 duration-200" onClick={(e) => e.stopPropagation()}>
              <Button
                size="icon"
                variant="ghost"
                className={cn(
                  "h-7 w-7 rounded-lg transition-all",
                  isActive ? "hover:bg-white/20 text-white" : "hover:bg-primary/10 hover:text-primary text-sidebar-muted"
                )}
                onClick={handleStartEdit}
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className={cn(
                  "h-7 w-7 rounded-lg transition-all",
                  isActive ? "hover:bg-destructive/20 text-white" : "hover:bg-destructive/10 hover:text-destructive text-sidebar-muted"
                )}
                onClick={handleDelete}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

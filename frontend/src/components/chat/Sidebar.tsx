"use client";

import { useState } from "react";
import {
  Plus,
  LogOut,
  Settings,
  MessageSquare,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/button";
import { ConversationItem } from "@/components/chat/ConversationItem";
import { ConversationSummary } from "@/types/chat";
import { UserProfile } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SidebarProps {
  conversations: ConversationSummary[];
  activeConversationId: string | null;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  onRenameConversation: (id: string, title: string) => void;
  onDeleteConversation: (id: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  user: UserProfile | null;
  onLogout: () => void;
  onUpdateProfile: (data: { full_name?: string; profile_picture?: string }) => void;
}

export function Sidebar({
  conversations,
  activeConversationId,
  onNewChat,
  onSelectConversation,
  onRenameConversation,
  onDeleteConversation,
  isCollapsed,
  onToggleCollapse,
  user,
  onLogout,
  onUpdateProfile,
}: SidebarProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [editName, setEditName] = useState(user?.full_name || "");
  const [editPicture, setEditPicture] = useState(user?.profile_picture || "");

  const handleSaveProfile = () => {
    onUpdateProfile({
      full_name: editName || undefined,
      profile_picture: editPicture || undefined,
    });
    setIsProfileOpen(false);
  };

  const displayName = user?.full_name || user?.email?.split("@")[0] || "User";
  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-sidebar border-r border-sidebar-border/50 transition-all duration-300 ease-in-out selection:bg-primary/20",
        isCollapsed ? "w-0 overflow-hidden" : "w-[280px]"
      )}
    >
      {/* Sidebar Header */}
      <div className="flex flex-col p-4 gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 px-1">
            <Logo size={28} />
            <span className="font-bold text-sm tracking-tight">Todo Pro</span>
          </div>
          <Button
            onClick={onToggleCollapse}
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent rounded-xl ml-auto"
          >
            <PanelLeftClose className="h-4 w-4" />
          </Button>
        </div>

        <Button
          onClick={onNewChat}
          variant="default"
          className="w-full justify-start gap-3 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/10 rounded-2xl h-11 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          <span className="font-semibold text-sm">New conversation</span>
        </Button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto px-2 py-2 scrollbar-thin space-y-4">
        <div className="px-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-sidebar-muted/50">History</span>
        </div>

        {conversations.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <div className="h-10 w-10 rounded-2xl bg-sidebar-accent mx-auto mb-3 flex items-center justify-center opacity-40">
              <MessageSquare className="h-5 w-5 text-sidebar-foreground" />
            </div>
            <p className="text-xs text-sidebar-muted font-medium">No chats found.</p>
          </div>
        ) : (
          <nav className="space-y-1">
            {conversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isActive={conversation.id === activeConversationId}
                onSelect={() => onSelectConversation(conversation.id)}
                onRename={(title: string) => onRenameConversation(conversation.id, title)}
                onDelete={() => onDeleteConversation(conversation.id)}
              />
            ))}
          </nav>
        )}
      </div>

      {/* User Section - High End Upgrade */}
      <div className="p-4 mt-auto">
        <div className="p-3 rounded-3xl bg-sidebar-accent/30 border border-sidebar-border/30 backdrop-blur-sm group">
          <div className="flex items-center gap-3">
            {/* User Avatar */}
            {user?.profile_picture ? (
              <div className="relative h-10 w-10 rounded-2xl overflow-hidden ring-2 ring-background shadow-lg">
                <img
                  src={user.profile_picture}
                  alt={displayName}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="h-10 w-10 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20 font-bold">
                {avatarLetter}
              </div>
            )}

            {/* User Info */}
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-sm font-bold text-sidebar-foreground truncate tracking-tight">
                {displayName}
              </span>
              <span className="text-[10px] text-sidebar-muted font-bold uppercase tracking-widest truncate opacity-60">
                Pro Account
              </span>
            </div>

            {/* Profile Settings Trigger */}
            <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
              <div className="flex flex-col gap-1">
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-sidebar-muted hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                    onClick={() => {
                      setEditName(user?.full_name || "");
                      setEditPicture(user?.profile_picture || "");
                    }}
                  >
                    <Settings className="h-3.5 w-3.5" />
                  </Button>
                </DialogTrigger>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-sidebar-muted hover:text-destructive hover:bg-destructive/5 rounded-lg transition-all"
                  onClick={onLogout}
                >
                  <LogOut className="h-3.5 w-3.5" />
                </Button>
              </div>

              <DialogContent className="sm:max-w-[425px] rounded-[2rem] border-none shadow-2xl p-8">
                <DialogHeader className="items-center text-center space-y-4">
                  <div className="h-16 w-16 rounded-3xl bg-primary/10 flex items-center justify-center mb-2">
                    <Settings className="h-8 w-8 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <DialogTitle className="text-2xl font-bold tracking-tight">Account Settings</DialogTitle>
                    <DialogDescription className="text-sm font-medium">
                      Personalize your AI Assistant experience.
                    </DialogDescription>
                  </div>
                </DialogHeader>
                <div className="grid gap-6 py-6 font-medium">
                  <div className="grid gap-2">
                    <Label className="text-xs uppercase tracking-widest text-muted-foreground ml-1" htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      value={user?.email || ""}
                      disabled
                      className="bg-muted/50 border-none h-12 rounded-2xl px-4"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-xs uppercase tracking-widest text-muted-foreground ml-1" htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Enter your full name"
                      className="bg-muted/30 focus-visible:ring-primary border-none h-12 rounded-2xl px-4"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-xs uppercase tracking-widest text-muted-foreground ml-1" htmlFor="profilePicture">Avatar URL</Label>
                    <Input
                      id="profilePicture"
                      value={editPicture}
                      onChange={(e) => setEditPicture(e.target.value)}
                      placeholder="https://example.com/avatar.jpg"
                      className="bg-muted/30 focus-visible:ring-primary border-none h-12 rounded-2xl px-4"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-3 mt-4">
                  <Button onClick={handleSaveProfile} className="h-12 rounded-2xl font-bold bg-primary shadow-xl shadow-primary/20">
                    Save Changes
                  </Button>
                  <Button variant="ghost" onClick={() => setIsProfileOpen(false)} className="rounded-2xl h-12 font-bold text-muted-foreground">
                    Cancel
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </aside>
  );
}

// Sidebar Toggle Button for when sidebar is collapsed
export function SidebarToggle({ onClick }: { onClick: () => void }) {
  return (
    <Button
      onClick={onClick}
      variant="ghost"
      size="icon"
      className="fixed left-4 top-4 z-50 bg-background/80 backdrop-blur-sm border shadow-sm hover:bg-accent"
    >
      <PanelLeft className="h-4 w-4" />
    </Button>
  );
}

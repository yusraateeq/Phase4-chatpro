"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { ChatInterface } from "../ChatInterface";
import { conversationsApi, chatApi, authApi, UserProfile } from "@/lib/api";
import { ConversationSummary, Message } from "@/types/chat";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  Settings,
  Plus,
  Menu,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export function ChatLayout() {
  const router = useRouter();
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    loadUserProfile();
    loadConversations();
  }, []);
  useEffect(() => {
    if (activeConversationId) {
      loadMessages(activeConversationId);
    } else {
      setMessages([]);
    }
  }, [activeConversationId]);

  const loadUserProfile = async () => {
    try {
      const profile = await authApi.getProfile();
      setUser(profile);
    } catch (error) {
      console.error("Failed to load user profile:", error);
    }
  };

  const loadConversations = async () => {
    try {
      const data = await conversationsApi.list();
      setConversations(data);
      // Do NOT auto-select conversation - show welcome screen by default
    } catch (error) {
      console.error("Failed to load conversations:", error);
    } finally {
      setIsInitializing(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      setIsLoading(true);
      const data = await conversationsApi.get(conversationId);
      setMessages(data.messages);
    } catch (error) {
      console.error("Failed to load messages:", error);
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setActiveConversationId(null);
    setMessages([]);
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
  };

  const handleRenameConversation = async (id: string, title: string) => {
    try {
      await conversationsApi.rename(id, title);
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === id ? { ...conv, title } : conv
        )
      );
      toast.success("Conversation renamed");
    } catch (error) {
      toast.error("Failed to rename conversation");
    }
  };

  const handleDeleteConversation = async (id: string) => {
    try {
      await conversationsApi.delete(id);
      setConversations((prev) => prev.filter((conv) => conv.id !== id));

      // If we deleted the active conversation, clear it
      if (id === activeConversationId) {
        setActiveConversationId(null);
        setMessages([]);
      }
      toast.success("Conversation deleted");
    } catch (error) {
      toast.error("Failed to delete conversation");
    }
  };

  const handleSendMessage = async (content: string) => {
    // Optimistic update - add user message
    const tempUserMessage: Message = {
      id: "temp-user-" + Date.now(),
      role: "user",
      content: content,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMessage]);
    setIsLoading(true);

    try {
      const response = await chatApi.sendMessage(content, activeConversationId || undefined);

      // If this was a new conversation, update the active ID
      if (!activeConversationId) {
        setActiveConversationId(response.conversation_id);
      }

      // Replace temp user message with the one from response (which has real ID)
      // and add assistant's response
      setMessages((prev) => {
        // Remove the temporary message
        const withoutTemp = prev.filter((m) => m.id !== tempUserMessage.id);

        // Add the response message, but check if it's already there (rare race condition)
        const exists = withoutTemp.some(m => m.id === response.message.id);
        if (exists) return withoutTemp;

        // We keep the temp message content as the "real" user message until a full refresh
        // but we should probably prioritize the server state if possible.
        // For now, adding the assistant response.
        return [...withoutTemp, tempUserMessage, response.message];
      });

      // Refresh conversation list to show new/updated conversation
      await loadConversations();

    } catch (error) {
      toast.error("Failed to send message");
      // Remove the optimistic message on error
      setMessages((prev) => prev.filter((m) => m.id !== tempUserMessage.id));
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
      toast.success("Logged out successfully");
      router.push("/");
      router.refresh();
    } catch (error) {
      // API call failed (or was unauthorized), but we navigate anyway
      // authApi.logout() already cleared the token in its finally block
      router.push("/");
      router.refresh();
    }
  };

  const handleUpdateProfile = async (data: { full_name?: string; profile_picture?: string }) => {
    try {
      const updatedProfile = await authApi.updateProfile(data);
      setUser(updatedProfile);
      toast.success("Profile updated");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };


  if (isInitializing) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[100dvh] bg-background overflow-hidden">
      <div className="flex-1 flex overflow-hidden bg-background/40 backdrop-blur-3xl m-2 sm:m-4 rounded-[2.5rem] border border-white/10 shadow-2xl">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={handleSelectConversation}
          onNewChat={handleNewChat}
          onRenameConversation={handleRenameConversation}
          onDeleteConversation={handleDeleteConversation}
          user={user} // Kept user prop as it was in original Sidebar
          onLogout={handleLogout} // Kept onLogout prop as it was in original Sidebar
          onUpdateProfile={handleUpdateProfile} // Kept onUpdateProfile prop as it was in original Sidebar
        />

        <main className="flex-1 flex flex-col min-w-0 relative">
          {/* Header Mobile - Redesigned */}
          <div className="flex items-center justify-between p-4 border-b border-border/50 md:hidden bg-background/50 backdrop-blur-md">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarCollapsed(false)}
              className="rounded-xl overflow-hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Logo size={24} />
              <span className="font-bold text-sm">Todo Pro</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNewChat}
              className="rounded-xl"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-hidden relative">
            <ChatInterface
              conversationId={activeConversationId}
              messages={messages}
              isLoading={isLoading}
              onSendMessage={handleSendMessage}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

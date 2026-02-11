/**
 * API client for communicating with the Todo Backend API.
 * Handles authentication, request/response formatting, and error handling.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * API error response data structure.
 */
export interface ApiErrorData {
  detail?: string;
  [key: string]: unknown;
}
/**
 * Custom error class for API errors.
 */
export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data?: ApiErrorData
  ) {
    super(`API Error: ${status} ${statusText}`);
    this.name = "ApiError";
  }
}

/**
 * Get the authentication token from localStorage.
 */
function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
}

/**
 * Set the authentication token in localStorage.
 */
export function setAuthToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("auth_token", token);
}

/**
 * Remove the authentication token from localStorage.
 */
export function clearAuthToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("auth_token");
}

/**
 * Make an authenticated API request.
 */
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  const url = `${API_URL}${endpoint}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  // Add Authorization header if token exists
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle errors
    if (!response.ok) {
      if (response.status === 401) {
        clearAuthToken();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }

      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { detail: response.statusText };
      }
      throw new ApiError(response.status, response.statusText, errorData);
    }

    if (response.status === 204) {
      return null as T;
    }

    return response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error(`[API] Failed to fetch ${url}`, error);
    throw error;
  }
}

// ============================================
// Authentication API
// ============================================

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface RegisterResponse {
  id: string;
  email: string;
  is_active: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface UserProfile {
  id: string;
  email: string;
  is_active: boolean;
}

export const authApi = {
  /**
   * Register a new user account.
   */
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    return fetchApi<RegisterResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Login with email and password.
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await fetchApi<LoginResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
    // Store the token
    setAuthToken(response.access_token);
    return response;
  },

  /**
   * Logout the current user.
   */
  logout: async (): Promise<void> => {
    try {
      await fetchApi<void>("/api/auth/logout", {
        method: "POST",
      });
    } finally {
      // Always clear the token, even if the API call fails
      clearAuthToken();
    }
  },

  /**
   * Get the current user's profile.
   */
  getProfile: async (): Promise<UserProfile> => {
    return fetchApi<UserProfile>("/api/auth/me");
  },

  /**
   * Update the current user's profile.
   */
  updateProfile: async (data: { email?: string }): Promise<UserProfile> => {
    return fetchApi<UserProfile>("/api/auth/me", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },
};

// ============================================
// Tasks API
// ============================================

export type Priority = 'low' | 'medium' | 'high';
export type RecurringInterval = 'daily' | 'weekly' | 'monthly';

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  is_completed: boolean;
  priority: Priority;
  tags?: string;
  due_date?: string;
  is_recurring: boolean;
  recurring_interval?: RecurringInterval;
  next_due_date?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  is_completed?: boolean;
}

export const tasksApi = {
  /**
   * Get all tasks for the authenticated user.
   */
  getAll: async (): Promise<Task[]> => {
    return fetchApi<Task[]>("/api/tasks");
  },

  /**
   * Get a single task by ID.
   */
  getById: async (taskId: string): Promise<Task> => {
    return fetchApi<Task>(`/api/tasks/${taskId}`);
  },

  /**
   * Create a new task.
   */
  create: async (data: CreateTaskRequest): Promise<Task> => {
    return fetchApi<Task>("/api/tasks", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Update an existing task.
   */
  update: async (taskId: string, data: UpdateTaskRequest): Promise<Task> => {
    return fetchApi<Task>(`/api/tasks/${taskId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete a task.
   */
  delete: async (taskId: string): Promise<void> => {
    return fetchApi<void>(`/api/tasks/${taskId}`, {
      method: "DELETE",
    });
  },

  /**
   * Toggle task completion status.
   */
  toggleComplete: async (taskId: string): Promise<Task> => {
    return fetchApi<Task>(`/api/tasks/${taskId}/complete`, {
      method: "PATCH",
    });
  },
};

// ============================================
// Chat API
// ============================================

export interface Conversation {
  id: string;
  user_id: string;
  created_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface ChatRequest {
  message: string;
  conversation_id?: string;
}

export interface ChatResponse {
  message: string;
  conversation_id: string;
}

export const chatApi = {
  sendMessage: async (request: ChatRequest): Promise<ChatResponse> => {
    return fetchApi<ChatResponse>("/api/chat", {
      method: "POST",
      body: JSON.stringify(request),
    });
  },
};

export interface ConversationDetail extends Conversation {
  messages: Message[];
}

export const conversationsApi = {
  /**
   * Get all conversations for the authenticated user.
   */
  list: async (): Promise<Conversation[]> => {
    return fetchApi<Conversation[]>("/api/conversations");
  },

  /**
   * Get a single conversation with its messages.
   */
  get: async (conversationId: string): Promise<ConversationDetail> => {
    return fetchApi<ConversationDetail>(`/api/conversations/${conversationId}`);
  },

  /**
   * Rename a conversation.
   */
  rename: async (conversationId: string, title: string): Promise<Conversation> => {
    return fetchApi<Conversation>(`/api/conversations/${conversationId}`, {
      method: "PUT",
      body: JSON.stringify({ title }),
    });
  },

  /**
   * Delete a conversation.
   */
  delete: async (conversationId: string): Promise<void> => {
    return fetchApi<void>(`/api/conversations/${conversationId}`, {
      method: "DELETE",
    });
  },
};


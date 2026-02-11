
/**
 * Task type definitions.
 * Matches the backend API TaskRead schema.
 */

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

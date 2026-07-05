import { isAxiosError } from 'axios';
import type { $ZodIssue } from 'zod/v4/core';

export const formatDate = (dateStr: string): string => {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 1000 / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) return 'Just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays <= 7) return `${diffDays} days ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const mapZodIssues = (issues: $ZodIssue[]): Record<string, string> => {
  const fieldErrors: Record<string, string> = {};
  issues.forEach((issue) => {
    const field = String(issue.path[0]);
    if (field) fieldErrors[field] = issue.message;
  });
  return fieldErrors;
};

export const parseApiError = (issue: $ZodIssue[]): string => {
  return issue[0].message;
};

export const makeKey = (contactId: number, threadId: number) => `${contactId}-${threadId}`;

export const getErrorMessage = (error: unknown, fallback = 'Something went wrong'): string => {
  if (isAxiosError(error)) {
    const serverMessage = error.response?.data?.message;
    if (typeof serverMessage === 'string' && serverMessage.trim().length > 0) {
      return serverMessage;
    }
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return fallback;
};

export const extractApiError = (error: any) => {
  const issues = error?.response?.data?.errors;
  const serverError = error?.response?.data?.message ?? error?.message ?? 'Something went wrong';
  const status = error?.response?.status;
  return { issues, serverError, status };
};

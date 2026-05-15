"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

/* ── Types ── */
export interface TopicProgress {
  read: boolean;
  quizPassed: boolean;
  terminalCompleted: boolean;
}

interface ProgressState {
  [topicId: string]: TopicProgress;
}

interface ProgressContextValue {
  progress: ProgressState;
  markRead: (topicId: string) => void;
  markQuizPassed: (topicId: string) => void;
  markTerminalCompleted: (topicId: string) => void;
  isTopicComplete: (topicId: string) => boolean;
  getCompletionPercent: () => number;
  resetProgress: () => void;
}

const STORAGE_KEY = "portafolio-so-progress";

const defaultProgress: TopicProgress = {
  read: false,
  quizPassed: false,
  terminalCompleted: false,
};

/* ── Context ── */
const ProgressContext = createContext<ProgressContextValue | null>(null);

/* ── Provider ── */
export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<ProgressState>({});
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setProgress(JSON.parse(stored));
      }
    } catch {
      // localStorage unavailable (SSR or private mode)
    }
    setHydrated(true);
  }, []);

  // Persist to localStorage on changes
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Silently fail
    }
  }, [progress, hydrated]);

  const getTopicProgress = useCallback(
    (topicId: string): TopicProgress => progress[topicId] || { ...defaultProgress },
    [progress]
  );

  const updateTopic = useCallback(
    (topicId: string, updates: Partial<TopicProgress>) => {
      setProgress((prev) => ({
        ...prev,
        [topicId]: { ...defaultProgress, ...prev[topicId], ...updates },
      }));
    },
    []
  );

  const markRead = useCallback(
    (topicId: string) => updateTopic(topicId, { read: true }),
    [updateTopic]
  );

  const markQuizPassed = useCallback(
    (topicId: string) => updateTopic(topicId, { quizPassed: true }),
    [updateTopic]
  );

  const markTerminalCompleted = useCallback(
    (topicId: string) => updateTopic(topicId, { terminalCompleted: true }),
    [updateTopic]
  );

  const isTopicComplete = useCallback(
    (topicId: string) => {
      const tp = getTopicProgress(topicId);
      return tp.read;
    },
    [getTopicProgress]
  );

  const getCompletionPercent = useCallback(() => {
    const topicIds = [
      "tema-1", "tema-2", "tema-3",
      "tema-5", "tema-6", "tema-7", "tema-8",
    ];
    const completed = topicIds.filter((id) => isTopicComplete(id)).length;
    return Math.round((completed / topicIds.length) * 100);
  }, [isTopicComplete]);

  const resetProgress = useCallback(() => {
    setProgress({});
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Silently fail
    }
  }, []);

  // Don't render children until hydrated to avoid mismatches
  if (!hydrated) {
    return null;
  }

  return (
    <ProgressContext.Provider
      value={{
        progress,
        markRead,
        markQuizPassed,
        markTerminalCompleted,
        isTopicComplete,
        getCompletionPercent,
        resetProgress,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

/* ── Hook ── */
export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("useProgress must be used within a ProgressProvider");
  }
  return context;
}

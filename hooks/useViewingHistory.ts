import { useState, useCallback, useEffect } from "react";
import { Post } from "./usePosts";

export type HistoryItem = {
  postId: number;
  title: string;
  image?: string;
  viewedAt: string;
};

const STORAGE_KEY = "viewing_history";
const MAX_ITEMS = 50;

const loadHistory = (): HistoryItem[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveHistory = (items: HistoryItem[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // localStorage full or unavailable
  }
};

export const useViewingHistory = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // クライアントサイドでのみlocalStorageから読み込み
  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const addToHistory = useCallback((post: Post) => {
    if (!post.id) return;

    setHistory((prev) => {
      const filtered = prev.filter((item) => item.postId !== post.id);
      const newItem: HistoryItem = {
        postId: post.id!,
        title: post.title,
        image: post.images?.[0],
        viewedAt: new Date().toISOString(),
      };
      const updated = [newItem, ...filtered].slice(0, MAX_ITEMS);
      saveHistory(updated);
      return updated;
    });
  }, []);

  const removeFromHistory = useCallback((postId: number) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.postId !== postId);
      saveHistory(updated);
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    saveHistory([]);
  }, []);

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
  };
};

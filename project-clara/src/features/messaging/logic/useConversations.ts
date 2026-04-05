/**
 * useConversations — fetches and manages the conversation list
 * for either a parent or teacher user.
 *
 * Exposes loadConversations() so screens can call it on mount
 * and again on pull-to-refresh.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Conversation,
  fetchConversationsByParent,
  fetchConversationsByTeacher,
} from "../api/messageRepo";

interface UseConversationsReturn {
  conversations: Conversation[];
  isLoading: boolean;
  error: string | null;
  loadConversations: () => Promise<void>;
}

export function useConversations(
  role: "parent" | "teacher",
  userId: string
): UseConversationsReturn {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // prevent state updates after unmount
  const isMounted = useRef(true);
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const loadConversations = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    setError(null);

    const result =
      role === "parent"
        ? await fetchConversationsByParent(userId)
        : await fetchConversationsByTeacher(userId);

    if (!isMounted.current) return;

    if (result.error) {
      setError(result.error);
    } else {
      setConversations(
        (result.data ?? []).map((c) => ({
        ...c,
        unreadCount: Math.floor(Math.random() * 5),
      }))
     );
    }
    setIsLoading(false);
  }, [role, userId]);

  // fetch on mount
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  return { conversations, isLoading, error, loadConversations };
}

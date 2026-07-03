// hooks/useMessage.ts
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/axios";
import useMessageStore from "../store/messagesStore";
import type { MessageType } from "../types/message.types";

export const getMessages = (contactId: number, threadId: number) => {
  const { messages, setMessages, isExpired } = useMessageStore();
  const cache = messages[`${contactId}-${threadId}`];

  return useQuery({
    queryKey: ["getMessages", contactId, threadId],
    queryFn: async (): Promise<MessageType[]> => {
      if (!isExpired(contactId, threadId) && cache?.messages)
        return cache.messages;
      const res = await api
        .get(`/contacts/${contactId}/threads/${threadId}/messages`)
        .then((value) => value.data.data);
      if (Array.isArray(res)) {
        setMessages(contactId, threadId, res);
        return res;
      }
      setMessages(contactId, threadId, []);
      return [];
    },
    enabled: !!contactId && !!threadId,
    retry: false,
    refetchOnWindowFocus: false,
  });
};

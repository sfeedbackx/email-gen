import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/axios';
import useMessageStore from '../store/messagesStore';
import type { MessageType } from '../types/message.types';

export const getMessages = (contactId: number, threadId: number) => {
  const { messages, setMessages, isExpired } = useMessageStore();
  const cache = messages[`${contactId}-${threadId}`];

  return useQuery({
    queryKey: ['getMessages', contactId, threadId],
    queryFn: async (): Promise<MessageType[]> => {
      if (!isExpired(contactId, threadId) && cache?.messages) return cache.messages;
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

export const usePostMessage = (contactId: number, threadId: number | undefined) => {
  const { appendMessage } = useMessageStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { role: 'ME' | 'CONTACT'; content: string }) => {
      if (!contactId || !threadId)
        return Promise.reject(new Error('Missing contactId or threadId'));
      return api
        .post(`/contacts/${contactId}/threads/${threadId}/messages`, data)
        .then((res) => res.data.data);
    },
    onSuccess: (res) => {
      appendMessage(contactId, threadId!, res);
      queryClient.setQueryData<MessageType[]>(['getMessages', contactId, threadId], (prev = []) => [
        ...prev,
        res,
      ]);
    },
  });
};

export const useDeleteMessage = (contactId: number, threadId: number | undefined) => {
  const { removeMessage } = useMessageStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageId: number) => {
      if (!contactId || !threadId)
        return Promise.reject(new Error('Missing contactId or threadId'));
      return api
        .delete(`/contacts/${contactId}/threads/${threadId}/messages/${messageId}`)
        .then((res) => res.data);
    },
    onSuccess: (_, messageId) => {
      removeMessage(contactId, threadId!, messageId);
      queryClient.setQueryData<MessageType[]>(['getMessages', contactId, threadId], (prev = []) =>
        prev.filter((message) => message.id !== messageId),
      );
    },
  });
};

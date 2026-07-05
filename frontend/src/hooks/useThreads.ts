import { useMutation, useQuery } from '@tanstack/react-query';
import { useThreadIdContext } from '../context/ThreadContext';
import { api } from '../lib/axios';
import type { AddThreadForm } from '../pages/threads/components/ThreadForm';
import useThreadStore from '../store/threadsStore';
import type { Thread } from '../types/thread.types';

const mapThread = (val: Thread): Thread => ({
  id: val.id,
  contactId: val.contactId,
  createdAt: val.createdAt,
  updatedAt: val.updatedAt,
  subject: val.subject,
});

export const getThreads = (contactId: number) => {
  const { threads, setThreads, isExpired, cachedContactId } = useThreadStore();
  return useQuery({
    queryKey: ['getThreads', contactId],
    queryFn: async (): Promise<Thread[]> => {
      if (!isExpired() && threads && cachedContactId === contactId) return threads.t;
      const res = await api.get(`contacts/${contactId}/threads`).then((value) => value.data.data);
      if (Array.isArray(res)) {
        const mappedThreads = res.map((r) => mapThread(r));
        setThreads(mappedThreads, contactId);
        return mappedThreads;
      }
      setThreads([], contactId);
      return [];
    },
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const getThreadById = (contactId: number, threadId: number, enabled = true) => {
  return useQuery({
    queryKey: ['getThreadById', contactId, threadId],
    queryFn: async (): Promise<Thread> =>
      api.get(`/contacts/${contactId}/threads/${threadId}`).then((value) => value.data.data),
    enabled: enabled && !!contactId && !!threadId,
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const deleteThread = (contactId: number) => {
  const { removeThread } = useThreadStore();
  return useMutation({
    mutationFn: (threadId: number) =>
      api.delete(`/contacts/${contactId}/threads/${threadId}`).then((res) => res.data),
    onSuccess: (_, threadId) => {
      removeThread(threadId);
    },
  });
};

export const patchThread = (contactId: number) => {
  const { setSelectedThread } = useThreadStore();
  return useMutation({
    mutationFn: ({ threadId, data }: { threadId: number; data: Partial<AddThreadForm> }) =>
      api.patch(`/contacts/${contactId}/threads/${threadId}`, data).then((res) => res.data.data),
    onSuccess: (res) => {
      setSelectedThread(res);
    },
  });
};

export const useAddThread = (contactId: number, setSelectedThread: (thread: Thread) => void) => {
  const { addThread } = useThreadStore();
  const { setThreadId } = useThreadIdContext();

  return useMutation({
    mutationFn: async (data: AddThreadForm) => {
      if (!contactId) return Promise.reject(new Error('Missing contactId or threadId'));
      return api.post(`/contacts/${contactId}/threads`, data).then((res) => res.data.data);
    },
    onSuccess: (res) => {
      const mapped = mapThread(res);
      setSelectedThread(mapped);
      addThread(mapped);
      setThreadId(mapped.id);
    },
  });
};

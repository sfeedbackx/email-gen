import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/axios';
import type { DraftContentUpdate, Prompt } from '../schemas/message.schema';
import useDraftStore from '../store/draftsStore';
import useMessageStore from '../store/messagesStore';
import type { Draft } from '../types/draft.types';
import type { MessageType } from '../types/message.types';

export const getDrafts = (contactId: number, threadId: number) => {
  const { drafts, setDrafts, isExpired } = useDraftStore();
  const cache = drafts[`${contactId}-${threadId}`];

  return useQuery({
    queryKey: ['getDrafts', contactId, threadId],
    queryFn: async (): Promise<Draft[]> => {
      if (!isExpired(contactId, threadId) && cache?.data) return cache.data;
      const res = await api
        .get(`/contacts/${contactId}/threads/${threadId}/drafts`)
        .then((value) => value.data.data);
      if (Array.isArray(res)) {
        setDrafts(contactId, threadId, res);
        return res;
      }
      setDrafts(contactId, threadId, []);
      return [];
    },
    enabled: !!contactId && !!threadId,
    retry: false,
    refetchOnWindowFocus: false,
  });
};
export const deleteDraft = (contactId: number, threadId: number | undefined) => {
  const { removeDraft } = useDraftStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (draftId: number) =>
      api
        .delete(`/contacts/${contactId}/threads/${threadId}/drafts/${draftId}`)
        .then((res) => res.data),
    onSuccess: (_, draftId) => {
      if (threadId) {
        removeDraft(contactId, threadId, draftId);
        queryClient.setQueryData<Draft[]>(['getDrafts', contactId, threadId], (prev = []) =>
          prev.filter((draft) => draft.id !== draftId),
        );
      }
    },
  });
};

export const useGenDraft = (contactId: number, threadId: number | undefined) => {
  const { appendDraft } = useDraftStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Prompt) => {
      if (!contactId || !threadId)
        return Promise.reject(new Error('Missing contactId or threadId'));
      return api
        .post(`/contacts/${contactId}/threads/${threadId}/drafts/generate`, data)
        .then((res) => res.data.data);
    },
    onSuccess: (res) => {
      appendDraft(contactId, threadId!, res);
      queryClient.setQueryData<Draft[]>(['getDrafts', contactId, threadId], (prev = []) => [
        ...prev,
        res,
      ]);
    },
  });
};
export const usePatchDraft = (contactId: number, threadId: number | undefined, draftId: number) => {
  const { upsertDraft } = useDraftStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: DraftContentUpdate) => {
      if (!contactId || !threadId || !draftId)
        return Promise.reject(new Error('Missing contactId, threadId, or draftId'));
      return api
        .patch(`/contacts/${contactId}/threads/${threadId}/drafts/${draftId}`, data)
        .then((res) => res.data.data);
    },
    onSuccess: (res) => {
      upsertDraft(contactId, threadId!, res);
      queryClient.setQueryData<Draft[]>(['getDrafts', contactId, threadId], (prev = []) => {
        const exists = prev.some((draft) => draft.id === res.id);
        if (exists) {
          return prev.map((draft) => (draft.id === res.id ? res : draft));
        }
        return [...prev, res];
      });
    },
  });
};

export const usePromoteDraft = (contactId: number, threadId: number | undefined) => {
  const { removeDraft } = useDraftStore();
  const { appendMessage } = useMessageStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (draftId: number): Promise<MessageType> => {
      if (!contactId || !threadId)
        return Promise.reject(new Error('Missing contactId or threadId'));
      return api
        .post(`/contacts/${contactId}/threads/${threadId}/drafts/${draftId}/promote`)
        .then((res) => res.data.data);
    },
    onSuccess: (res, draftId) => {
      removeDraft(contactId, threadId!, draftId);
      appendMessage(contactId, threadId!, res);
      queryClient.setQueryData<Draft[]>(['getDrafts', contactId, threadId], (prev = []) =>
        prev.filter((draft) => draft.id !== draftId),
      );
      queryClient.setQueryData<MessageType[]>(['getMessages', contactId, threadId], (prev = []) => [
        ...prev,
        res,
      ]);
    },
  });
};

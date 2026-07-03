import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../lib/axios";
import useDraftStore from "../store/draftsStore";
import type { Draft } from "../types/draft.types";
import type { DraftContentUpdate, Prompt } from "../schemas/message.schema";

export const getDrafts = (contactId: number, threadId: number) => {
  const { drafts, setDrafts, isExpired } = useDraftStore();
  const cache = drafts[`${contactId}-${threadId}`];

  return useQuery({
    queryKey: ["getDrafts", contactId, threadId],
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
export const useGenDraft = (
  setErrors: (errors: string) => void,
  contactId: number,
  threadId: number | undefined,
  setSelectedDraft: (d: Draft | null) => void,
) => {
  const { appendDraft } = useDraftStore();

  return useMutation({
    mutationFn: async (data: Prompt) => {
      if (!contactId || !threadId)
        return Promise.reject(new Error("Missing contactId or threadId"));
      return api
        .post(
          `/contacts/${contactId}/threads/${threadId}/drafts/generate`,
          data,
        )
        .then((res) => res.data.data);
    },
    onSuccess: (res) => {
      setSelectedDraft(res);
      appendDraft(contactId, threadId!, res);
    },
    onError: (error: any) => {
      const issues = error.response?.data?.errors;
      const serverError = error.response?.data?.message;
      if (Array.isArray(issues)) {
        setErrors(issues[0].message);
      } else if (serverError) {
        setErrors(serverError);
      } else {
        setErrors(error.message);
      }
    },
  });
};
export const usePatchDraft = (
  setErrors: (errors: string) => void,
  contactId: number,
  threadId: number | undefined,
  draftId : number,
) => {
  const { appendDraft } = useDraftStore();

  return useMutation({
    mutationFn: async (data: DraftContentUpdate) => {
      if (!contactId || !threadId || !draftId)
        return Promise.reject(new Error("Missing contactId, threadId, or draftId"));
      return api
        .patch(
          `/contacts/${contactId}/threads/${threadId}/drafts/${draftId}`,
          data,
        )
        .then((res) => res.data.data);
    },
    onSuccess: (res) => {
      appendDraft(contactId, threadId!, res);
    },
    onError: (error: any) => {
      const issues = error.response?.data?.errors;
      const serverError = error.response?.data?.message;
      if (Array.isArray(issues)) {
        setErrors(issues[0].message);
      } else if (serverError) {
        setErrors(serverError);
      } else {
        setErrors(error.message);
      }
    },
  });
};

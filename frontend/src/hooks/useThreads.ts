import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../lib/axios";
import type { Thread } from "../types/thread.types";
import useThreadStore from "../store/threadsStore";
import type { AddThreatForm } from "../pages/threads/components/ThreadForm";

const mapContact = (val): Thread => ({
  id: val.id,
  contactId: val.contactId,
  createdAt: val.createdAt,
  updatedAt: val.updatedAt,
  subject: val.subject,
});

export const getThreads = (contactId: number) => {
  const { threads, setThreads, isExpired, cachedContactId } = useThreadStore();
  return useQuery({
    queryKey: ["getThreads"],
    queryFn: async (): Promise<Thread[]> => {
      if (!isExpired() && threads && cachedContactId === contactId)
        return threads.t;
      const res = await api
        .get(`contacts/${contactId}/threads`)
        .then((value) => value.data.data);
      if (Array.isArray(res)) {
        const mappedThreads = res.map((r) => mapContact(r));
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
export const useAddThreat = (
  setErrors: (errors: string) => void,
  contactId: number,
  setServerError: (serverError: string) => void,
  setSelectedThread: (thread: Thread) => void,
  setOpenedThreatForm: (b: boolean) => void,
) => {
  const { addThread } = useThreadStore();

  return useMutation({
    mutationFn: async (data: AddThreatForm) => {
      if (!contactId)
        return Promise.reject(new Error("Missing contactId or threadId"));
      return api
        .post(`/contacts/${contactId}/threads`, data)
        .then((res) => res.data.data);
    },
    onSuccess: (res) => {
      setSelectedThread(res);
      addThread(res);
      setOpenedThreatForm(false);
    },
    onError: (error: any) => {
      const issues = error.response?.data?.errors;
      const serverError = error.response?.data?.message;
      if (Array.isArray(issues)) {
        setErrors(issues[0].message);
      } else if (serverError) {
        setServerError(serverError);
      } else {
        setServerError(error.message);
      }
    },
  });
};

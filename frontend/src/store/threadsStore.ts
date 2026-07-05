import { create } from 'zustand';
import type { Thread } from '../types/thread.types';
import { TTL_MS } from '../utils/constants';

interface ThreadStore {
  threads: { t: Thread[]; lastFetched: number | null };
  selectedThread: { t: Thread | null; lastFetched: number | null };
  cachedContactId: number | null;
  setSelectedThread: (t: Thread) => void;
  lastFetched: number | null;
  setThreads: (thread: Thread[], contactId: number) => void;
  addThread: (thread: Thread) => void;
  removeThread: (threadId: number) => void;
  clearContacts: () => void;
  isExpired: (single?: boolean) => boolean;
}

const useThreadStore = create<ThreadStore>((set, get) => ({
  threads: { t: [], lastFetched: null },
  lastFetched: null,
  cachedContactId: null,
  selectedThread: { t: null, lastFetched: null },
  setThreads: (thread, contactId) =>
    set({
      threads: { t: thread, lastFetched: Date.now() },
      cachedContactId: contactId,
    }),
  setSelectedThread: (thread) => set({ selectedThread: { t: thread, lastFetched: Date.now() } }),
  addThread: (thread) =>
    set((state) => ({
      threads: {
        t: [...state.threads.t, thread],
        lastFetched: state.threads.lastFetched,
      },
    })),
  removeThread: (threadId) =>
    set((state) => ({
      threads: {
        t: state.threads.t.filter((thread) => thread.id !== threadId),
        lastFetched: state.threads.lastFetched,
      },
    })),
  clearContacts: () => set({ threads: { t: [], lastFetched: null } }),
  isExpired: (single?: boolean) => {
    const state = get();
    const lastFetched = single ? state.selectedThread.lastFetched : state.threads.lastFetched;

    if (!lastFetched) return true;
    return Date.now() - lastFetched > TTL_MS;
  },
}));
export default useThreadStore;

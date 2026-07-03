import { create } from "zustand";
import type { Draft } from "../types/draft.types";
import { TTL_MS } from "../utils/constants";
import { makeKey } from "../utils/helpers";

interface ThreadCache {
  data: Draft[];
  lastFetched: number | null;
}

interface DraftStore {
  drafts: Record<string, ThreadCache>;
  setDrafts: (contactId: number, threadId: number, data: Draft[]) => void;
  appendDraft: (contactId: number, threadId: number, draft: Draft) => void;
  isExpired: (contactId: number, threadId: number) => boolean;
  clearDrafts: (contactId: number, threadId: number) => void;
}


const useDraftStore = create<DraftStore>((set, get) => ({
  drafts: {},

  setDrafts: (contactId, threadId, data) => {
    const key = makeKey(contactId, threadId);
    set((state) => ({
      drafts: {
        ...state.drafts,
        [key]: { data, lastFetched: Date.now() },
      },
    }));
    const temp = get();
    console.log(temp.drafts);
  },
  appendDraft: (contactId, threadId, draft) => {
    const key = makeKey(contactId, threadId);
    set((state) => ({
      drafts: {
        ...state.drafts,
        [key]: {
          data: [...(state.drafts[key]?.data ?? []), draft],
          lastFetched: Date.now(),
        },
      },
    }));
  },
  isExpired: (contactId, threadId) => {
    const key = makeKey(contactId, threadId);
    const cache = get().drafts[key];
    if (!cache?.lastFetched) return true;
    return Date.now() - cache.lastFetched > TTL_MS;
  },

  clearDrafts: (contactId, threadId) => {
    const key = makeKey(contactId, threadId);
    set((state) => ({
      drafts: {
        ...state.drafts,
        [key]: { data: [], lastFetched: null },
      },
    }));
  },
}));

export default useDraftStore;

import { create } from 'zustand';
import type { Draft } from '../types/draft.types';
import { TTL_MS } from '../utils/constants';
import { makeKey } from '../utils/helpers';

interface ThreadCache {
  data: Draft[];
  lastFetched: number | null;
}

interface DraftStore {
  drafts: Record<string, ThreadCache>;
  setDrafts: (contactId: number, threadId: number, data: Draft[]) => void;
  appendDraft: (contactId: number, threadId: number, draft: Draft) => void;
  upsertDraft: (contactId: number, threadId: number, draft: Draft) => void;
  removeDraft: (contactId: number, threadId: number, draftId: number) => void;
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
  upsertDraft: (contactId, threadId, draft) => {
    const key = makeKey(contactId, threadId);
    set((state) => {
      const previous = state.drafts[key]?.data ?? [];
      const existingIndex = previous.findIndex((value) => value.id === draft.id);
      const next =
        existingIndex >= 0
          ? previous.map((value) => (value.id === draft.id ? draft : value))
          : [...previous, draft];

      return {
        drafts: {
          ...state.drafts,
          [key]: {
            data: next,
            lastFetched: Date.now(),
          },
        },
      };
    });
  },
  removeDraft: (contactId, threadId, draftId) => {
    const key = makeKey(contactId, threadId);
    set((state) => ({
      drafts: {
        ...state.drafts,
        [key]: {
          data: (state.drafts[key]?.data ?? []).filter((draft) => draft.id !== draftId),
          lastFetched: state.drafts[key]?.lastFetched ?? null,
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

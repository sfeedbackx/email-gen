// store/message.store.ts
import { create } from 'zustand';
import type { MessageType } from '../types/message.types';
import { TTL_MS } from '../utils/constants';
import { makeKey } from '../utils/helpers';

export interface MessagesCache {
  messages: MessageType[];
  lastFetched: number | null;
}

interface MessageStore {
  messages: Record<string, MessagesCache>;
  setMessages: (contactId: number, threadId: number, data: MessageType[]) => void;
  appendMessage: (contactId: number, threadId: number, message: MessageType) => void;
  removeMessage: (contactId: number, threadId: number, messageId: number) => void;
  isExpired: (contactId: number, threadId: number) => boolean;
}

const useMessageStore = create<MessageStore>((set, get) => ({
  messages: {},

  setMessages: (contactId, threadId, data) => {
    const key = makeKey(contactId, threadId);
    set((state) => ({
      messages: {
        ...state.messages,
        [key]: { messages: data, lastFetched: Date.now() },
      },
    }));
  },

  appendMessage: (contactId, threadId, message) => {
    const key = makeKey(contactId, threadId);
    set((state) => ({
      messages: {
        ...state.messages,
        [key]: {
          messages: [...(state.messages[key]?.messages ?? []), message],
          lastFetched: Date.now(),
        },
      },
    }));
  },
  removeMessage: (contactId, threadId, messageId) => {
    const key = makeKey(contactId, threadId);
    set((state) => ({
      messages: {
        ...state.messages,
        [key]: {
          messages: (state.messages[key]?.messages ?? []).filter(
            (message) => message.id !== messageId,
          ),
          lastFetched: state.messages[key]?.lastFetched ?? null,
        },
      },
    }));
  },
  isExpired: (contactId, threadId) => {
    const key = makeKey(contactId, threadId);
    const cache = get().messages[key];
    if (!cache?.lastFetched) return true;
    return Date.now() - cache.lastFetched > TTL_MS;
  },
}));

export default useMessageStore;

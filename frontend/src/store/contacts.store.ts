import { create } from 'zustand'
import type { Contact } from '../types/contact.type'
import { TTL_MS } from '../utils/constants'


interface ContactStore {
  contacts: { c: Contact[], lastFetched: number | null },
  selectedContact: { c: Contact | null, lastFetched: number | null }
  setSelectedContact: (c: Contact) => void
  lastFetched: number | null
  setContacts: (contacts: Contact[]) => void
  addContact: (contact: Contact) => void
  clearContacts: () => void
  isExpired: (single?: boolean) => boolean
}

const useContactStore = create<ContactStore>((set, get) => ({
  contacts: { c: [], lastFetched: null },
  lastFetched: null,
  selectedContact: { c: null, lastFetched: null },
  setContacts: (contacts) => set({ contacts: { c: contacts, lastFetched: Date.now() } }),
  setSelectedContact: (contact) => set({ selectedContact: { c: contact, lastFetched: Date.now() } }),
  addContact: (contact) => set((state) => ({
    contacts: { c: [...state.contacts.c, contact], lastFetched: state.contacts.lastFetched }
  })),
  clearContacts: () => set({ contacts: { c: [], lastFetched: null } }),
  isExpired: (single?: boolean) => {
    const state = get() // ← correct way to read state
    const lastFetched = single
      ? state.selectedContact.lastFetched
      : state.contacts.lastFetched

    if (!lastFetched) return true
    return Date.now() - lastFetched > TTL_MS
  }
}))

export default useContactStore

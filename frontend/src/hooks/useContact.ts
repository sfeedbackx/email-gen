import { useQuery } from "@tanstack/react-query"
import { api } from "../lib/axios"
import type { Contact } from "../types/contact.type"
import useContactStore from "../store/contacts.store"

const mapContact = (val): Contact => ({
  id: val.id,
  context: val.context,
  createdAt: val.createdAt,
  email: val.email,
  language: val.language,
  name: val.name,
  updatedAt: val.updatedAt,
  userId: val.userId
})

export const getContact = () => {
  const { contacts, setContacts, isExpired } = useContactStore()
  return useQuery({
    queryKey: ['getContact'],
    queryFn: async (): Promise<Contact[]> => {
      if (!isExpired() && contacts) return contacts.c

      const res = await api.get('/contacts').then(value => value.data.data)
      if (Array.isArray(res)) {
        const mappedContacts = res.map(r => mapContact(r))
        setContacts(mappedContacts)
        return mappedContacts
      }
      setContacts([])
      return []
    },
    retry: false,
    refetchOnWindowFocus: false,
  })
}
export const getContactById = (id: number , enabled = true) => {
  const { selectedContact, setSelectedContact, isExpired } = useContactStore()
  return useQuery({
    queryKey: ['getContactById'],
    queryFn: async (): Promise<Contact> => {
      if (!isExpired(true) && selectedContact?.c) return selectedContact.c

      const res = await api.get(`/contacts/${id}`).then(value => value.data.data)
      setSelectedContact(res)
      return res
    },
    enabled,
    retry: false,
    refetchOnWindowFocus: false,
  })
}


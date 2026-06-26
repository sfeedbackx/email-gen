import { useQuery } from "@tanstack/react-query"
import { api } from "../lib/axios"
import useContactStore from "../store/contacts.store"
import { Thread } from "../types/threadsType"

const mapContact = (val): Thread => ({
  id: val.id,
  contactId: val.contactId,
  createdAt: val.createdAt,
  updatedAt: val.updatedAt,
  subject: val.subject
})

export const getContact = () => {
  const { contacts, setContacts, isExpired } = useContactStore()
  return useQuery({
    queryKey: ['getContact'],
    queryFn: async (): Promise<Contact[]> => {
      if (!isExpired() && contacts) return contacts
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

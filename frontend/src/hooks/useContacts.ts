import type { Contact } from '@appTypes/contact.types';
import { api } from '@lib/axios';
import type { ContactForm } from '@schemas/contact.schema';
import useContactStore from '@store/contactsStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ROUTES } from '@utils/constants';
import { useNavigate } from 'react-router-dom';

const mapContact = (val: Contact): Contact => ({
  id: val.id,
  context: val.context,
  createdAt: val.createdAt,
  email: val.email,
  language: val.language,
  name: val.name,
  updatedAt: val.updatedAt,
  userId: val.userId,
});

export const getContact = () => {
  const { contacts, setContacts, isExpired } = useContactStore();

  return useQuery({
    queryKey: ['getContact'],
    queryFn: async (): Promise<Contact[]> => {
      if (!isExpired() && contacts) return contacts.c;
      const res = await api.get('/contacts').then((value) => value.data.data);

      if (Array.isArray(res)) {
        const mappedContacts = res.map((r) => mapContact(r));
        setContacts(mappedContacts);
        return mappedContacts;
      }

      setContacts([]);

      return [];
    },

    retry: false,

    refetchOnWindowFocus: false,
  });
};

export const getContactById = (id: number, enabled = true) => {
  const { selectedContact, setSelectedContact, isExpired } = useContactStore();

  return useQuery({
    queryKey: ['getContactById', id],

    queryFn: async (): Promise<Contact> => {
      if (!isExpired(true) && selectedContact?.c) return selectedContact.c;

      const res = await api.get(`/contacts/${id}`).then((value) => value.data.data);

      setSelectedContact(res);

      return res;
    },

    enabled,

    retry: false,

    refetchOnWindowFocus: false,
  });
};

export const deleteContact = () => {
  const { removeContact } = useContactStore();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => api.delete(`/contacts/${id}`).then((res) => res.data),

    onSuccess: (_, contactId) => {
      removeContact(contactId);

      queryClient.setQueryData<Contact[]>(['getContact'], (prev = []) =>
        prev.filter((contact) => contact.id !== contactId),
      );
    },
  });
};

export const postContact = () => {
  const navigate = useNavigate();

  const { addContact } = useContactStore();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ContactForm) => api.post('/contacts', data).then((res) => res.data),

    onSuccess: (res) => {
      const createdContact = mapContact(res.data);
      addContact(createdContact);
      queryClient.setQueryData<Contact[]>(['getContact'], (prev = []) => [...prev, createdContact]);
      navigate(`${ROUTES.MESSAGE}/${createdContact.id}`);
    },
  });
};

export const patchContact = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ContactForm> }) =>
      api.patch(`/contacts/${id}`, data).then((res) => res.data.data),
  });
};

import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../lib/axios";
import type { Contact } from "../types/contact.types";
import useContactStore from "../store/contactsStore";
import { mapZodIssues } from "../utils/helpers";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../utils/constants";
import type { ContactForm } from "../schemas/contact.schema";

const mapContact = (val): Contact => ({
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
    queryKey: ["getContact"],
    queryFn: async (): Promise<Contact[]> => {
      if (!isExpired() && contacts) return contacts.c;

      const res = await api.get("/contacts").then((value) => value.data.data);
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
    queryKey: ["getContactById"],
    queryFn: async (): Promise<Contact> => {
      if (!isExpired(true) && selectedContact?.c) return selectedContact.c;

      const res = await api
        .get(`/contacts/${id}`)
        .then((value) => value.data.data);
      setSelectedContact(res);
      return res;
    },
    enabled,
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const postContact = (
  setErrors: (errors: Record<string, string>) => void,
  setServerError: (message: string) => void,
) => {
  const navigate = useNavigate();
  const { addContact } = useContactStore();
  return useMutation({
    mutationFn: (data: ContactForm) =>
      api.post("/contacts", data).then((res) => res.data),
    onSuccess: (res) => {
      const createdContact = mapContact(res.data);
      addContact(createdContact);
      navigate(`${ROUTES.MESSAGE}/${createdContact.id}`);
    },
    onError: (error: any) => {
      const issues = error.response?.data?.errors;
      const serverError = error.response?.data?.message;
      if (Array.isArray(issues)) {
        const fieldErrors: Record<string, string> = mapZodIssues(issues);
        setErrors(fieldErrors);
      } else {
        setServerError(serverError);
      }
    },
  });
};

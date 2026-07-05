import { Button, Divider, Text, TextInput } from '@mantine/core';
import React, { useEffect, useRef, useState } from 'react';
import { CiSearch } from 'react-icons/ci';
import { RiDeleteBinLine } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import { SideBar } from '../../components/SideBar';
import { deleteContact, getContact } from '../../hooks/useContacts';
import { ROUTES } from '../../utils/constants';
import { extractApiError, formatDate, getErrorMessage } from '../../utils/helpers';
import ContactFormModal from './components/ContactFormModal';

export const Contacts = () => {
  const { data, isLoading, isError, error } = getContact();

  const [searchedContacts, setSearchedContacts] = useState(data);
  const [serverError, setServerError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { mutate: removeContact } = deleteContact();

  const [opened, setOpened] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!opened) return; // no need to listen when modal isn't open

    const handler = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.closest('.mantine-Select-dropdown, .mantine-Popover-dropdown, [data-portal]')) {
        return;
      }
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpened(false);
      }
    };

    document.addEventListener('mousedown', handler);

    return () => document.removeEventListener('mousedown', handler);
  }, [opened]);

  useEffect(() => {
    if (data) {
      setSearchedContacts(data);
    }
  }, [data]);
  useEffect(() => {
    if (!isError) return;
    const { serverError } = extractApiError(error);
    setServerError(serverError ?? 'Failed to delete');
  }, [isError, error]);

  const handleChange = (s: string) => {
    if (s.trim().length < 3) {
      setSearchedContacts(data);
      return;
    }
    const regex: RegExp = new RegExp(`${s.trim()}`, 'i');
    setSearchedContacts(data?.filter((v) => regex.test(v.name)));
  };

  return (
    <>
      <SideBar />
      <div className="flex w-screen h-screen relative  justify-center select-none">
        <div className="flex flex-col w-3xl p-6">
          <div className="flex flex-row w-full items-center justify-between mb-4">
            {serverError && (
              <Text c="red" size="sm" ta="center" mt="sm">
                {serverError}
              </Text>
            )}
            <div className="">
              <div className="text-sm font-bold mb-0.5">Contacts</div>
            </div>
            <div className=" ">
              <Button size="sm" onClick={() => setOpened(true)}>
                Add new Contact
              </Button>
            </div>
          </div>
          <TextInput
            placeholder="Search contacts..."
            className="w-full"
            onChange={(e) => handleChange(e.target.value)}
            leftSection={<CiSearch className="w-4 h-4" />}
          />
          <div className="flex flex-col relative  w-full mt-4 overflow-auto h-full">
            {opened && <ContactFormModal ref={ref} />}

            {isLoading && (
              <div className="flex flex-col gap-3 p-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={`skel-${i}`} className="animate-pulse h-8 bg-gray-200 rounded" />
                ))}
              </div>
            )}

            {isError && (
              <Text c="red" size="sm" ta="center" mt="sm">
                {getErrorMessage(error, 'Failed to load contacts')}
              </Text>
            )}

            {searchedContacts?.map((contact, i) => (
              <React.Fragment key={`contact-${contact.id}`}>
                <div
                  className="group flex items-center px-2 py-2 rounded-lg
                  hover:bg-blue-50 transition-all duration-150"
                >
                  <Link
                    className="flex items-center flex-1 text-black hover:text-blue-500"
                    to={`${ROUTES.MESSAGE}/${contact.id}`}
                  >
                    <div className="flex justify-between items-center flex-row w-full">
                      <div>{contact.name}</div>
                      <div className="text-gray-500">{formatDate(contact.updatedAt)}</div>
                    </div>
                  </Link>
                  <button
                    className="ml-2 inline-flex items-center justify-center text-red-500 hover:text-red-700
                      text-xs p-2 rounded hover:bg-red-50 transition-all"
                    onClick={() => {
                      setDeletingId(contact.id);
                      removeContact(contact.id, {
                        onSuccess: () => {
                          setSearchedContacts((prev) =>
                            prev?.filter((value) => value.id !== contact.id),
                          );
                          setDeletingId(null);
                        },
                        onError: () => setDeletingId(null),
                      });
                    }}
                    disabled={deletingId === contact.id}
                    aria-label={`Delete ${contact.name}`}
                    title={`Delete ${contact.name}`}
                  >
                    {deletingId === contact.id ? '...' : <RiDeleteBinLine className="w-4 h-4" />}
                  </button>
                </div>
                {i < searchedContacts.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

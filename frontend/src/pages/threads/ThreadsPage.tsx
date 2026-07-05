import { Button, Divider, Text, TextInput } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { CiSearch } from 'react-icons/ci';
import { Link } from 'react-router-dom';
import { SideBar } from '../../components/SideBar';
import { getContact } from '../../hooks/useContacts';
import type { Contact } from '../../types/contact.types';
import { ROUTES } from '../../utils/constants';
import { formatDate, getErrorMessage } from '../../utils/helpers';

export const Threads = () => {
  const { data, isLoading, isError, error } = getContact();
  const [searched, setSearched] = useState<Contact[]>([]);

  useEffect(() => {
    if (data) setSearched(data);
  }, [data]);

  const handleSearch = (s: string) => {
    if (s.trim().length < 3 || !data) {
      setSearched(data ?? []);
      return;
    }
    const regex = new RegExp(s.trim(), 'i');
    setSearched(data.filter((v) => regex.test(v.name)));
  };

  return (
    <>
      <SideBar />
      <div className="flex w-screen h-screen justify-center select-none">
        <div className="flex flex-col w-3xl p-6">
          <div className="flex flex-row w-full items-center justify-between mb-4">
            <div className="text-sm font-bold mb-0.5">Contacts</div>
            <div>
              <Button size="sm" component={Link} to={ROUTES.CONTACTS}>
                Manage Contacts
              </Button>
            </div>
          </div>
          <TextInput
            placeholder="Search contacts..."
            className="w-full"
            onChange={(e) => handleSearch(e.target.value)}
            leftSection={<CiSearch className="w-4 h-4" />}
          />
          <div className="flex flex-col w-full mt-4 overflow-auto h-full">
            {isLoading && (
              <div className="flex flex-col gap-3 p-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={`threads-contact-skel-${i}`}
                    className="animate-pulse h-8 bg-gray-200 rounded"
                  />
                ))}
              </div>
            )}
            {isError && (
              <Text c="red" size="sm" ta="center" mt="sm">
                {getErrorMessage(error, 'Failed to load contacts')}
              </Text>
            )}
            {searched?.map((contact, i) => (
              <React.Fragment key={`contact-${contact.id}`}>
                <Link
                  className="flex items-center px-2 py-2 rounded-lg 
                    cursor-pointer text-black hover:text-blue-500
                    hover:bg-blue-50 active:bg-blue-100 transition-all duration-150"
                  to={`${ROUTES.MESSAGE}/${contact.id}`}
                >
                  <div className="flex justify-between items-center flex-row w-full">
                    <div>{contact.name}</div>
                    <div className="text-gray-500">{formatDate(contact.updatedAt)}</div>
                  </div>
                </Link>
                {i < searched.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

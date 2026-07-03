import { Button, Divider, TextInput } from "@mantine/core";
import { CiSearch } from "react-icons/ci";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getContact } from "../../hooks/useContacts";
import { formatDate } from "../../utils/helpers";
import { ROUTES } from "../../utils/constants";
import ContactFormModal from "./components/ContactFormModal";
import { SideBar } from "../../components/SideBar";

export const Contacts = () => {

  //getContact api call
  const { data } = getContact();

  const [searchedContacts, setSearchedContacts] = useState(data);

  //const { setSelectedContact } = useContactStore();


  const [opened, setOpened] = useState(false); // for form contact to pop the  menu

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (ref.current?.contains(target)) return;

      if (target.closest(".mantine-Select-dropdown")) return;

      setOpened(false);
    };

    document.addEventListener("mousedown", handler);

    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (data) {
      setSearchedContacts(data);
    }
  }, [data]);

  const handleChange = (s: string) => {
    if (s.trim().length < 3) {
      setSearchedContacts(data);
      return;
    }
    const regex: RegExp = new RegExp(`${s.trim()}`, "i");
    setSearchedContacts(data?.filter((v) => regex.test(v.name)));
  };

  return (
    <>
      <SideBar />
      <div className='flex w-screen h-screen relative  justify-center select-none'>
        <div className='flex flex-col w-3xl p-6'>
          <div className='flex flex-row w-full items-center justify-between mb-4'>
            <div className=''>
              <div className='text-sm font-bold mb-0.5'>Input label</div>
            </div>
            <div className=' '>
              <Button size='sm' onClick={() => setOpened(true)}>
                Add new Contact
              </Button>
            </div>
          </div>
          <TextInput
            placeholder='Input placeholder'
            className='w-full'
            onChange={(e) => handleChange(e.target.value)}
            leftSection={<CiSearch className='w-4 h-4' />}
          />
          <div className='flex flex-col relative  w-full mt-4 overflow-auto h-full'>
            {opened && <ContactFormModal ref={ref} />}

            {searchedContacts?.map((contact, i) => (
              <React.Fragment key={`contact-${contact.id}`}>
                <Link
                  className='flex items-center px-2 py-2 rounded-lg 
                  cursor-pointer text-black hover:text-blue-500
                  hover:bg-blue-50 active:bg-blue-100 transition-all duration-150'
                  to={`${ROUTES.MESSAGE}/${contact.id}`}
                >
                  <div className='flex justify-between items-center flex-row w-full'>
                    <div>{contact.name}</div>
                    <div className='text-gray-500'>
                      {formatDate(contact.updatedAt)}
                    </div>
                  </div>
                </Link>
                {i < searchedContacts.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

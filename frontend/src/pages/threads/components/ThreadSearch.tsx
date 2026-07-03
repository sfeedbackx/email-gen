import { Divider, TextInput } from "@mantine/core";
import { CiSearch } from "react-icons/ci";
import { FiPlusCircle } from "react-icons/fi";
import React, { useEffect, useRef, useState } from "react";
import ThreadsForm from "./ThreadForm";
import type { Thread } from "../../../types/thread.types";
import useThreadStore from "../../../store/threadsStore";
import { useThreadIdContext } from "../../../context/ThreadContext";

export const ThreadsSearch = (props: {
  selectedThread: Thread | null;
  threads?: Thread[];
  contactId: number;
  setSelectedThread: (selectedThread: Thread) => void;
}) => {
  const { threads } = useThreadStore();
  const {threadId ,setThreadId } = useThreadIdContext()
  const [searchedThreads, setSearchedThreads] = useState(threads.t);
  const ref = useRef<HTMLDivElement>(null);
  const [openedThreatForm, setOpenedThreatForm] = useState<boolean>(false);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (ref.current?.contains(target)) return;

      setOpenedThreatForm(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleChange = (s: string) => {
    if (s.trim().length < 3) {
      setSearchedThreads(threads.t);
      return;
    }
    const regex: RegExp = new RegExp(`${s.trim()}`, "i");
    setSearchedThreads(threads?.t.filter((v) => regex.test(v.subject)));
  };
  useEffect(() => {
    setSearchedThreads(threads.t);
  }, [threads.t]);

  return (
    <div className=' border-r-2 h-[calc(100%)] p-2 justify-center items-center overflow-auto'>
      <div className='flex flex-row w-full items-center justify-between mb-4'>
        <div className='text-sm font-bold mb-0.5'>Input label</div>
        <FiPlusCircle
          className='w-6 h-6 hover:text-blue-500'
          onClick={() => setOpenedThreatForm(true)}
        ></FiPlusCircle>
      </div>
      {openedThreatForm && (
        <ThreadsForm
          ref={ref}
          setOpenedThreatForm={setOpenedThreatForm}
          setSelectedThread={props.setSelectedThread}
          contactId={props.contactId}
        />
      )}
      <TextInput
        placeholder='Input placeholder'
        className='w-full mb-2'
        onChange={(e) => handleChange(e.target.value)}
        leftSection={<CiSearch className='w-4 h-4' />}
      />
      {!!searchedThreads &&
        searchedThreads?.map((thread, idx) => (
          <React.Fragment key={`threads-${thread.id}`}>
            <div className='flex flex-col w-full mt-1  '>
              <div
                className={`flex items-center gap-3  px-2 py-2  hover:cursor-pointer 
              text-black text-sm\\4 hover:text-blue-500 hover:bg-blue-50 active:bg-blue-100 
              active:scale-95 transition-all duration-150
            ${props.selectedThread && props.selectedThread.id === thread.id ? "text-blue-500 bg-blue-100" : ""} `}
                onClick={() => { props.setSelectedThread(thread); setThreadId(thread.id) }}
              >
                {thread.subject}
              </div>
              {idx < (threads?.t.length ?? 0) - 1 && <Divider />}
            </div>
          </React.Fragment>
        ))}
    </div>
  );
};

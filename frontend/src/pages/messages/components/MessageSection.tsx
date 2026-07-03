import { Textarea } from "@mantine/core";
import { useShallow } from "zustand/react/shallow";
import { useEffect, useState } from "react";
import { IoMdSend } from "react-icons/io";
import { MessagesList } from "./MessageList";
import { getMessages } from "../../../hooks/useMessages";
import { getDrafts, useGenDraft } from "../../../hooks/useDrafts";
import useDraftStore from "../../../store/draftsStore";
import type { Draft } from "../../../types/draft.types";
import { promptSchema, type Prompt, type PromptError } from "../../../schemas/message.schema";
import { useThreadIdContext } from "../../../context/ThreadContext";
import { useContactIdContext } from "../../../context/ContactContext";
import { makeKey } from "../../../utils/helpers";


export const MessagingSection = (props: {
  setIsGenerating: (val: boolean) => void;
  draftOpened: boolean;
  setDraft: (val: boolean) => void;
  selectedDraft: Draft | null;
  setSelectedDraft: (d: Draft | null) => void;
}) => {

  /* stored | context data */
  const { threadId } = useThreadIdContext()
  const contactId = useContactIdContext();
  console.log(contactId);


  /* component var */
  const [input, setInput] = useState<Partial<Prompt>>({});

  const [inputError, setInputError] = useState<PromptError>();

  /* Call Get Messages Api*/

  //get messages
  const { data: messages = [] } = getMessages(
    contactId,
    threadId as number,
  );
  //get drafts
  getDrafts(contactId, threadId as number);

  //post draft
  const { mutate: genDraft, isPending } = useGenDraft(
    setInputError,
    contactId,
    threadId,
    props.setSelectedDraft,
  );

  const [expanded, setExpanded] = useState(messages.map(() => false));

  const key = makeKey(contactId, threadId as number)

  const drafts = useDraftStore(
    useShallow(
      (state) =>
        state.drafts[key]?.data ?? [],
    ),
  );


  const handleChange = (value: string) => {
    setInput(() => ({ prompt: value }));
  };
  const onSubmit = () => {
    const result = promptSchema.safeParse(input);

    if (!result.success) {
      const errorMessage: string = result.error.issues[0].message;
      setInputError(errorMessage);
      return;
    }

    setInputError(undefined);
    console.log(result.data);
    genDraft(result.data);
  };
  const KeyboardHandler = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.shiftKey && e.key === "Enter") {
      e.preventDefault()
      onSubmit()
    }
    if (e.key === "Enter") {
      e.preventDefault();
      console.log("submit");
    }
  };

  useEffect(() => {
    if (messages.length) {
      setExpanded(messages.map(() => false));
    }
  }, [messages]);

  useEffect(() => {
    props.setIsGenerating(isPending);
  }, [isPending]);

  if (!threadId) {
    return (
      <div className='flex flex-col border-r-2 h-full p-2 items-center justify-center w-full'>
        <p className='text-gray-400'>Select a thread to view messages</p>
      </div>
    );
  }
  const toggle = (i: number) =>
    setExpanded((prev) => prev.map((val, idx) => (idx === i ? !val : val)));

  return (
    <div className='flex flex-col border-r-2 h-full p-2  items-center w-full overflow-hidden'>
      {/* Messages area — scrollable */}
      <div className='flex flex-col w-full flex-7 min-h-0 overflow-y-auto p-2 items-end gap-5  '>
        {/* */}
        {messages === null || messages.length === 0 ? (
          <div className='flex flex-col  h-full p-2 items-center justify-center w-full'>
            <p className='text-gray-400'>There no messages</p>
          </div>
        ) : (
          <MessagesList
            messages={messages}
            textAreaInput={input.prompt}
            expanded={expanded}
            drafts={drafts}
            onToggle={toggle}
            draftOpened={props.draftOpened}
            setDraft={props.setDraft}
            selectedDraft={props.selectedDraft}
            setSelectedDraft={props.setSelectedDraft}
          />
        )}
      </div>
      {/* Textarea — pinned to bottom */}
      <div className='w-full  pt-2  p-0'>
        <Textarea
          autosize
          minRows={1}
          maxRows={3}
          placeholder={inputError || "Input placeholder"}
          classNames={{
            input: inputError ? "border-red-500 placeholder:text-red-500" : "",
          }}
          error={false}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDownCapture={(e) => KeyboardHandler(e)}
          rightSection={
            <IoMdSend
              className='w-4 h-4 hover:cursor-pointer text-gray-600 
            hover:text-blue-500 active:scale-95 transition-all duration-150'
              onClick={onSubmit}
            />
          }
          bottomSection={
            <div className='w-full  mb-2 flex flex-row'>
              <div
                className='rounded-sm  border p-1  text-sm/4 text-emerald-500 border-emerald-600 
              cursor-pointer hover:bg-emerald-50 active:scale-95 transition-all duration-150'
              >
                contact
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
};

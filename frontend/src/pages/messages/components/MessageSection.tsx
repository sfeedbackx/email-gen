import { Textarea } from '@mantine/core';
import { useEffect, useState } from 'react';
import { IoMdSend } from 'react-icons/io';
import { useShallow } from 'zustand/react/shallow';
import { useContactIdContext } from '../../../context/ContactContext';
import { useThreadIdContext } from '../../../context/ThreadContext';
import { useGenDraft } from '../../../hooks/useDrafts';
import { getMessages, usePostMessage } from '../../../hooks/useMessages';
import { promptSchema } from '../../../schemas/message.schema';
import useDraftStore from '../../../store/draftsStore';
import type { Draft } from '../../../types/draft.types';
import { extractApiError, getErrorMessage, makeKey } from '../../../utils/helpers';
import { MessagesList } from './MessageList';

export const MessagingSection = (props: {
  setIsGenerating: (val: boolean) => void;
  draftOpened: boolean;
  setDraft: (val: boolean) => void;
  selectedDraft: Draft | null;
  setSelectedDraft: (d: Draft | null) => void;
}) => {
  const { threadId } = useThreadIdContext();
  const contactId = useContactIdContext();

  const [input, setInput] = useState('');
  const [contactMode, setContactMode] = useState(false);

  const [inputError, setInputError] = useState<string>();

  const {
    data: messages = [],
    isLoading: messagesLoading,
    isError: messagesFailed,
    error: messagesError,
  } = getMessages(contactId, threadId as number);

  const {
    mutate: postMessage,
    isPending,
    isError: isPostError,
    error: postError,
  } = usePostMessage(contactId, threadId);

  const {
    mutate: genDraft,
    isPending: isGeneratingDraft,
    isError: isDraftError,
    error: draftError,
  } = useGenDraft(contactId, threadId);

  const [expanded, setExpanded] = useState(messages.map(() => false));

  const key = makeKey(contactId, threadId as number);

  const drafts = useDraftStore(useShallow((state) => state.drafts[key]?.data ?? []));

  const handleChange = (value: string) => setInput(value);

  const onSubmit = () => {
    if (isPending || isGeneratingDraft) return;
    if (!input.trim()) {
      setInputError(contactMode ? 'Message is required' : 'Prompt is required');
      return;
    }

    setInputError(undefined);
    // Toggle decides which backend endpoint we hit:
    // - contactMode: post direct CONTACT message
    // - default: generate AI draft from prompt
    if (contactMode) {
      postMessage(
        { role: 'CONTACT', content: input.trim() },
        {
          onSuccess: () => {
            setInput('');
            setInputError(undefined);
          },
        },
      );
      return;
    }

    const result = promptSchema.safeParse({ prompt: input.trim() });
    if (!result.success) {
      setInputError(result.error.issues[0].message);
      return;
    }

    genDraft(result.data, {
      onSuccess: () => {
        setInput('');
        setInputError(undefined);
      },
    });
  };

  const KeyboardHandler = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Keep Enter as "send", Shift+Enter as newline.
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  useEffect(() => {
    if (messages.length) {
      setExpanded(messages.map(() => false));
    }
  }, [messages]);

  useEffect(() => {
    props.setIsGenerating(isGeneratingDraft);
  }, [isGeneratingDraft, props.setIsGenerating]);

  useEffect(() => {
    if (!isPostError) return;
    const { serverError } = extractApiError(postError);
    setInputError(serverError);
  }, [isPostError, postError]);

  useEffect(() => {
    if (!isDraftError) return;
    const { issues, serverError } = extractApiError(draftError);
    if (Array.isArray(issues)) setInputError(issues[0].message);
    else setInputError(serverError);
  }, [isDraftError, draftError]);

  if (!threadId) {
    return (
      <div className="flex flex-col border-r-2 h-full p-2 items-center justify-center w-full">
        <p className="text-gray-400">Select a thread to view messages</p>
      </div>
    );
  }
  const toggle = (i: number) =>
    setExpanded((prev) => prev.map((val, idx) => (idx === i ? !val : val)));

  return (
    <div className="flex flex-col border-r-2 h-full p-2  items-center w-full overflow-hidden">
      {/* Messages area — scrollable */}
      {/* min-h-0 + overflow-y-auto keeps the top list scrollable, so textarea growth won't push layout upward */}
      <div className="flex flex-col w-full flex-7 min-h-0 overflow-y-auto p-2 items-end gap-5  ">
        {messagesLoading ? (
          <div className="flex flex-col gap-3 p-4 w-full">
            {[1, 2, 3].map((i) => (
              <div key={`msg-sk-${i}`} className="animate-pulse h-12 bg-gray-200 rounded w-3/4" />
            ))}
          </div>
        ) : messagesFailed ? (
          <p className="text-red-500 text-sm">
            {getErrorMessage(messagesError, 'Failed to load messages')}
          </p>
        ) : messages === null || messages.length === 0 ? (
          <div className="flex flex-col  h-full p-2 items-center justify-center w-full">
            <p className="text-gray-400">There no messages</p>
          </div>
        ) : (
          <MessagesList
            messages={messages}
            textAreaInput={input}
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
      <div className="w-full  pt-2  p-0">
        <Textarea
          autosize
          minRows={1}
          maxRows={3}
          placeholder={
            inputError ||
            (contactMode ? 'Paste or type the contact reply...' : 'Describe the email you want...')
          }
          classNames={{
            input: inputError ? 'border-red-500 placeholder:text-red-500' : '',
          }}
          error={false}
          value={input}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDownCapture={(e) => KeyboardHandler(e)}
          disabled={isPending || isGeneratingDraft}
          rightSection={
            <IoMdSend
              className="w-4 h-4 hover:cursor-pointer text-gray-600 
            hover:text-blue-500 active:scale-95 transition-all duration-150"
              onClick={onSubmit}
            />
          }
          bottomSection={
            <div className="w-full  mb-2 flex flex-row">
              <button
                type="button"
                className={`rounded-sm border p-1 text-sm/4 cursor-pointer active:scale-95 transition-all duration-150 ${
                  contactMode
                    ? 'text-emerald-500 border-emerald-600 hover:bg-emerald-50'
                    : 'text-gray-500 border-gray-400 hover:bg-gray-100'
                }`}
                onClick={() => setContactMode((prev) => !prev)}
              >
                contact
              </button>
            </div>
          }
        />
      </div>
    </div>
  );
};

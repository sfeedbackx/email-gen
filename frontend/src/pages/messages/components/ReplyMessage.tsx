import { Textarea } from '@mantine/core';
import { extractApiError } from '@utils/helpers';
import { useEffect, useState } from 'react';
import { IoMdSend } from 'react-icons/io';
import { useContactIdContext } from '../../../context/ContactContext';
import { useThreadIdContext } from '../../../context/ThreadContext';
import { usePostMessage } from '../../../hooks/useMessages';

export const RepliesMessages = () => {
  const [input, setInput] = useState('');
  const [error, setError] = useState<string>();
  const contactId = useContactIdContext();
  const { threadId } = useThreadIdContext();

  const {
    mutate: postMessage,
    isPending,
    isError: isPostError,
    error: postError,
  } = usePostMessage(contactId, threadId);

  const onSubmit = () => {
    if (isPending) return;
    if (!input.trim()) return;
    postMessage(
      { role: 'CONTACT', content: input },
      {
        onSuccess: () => setInput(''),
      },
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  useEffect(() => {
    if (!isPostError) return;
    const { serverError } = extractApiError(postError);
    setError(serverError);
  }, [isPostError, postError]);

  return (
    <div className="w-full">
      <Textarea
        autosize
        minRows={1}
        maxRows={3}
        placeholder="Paste or type the contact reply..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        error={error}
        disabled={isPending}
        rightSection={
          <IoMdSend
            className="w-4 h-4 hover:cursor-pointer text-gray-600 
              hover:text-blue-500 active:scale-95 transition-all duration-150"
            onClick={onSubmit}
          />
        }
      />
    </div>
  );
};

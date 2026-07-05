import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { SideBar } from '../../components/SideBar.tsx';
import { useContactIdContext } from '../../context/ContactContext.tsx';
import { ThreadProvider } from '../../context/ThreadContext.tsx';
import { getThreads } from '../../hooks/useThreads.ts';
import type { Draft } from '../../types/draft.types.ts';
import type { Thread } from '../../types/thread.types.ts';
import { ROUTES } from '../../utils/constants.ts';
import { getErrorMessage } from '../../utils/helpers.ts';
import { ThreadsSearch } from '../threads/components/ThreadSearch.tsx';
import { DraftSection } from './components/DraftSection.tsx';
import { MessagingSection } from './components/MessageSection.tsx';

export const Messages = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [draftOpened, setDraft] = useState(false);
  const [selectedDraft, setSelectedDraft] = useState<Draft | null>(null);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);

  const numId = useContactIdContext();
  const {
    data: threads,
    isLoading: threadsLoading,
    isError: threadsFailed,
    error: threadsError,
  } = getThreads(numId);
  if (!numId) return <Navigate to={ROUTES.CONTACTS} replace />;
  useEffect(() => {
    if (isGenerating) setDraft(true);
  }, [isGenerating]);
  return (
    <>
      <SideBar />
      <div className="flex w-screen h-screen  justify-center p-14">
        <div
          className="flex flex-row w-full h-full   rounded-lg shadow-2xl transition-[grid-template-columns] duration-300"
          style={{
            display: 'grid',
            gridTemplateColumns: draftOpened ? '0.95fr 2fr 1.75fr' : '1fr 2fr 1fr',
          }}
        >
          <ThreadProvider>
            <ThreadsSearch
              threads={threads}
              threadsLoading={threadsLoading}
              threadsError={
                threadsFailed ? getErrorMessage(threadsError, 'Failed to load threads') : undefined
              }
              contactId={numId}
              setSelectedThread={setSelectedThread}
              selectedThread={selectedThread}
            />
            <MessagingSection
              setDraft={setDraft}
              setSelectedDraft={setSelectedDraft}
              draftOpened={draftOpened}
              selectedDraft={selectedDraft}
              setIsGenerating={setIsGenerating}
            />
            <DraftSection
              draftOpened={draftOpened}
              isGenerating={isGenerating}
              setDraft={setDraft}
              selectedDraft={selectedDraft}
              setSelectedDraft={setSelectedDraft}
            />
          </ThreadProvider>
        </div>
      </div>
    </>
  );
};

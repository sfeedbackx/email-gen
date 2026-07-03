import { useEffect, useState } from "react";
import { MessagingSection } from "./components/MessageSection.tsx";
import { Navigate } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";
import type { Thread } from "../../types/thread.types.ts";
import type { Draft } from "../../types/draft.types.ts";
import useDraftStore from "../../store/draftsStore.ts";
import { getThreads } from "../../hooks/useThreads.ts";
import { useContactIdContext } from "../../context/ContactContext.tsx";
import { ROUTES } from "../../utils/constants.ts";
import { DraftSection } from "./components/DraftSection.tsx";
import { ThreadsSearch } from "../threads/components/ThreadSearch.tsx";
import { SideBar } from "../../components/SideBar.tsx";
import { ThreadProvider } from "../../context/ThreadContext.tsx";

export const Messages = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [draftOpened, setDraft] = useState(false);
  const [selectedDraft, setSelectedDraft] = useState<Draft | null>(null);
  const [selectedThreat, setSelectedThreat] = useState<Thread | null>(null);

  const numId = useContactIdContext();
  const { data: threads } = getThreads(numId);
  if (!numId) return <Navigate to={ROUTES.CONTACTS} replace />;
  const draftsFetched = useDraftStore(
    useShallow(
      (state) => state.drafts[`${numId}-${selectedThreat?.id}`]?.data ?? [],
    ),
  );
  useEffect(() => {
    if (isGenerating) setDraft(true);
  }, [isGenerating]);
  return (
    <>
      <SideBar />
      <div className='flex w-screen h-screen  justify-center p-14'>
        <div
          className='flex flex-row w-full h-full   rounded-lg shadow-2xl transition-[grid-template-columns] duration-300'
          style={{
            display: "grid",
            gridTemplateColumns: draftOpened
              ? "0.95fr 2fr 1.75fr"
              : "1fr 2fr 1fr",
          }}
        >
          <ThreadProvider>
            <ThreadsSearch
              threads={threads}
              contactId={numId}
              setSelectedThread={setSelectedThreat}
              selectedThread={selectedThreat}
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
              draftsFetched={draftsFetched}
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

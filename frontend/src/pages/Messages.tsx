import { SideBar } from "../components/common/SideBar"
import { useState } from "react";
import { ThreadsSearch } from "../components/threads/ThreadsSearch";
import { MessagingSection } from "../components/messages/MessagingSection";
import { DraftSection } from "../components/drafts/DraftSection";
import type { Draft } from "../types/types";

export const Meessages = (props: {}) => {
  const [draftOpened, setDraft] = useState(false)
  const [selectedDraft, setSelectedDraft] = useState<Draft | null>(null)
  return (
    <>
      <SideBar />
      <div className="flex w-screen h-screen  justify-center p-14">
        <div className="flex flex-row w-full h-full   rounded-lg shadow-2xl transition-[grid-template-columns] duration-300" style={{ display: 'grid', gridTemplateColumns: draftOpened ? '0.75fr 2fr 1.75fr' : '0.75fr 2fr 1fr' }}>
          <ThreadsSearch />
          <MessagingSection
            setDraft={setDraft}
            setSelectedDraft={setSelectedDraft}
            draftOpened={draftOpened}        
            selectedDraft={selectedDraft}   
          />
          <DraftSection draftOpened={draftOpened} setDraft={setDraft}
            selectedDraft={selectedDraft}
            setSelectedDraft={setSelectedDraft}

          />
        </div>

      </div>
    </>
  )
}

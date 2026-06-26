import { SideBar } from "../components/common/SideBar"
import { useEffect, useState } from "react";
import { ThreadsSearch } from "../components/threads/ThreadsSearch";
import { MessagingSection } from "../components/messages/MessagingSection";
import { DraftSection } from "../components/drafts/DraftSection";
import type { Draft } from "../types/drafts.types";
import useContactStore from "../store/contacts.store";
import { Navigate, useParams } from "react-router-dom";
import { paramsSchema } from "../utils/parsers";
import { ROUTES } from "../utils/constants";
import { getContactById } from "../hooks/useContact";

export const Messages = (props: {}) => {
  const [draftOpened, setDraft] = useState(false)
  const [selectedDraft, setSelectedDraft] = useState<Draft | null>(null)
  const { id } = useParams()
  const { selectedContact, setSelectedContact } = useContactStore()
  const parsed = paramsSchema.safeParse({ id })
  const numId = parsed.success ? parsed.data.id : 0
  const { isError } = getContactById(numId, !selectedContact.c && parsed.success)

  if (!parsed.success) return <Navigate to={ROUTES.CONTACTS} replace />
  if (isError) return <Navigate to={ROUTES.CONTACTS} replace />
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

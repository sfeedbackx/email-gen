import { Textarea } from "@mantine/core"
import { useState } from "react"
import { IoMdSend } from "react-icons/io"
import DefaultMessageBox from "./DefaultMessageBox";
import DraftsMessage from "./DraftsMessage";
import type { Draft } from "../../types/drafts.types";
import { RepliesMessages } from "./RepliesMessages";

export const MessagingSection = (props: { draftOpened: boolean, setDraft: (val: boolean) => void, selectedDraft: Draft | null, setSelectedDraft: (d: Draft | null) => void }) => {
  const messages = [
    "Cher Professeur Ahmed,\n\nJe vous prie de m'excuser...",
    "Bonjour, je voudrais savoir...",
    "Merci pour votre réponse...",
    "Bonjour, je vvoudraisvoudraisvoudraisvoudraisvoudraisvoudraisvoudraisvoudraisvoudraisvoudraisvoudraisvoudraisvoudraisvoudraisvoudraisvoudraisvoudraisvoudraisvoudraisoudrais savoir...Bonjour, je voudrais savoir...Bonjour, je voudrais savoir...Bonjour, je voudrais savoir...Bonjour, je voudrais savoir...Bonjour, je voudrais savoir...Bonjour, je voudrais savoir...Bonjour, je voudrais savoir...",
    "Merci pour votre réponse...",
    "Merci pour votre réponse...",
    "Merci pour votre réponse...",
    "Merci pour votre réponse...",
    "Merci pour votre réponse...",
    "Merci pour votre réponse...",
    "Merci pour votre réponse...",
    "Merci pour votre réponse...",
    "Merci pour votre réponse...",
  ];
  const [expanded, setExpanded] = useState(messages.map(() => false));

  const toggle = (i: number) =>
    setExpanded((prev) => prev.map((val, idx) => (idx === i ? !val : val)));
  return (
    <div className="flex flex-col border-r-2 h-full p-2  items-center w-full overflow-hidden">

      {/* Messages area — scrollable */}
      <div className="flex flex-col w-full flex-1 overflow-y-auto p-2 items-end gap-5 min-h-0 ">
        {/* ...your message bubbles stay exactly the same... */}
        {messages.map((msg, i) => (
          <DefaultMessageBox
            key={i}
            message={msg}
            expanded={expanded[i]}
            onToggle={() => toggle(i)}
          />
        ))}
        <DraftsMessage
          onClick={() => {
            if (props.draftOpened && props.selectedDraft?.id === 99) {
            props.setDraft(false)
            props.setSelectedDraft(null)
            }else{
              props.setDraft(true)
              props.setSelectedDraft({ id: 99, title: "draft-12121212", message: "draft-12121212" })
            }
            console.log( props.selectedDraft)
          }} />
        <RepliesMessages/>
      </div>

      {/* Textarea — pinned to bottom */}
      <div className="w-full  pt-8">
        <Textarea
          placeholder="Input placeholder"
          rightSection={<IoMdSend className="w-4 h-4 hover:cursor-pointer text-gray-600 
        hover:text-blue-500 active:scale-95 transition-all duration-150"  />}
        />
      </div>
    </div>

  )
}

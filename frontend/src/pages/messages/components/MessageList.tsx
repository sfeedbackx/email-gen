import { Fragment, useEffect, useRef } from "react"
import DefaultMessageBox from "./MessageBox"
import DraftsMessage from "./DraftMessage"
import { RepliesMessages } from "./ReplyMessage"
import type { MessageType } from "../../../types/message.types"
import type { Draft } from "../../../types/draft.types"
import useDraftStore from "../../../store/draftsStore"
import { useContactIdContext } from "../../../context/ContactContext"
import { makeKey } from "../../../utils/helpers"
import { useThreadIdContext } from "../../../context/ThreadContext"

interface MessagesListProps {
  messages: MessageType[]
  drafts: Draft[]
  expanded: boolean[]
  onToggle: (i: number) => void
  textAreaInput?: string
  draftOpened: boolean
  setDraft: (val: boolean) => void
  selectedDraft: Draft | null
  setSelectedDraft: (d: Draft | null) => void
}

export const MessagesList = (props: MessagesListProps) => {
  const { drafts } = useDraftStore()
  const contactId = useContactIdContext();
  const { threadId } = useThreadIdContext()
  const key = makeKey(contactId, threadId as number)

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const allItems = [
    ...props.messages.map(m => ({ type: 'message' as const, data: m, date: new Date(m.createdAt) })),
    ...drafts[key].data.map(d => ({ type: 'draft' as const, data: d, date: new Date(d.createdAt) })),
  ].sort((a, b) => a.date.getTime() - b.date.getTime())

  useEffect(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }, 100)
  }, [props.messages, props.textAreaInput])
  console.log(props.messages, props.expanded);

return (
  <>
    {allItems.map((item, i) => (
      item.type === 'message' ? (
        <DefaultMessageBox
          key={`message-${item.data.id}`}
          message={item.data.content}
          expanded={props.expanded[i]}
          onToggle={() => props.onToggle(i)}
        />
      ) : (
        <Fragment key={`prompt-draft-${item.data.id}`}>
          {item.data.prompt && (
            <DefaultMessageBox
              key={`prompt-${item.data.id}`}
              message={item.data.prompt}
              expanded={props.expanded[i]}
              onToggle={() => props.onToggle(i)}
            />
          )}
          <DraftsMessage
            key={`draft-${item.data.id}`}
            draft={item.data}
            count={i}
            onClick={() => {
              if (props.draftOpened && props.selectedDraft?.id === item.data.id) {
                props.setDraft(false)
                props.setSelectedDraft(null)
              } else {
                props.setDraft(true)
                props.setSelectedDraft({
                  id: item.data.id,
                  content: item.data.content,
                  prompt: item.data.prompt,
                  createdAt: item.data.createdAt,
                  threadId: item.data.threadId,
                  updatedAt: item.data.updatedAt,
                })
              }
            }}
          />
        </Fragment>
      )
    ))}
    <RepliesMessages />
    <div ref={messagesEndRef} />
  </>
)
}

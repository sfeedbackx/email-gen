import type { Draft } from "../../../types/draft.types";
import { DraftsBanner } from "./DraftBanner"
import MailBox from "./MailBox";

export const DraftSection = (props: {
  draftOpened: boolean
  isGenerating: boolean
  draftsFetched: Draft[]
  setDraft: (val: boolean) => void
  selectedDraft: Draft | null
  setSelectedDraft: (d: Draft | null) => void
}) => {

  return (
    <div className="h-full overflow-hidden">
      <div className="h-full p-6 flex flex-col gap-3 overflow-y-auto">
        {props.isGenerating || props.selectedDraft ? (
          <MailBox
            message={props.selectedDraft?.content ?? ''}
            isLoading={props.isGenerating}
            draftId = {props.selectedDraft?.id ?? 0}
            onBack={() => { props.setSelectedDraft(null); props.setDraft(false) }}
          />
        ) : (
          props.draftsFetched.map((draft, i) => (
            <DraftsBanner
              key={`draft-banner-${draft.id}`}
              title={`Draft ${i + 1}`}
              message={draft.content}
              onClick={() => { props.setSelectedDraft(draft); props.setDraft(true) }}
            />
          ))
        )}

      </div>
    </div>
  )
}

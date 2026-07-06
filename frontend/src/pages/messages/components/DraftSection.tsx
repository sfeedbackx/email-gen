import { Text } from '@mantine/core';
import { useContactIdContext } from '../../../context/ContactContext';
import { useThreadIdContext } from '../../../context/ThreadContext';
import { getDrafts } from '../../../hooks/useDrafts';
import type { Draft } from '../../../types/draft.types';
import { getErrorMessage } from '../../../utils/helpers';
import { DraftsBanner } from './DraftBanner';
import MailBox from './MailBox';

export const DraftSection = (props: {
  draftOpened: boolean;
  isGenerating: boolean;
  setDraft: (val: boolean) => void;
  selectedDraft: Draft | null;
  setSelectedDraft: (d: Draft | null) => void;
}) => {
  const contactId = useContactIdContext();
  const { threadId } = useThreadIdContext();
  const {
    data: draftsFetched = [],
    isLoading: draftsLoading,
    isError: draftsFailed,
    error: draftsError,
  } = getDrafts(contactId, threadId ?? 0);

  return (
    <div className="h-full overflow-hidden">
      <div className="h-full p-6 flex flex-col gap-3 overflow-y-auto">
        {!threadId && !(props.isGenerating || props.selectedDraft) && (
          <p className="text-gray-400 text-sm">Select a thread to view drafts</p>
        )}
        {props.isGenerating || props.selectedDraft ? (
          <MailBox
            message={props.selectedDraft?.content ?? ''}
            isLoading={props.isGenerating}
            draftId={props.selectedDraft?.id ?? 0}
            onBack={() => {
              props.setSelectedDraft(null);
              props.setDraft(false);
            }}
          />
        ) : draftsLoading ? (
          <div className="flex flex-col gap-3 p-2">
            {[1, 2, 3].map((i) => (
              <div key={`draft-sk-${i}`} className="animate-pulse h-12 bg-gray-200 rounded" />
            ))}
          </div>
        ) : draftsFailed ? (
          <Text c="red" size="sm">
            {getErrorMessage(draftsError, 'Failed to load drafts')}
          </Text>
        ) : draftsFetched.length === 0 ? (
          <p className="text-gray-400 text-sm">There are no drafts</p>
        ) : (
          draftsFetched.map((draft, i) => (
            <DraftsBanner
              key={`draft-banner-${draft.id}`}
              title={`Draft ${i + 1}`}
              message={draft.content}
              onClick={() => {
                props.setSelectedDraft(draft);
                props.setDraft(true);
              }}
            />
          ))
        )}
      </div>
    </div>
  );
};

import { useEffect, useState } from 'react';
import { useContactIdContext } from '../../../context/ContactContext';
import { useThreadIdContext } from '../../../context/ThreadContext';
import { deleteDraft, usePatchDraft, usePromoteDraft } from '../../../hooks/useDrafts';
import { draftContentUpdateSchema } from '../../../schemas/message.schema';
import { extractApiError } from '../../../utils/helpers';

export default function MailBox(props: {
  message: string;
  isLoading?: boolean;
  draftId: number;
  onBack: () => void;
}) {
  const [editable, setEditable] = useState(false);
  const [message, setMessage] = useState(props.message);
  const [mailError, setMailError] = useState<string>();
  const contactId = useContactIdContext();
  const { threadId } = useThreadIdContext();

  const {
    mutate: updateDraft,
    isPending: isUpdating,
    error: updateError,
    isError: isUpdateError,
  } = usePatchDraft(contactId, threadId, props.draftId);

  const {
    mutate: removeDraft,
    isPending: isDeleting,
    error: deleteError,
    isError: isDeleteError,
  } = deleteDraft(contactId, threadId);

  const {
    mutate: promoteDraft,
    isPending: isPromoting,
    error: promoteError,
    isError: isPromoteError,
  } = usePromoteDraft(contactId, threadId);

  useEffect(() => {
    setMessage(props.message);
    setEditable(false);
  }, [props.message]);

  const handleUpdate = () => {
    if (!editable) {
      return;
    }

    const result = draftContentUpdateSchema.safeParse({
      content: message,
    });

    if (!result.success) {
      const errorMessage: string = result.error.issues[0].message;
      setMailError(errorMessage);
      return;
    }

    setMailError(undefined);
    updateDraft(result.data);
    setEditable(false);
  };

  const handlePromote = () => {
    setMailError(undefined);
    promoteDraft(props.draftId, {
      onSuccess: () => props.onBack(),
    });
  };

  const handleCancel = () => {
    setMessage(props.message);
    setEditable(false);
    return;
  };
  useEffect(() => {
    if (!isUpdateError) return;
    const { issues, serverError } = extractApiError(updateError);
    if (Array.isArray(issues)) setMailError(issues[0].message);
    else setMailError(serverError);
  }, [isUpdateError, updateError]);

  useEffect(() => {
    if (!isDeleteError) return;
    const { serverError } = extractApiError(deleteError);
    setMailError(serverError);
  }, [isDeleteError, deleteError]);

  useEffect(() => {
    if (!isPromoteError) return;
    const { serverError } = extractApiError(promoteError);
    setMailError(serverError);
  }, [isPromoteError, promoteError]);
  return (
    <>
      <div className="flex flex-col overflow-hidden w-full h-full">
        {props.isLoading ? (
          <div className="flex flex-col gap-3 animate-pulse bg-gray-100 rounded-lg border p-4 w-full">
            <div className="h-3 bg-gray-300 rounded w-1/4" />
            <div className="h-3 bg-gray-300 rounded w-full" />
            <div className="h-3 bg-gray-300 rounded w-3/4" />
            <div className="h-3 bg-gray-300 rounded w-full" />
            <div className="h-3 bg-gray-300 rounded w-1/2" />
            <div className="h-3 bg-gray-300 rounded w-2/3" />
            <div className="h-3 bg-gray-300 rounded w-full" />
          </div>
        ) : editable ? (
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="text-sm/7 bg-gray-100 rounded-lg border p-1 h-full resize-none  flex w-full  font-mono text-gray-800 whitespace-pre-wrap"
          />
        ) : (
          <div className="text-sm/7 bg-gray-100 flex rounded-lg border mb-auto h-full p-2 w-full overflow-y-auto font-mono text-gray-800 whitespace-pre-wrap ">
            {message}
          </div>
        )}
      </div>
      {mailError && <div className="text-sm text-red-500">{mailError}</div>}

      <div className=" mt-6 justify-between flex w-full">
        <div className="flex flex-row gap-2">
          <button
            className="w-18 h-8 border text-center rounded-lg hover:bg-blue-50 hover:text-blue-500 active:scale-95 transition-all duration-150 cursor-pointer"
            onClick={props.onBack}
            disabled={props.isLoading || isUpdating || isDeleting || isPromoting}
          >
            back
          </button>
          <button
            className="w-18 h-8 border text-center rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700 active:scale-95 transition-all duration-150 cursor-pointer"
            onClick={() => removeDraft(props.draftId, { onSuccess: () => props.onBack() })}
            disabled={props.isLoading || isUpdating || isDeleting || isPromoting}
          >
            Delete
          </button>
        </div>
        <div className="flex flex-row gap-3 items-center justify-center">
          <button
            className={` w-18 p-1 border text-center rounded-lg active:scale-95 transition-all duration-150 cursor-pointer
            ${
              editable
                ? 'hover:bg-red-50 hover:text-red-500'
                : 'hover:bg-blue-50 hover:text-blue-500'
            }`}
            onClick={() => (editable ? handleCancel() : setEditable(true))}
            disabled={props.isLoading || isUpdating || isDeleting || isPromoting}
          >
            {editable ? 'Cancel' : 'Edit'}
          </button>
          <button
            className={`w-18 p-1 border text-center rounded-lg active:scale-95 transition-all duration-150 cursor-pointer
                hover:bg-emerald-50 hover:text-emerald-500`}
            onClick={() => (editable ? handleUpdate() : handlePromote())}
            disabled={props.isLoading || isUpdating || isDeleting || isPromoting}
          >
            {editable ? 'Confirm' : 'Promote'}
          </button>
        </div>
      </div>
    </>
  );
}

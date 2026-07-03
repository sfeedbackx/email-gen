import { useEffect, useState } from "react"
import { draftContentUpdateSchema } from "../../../schemas/message.schema"
import { usePatchDraft } from "../../../hooks/useDrafts"
import { useContactIdContext } from "../../../context/ContactContext"
import { useThreadIdContext } from "../../../context/ThreadContext"

export default function MailBox(props: {
  message: string
  isLoading?: boolean
  draftId: number,
  onBack: () => void
}) {
  const [editable, setEditable] = useState(false)
  const [message, setMessage] = useState(props.message)
  const [error, setError] = useState<string>()
  const contactId = useContactIdContext();
  const { threadId } = useThreadIdContext()
  console.log(props.message);

  const { mutate: updateDraft, isPending } = usePatchDraft(setError, contactId, threadId, props.draftId)

  useEffect(() => {
    setMessage(props.message)
    setEditable(false)
  }, [props.message])

  const handleUpdate = () => {
    if (!editable) {
      return
    }

    const result = draftContentUpdateSchema.safeParse({
      content: message
    });

    if (!result.success) {
      const errorMessage: string = result.error.issues[0].message;
      console.log(errorMessage);

      return;
    }

    console.log(result.data);
    updateDraft(result.data)
    setEditable(false)
  }

  const handleCancel = () => {
    setMessage(props.message)
    setEditable(false)
    return
  }

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
            className="text-sm/7 bg-gray-100 rounded-lg border p-1 h-4/5  resize-none  flex w-full  font-mono text-gray-800 whitespace-pre-wrap"
          />
        ) : (
          <div className="text-sm/7 bg-gray-100 flex rounded-lg border mb-auto h-4/5 p-2 w-full overflow-y-auto font-mono text-gray-800 whitespace-pre-wrap ">
            {message}
          </div>
        )}
      </div>

      <div className=" mt-auto justify-between flex w-full">
        <button
          className="w-18 h-8 border text-center rounded-lg hover:bg-blue-50 hover:text-blue-500 active:scale-95 transition-all duration-150 cursor-pointer"
          onClick={props.onBack}
          disabled={props.isLoading}
        >
          back
        </button>
        <div className="flex flex-row gap-3 items-center justify-center">

          <button
            className={` w-18 p-1 border text-center rounded-lg active:scale-95 transition-all duration-150 cursor-pointer
            ${editable
                ? 'hover:bg-red-50 hover:text-red-500'
                : 'hover:bg-blue-50 hover:text-blue-500'
              }`}
            onClick={() => editable ? handleCancel() : setEditable(true)}
            disabled={props.isLoading}
          >
            {editable ? 'Cancel' : 'Edit'}
          </button>
          <button
            className={`w-18 p-1 border text-center rounded-lg active:scale-95 transition-all duration-150 cursor-pointer
                hover:bg-emerald-50 hover:text-emerald-500`}
            onClick={() => handleUpdate()}
            disabled={props.isLoading}
          >
            {editable ? 'Confirm' : 'Promote'}
          </button>
        </div>
      </div>
    </>
  )
}

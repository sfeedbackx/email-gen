import { useEffect, useRef, useState } from "react";

export default function DefaultMessageBox(props: { message: string, expanded: boolean, onToggle: () => void }) {
  const textRef = useRef<HTMLDivElement>(null);
  const [hasMore, setHasMore] = useState(false);
  const regex = new RegExp('\\n\\n', 'g') 
  const newMessage = props.message.replace(regex, '\n')


  useEffect(() => {
    const el = textRef.current;

    if (el) {
      setHasMore(el.scrollHeight > el.clientHeight);
    }
  }, [newMessage]);

  console.log(hasMore, props.expanded);

  return (
    <div className="flex  items-end flex-col gap-2 group w-fit max-w-[70%] min-w-0">
      <div
        className={`rounded-lg border p-1 bg-gray-100 flex justify-center
        transition-all duration-300 w-full min-w-0 overflow-hidden
          ${props.expanded ? "" : "max-h-16"}`}
        ref={textRef}
      >
        <p className="text-sm/4 text-gray-800 whitespace-pre-wrap break-all min-w-0 p-2">
          {newMessage}
        </p>
      </div>
      {hasMore && (
        <span
          className="inline-flex w-8 h-6 border text-center rounded-lg 
            hover:bg-blue-50 hover:text-blue-500 active:scale-95
            transition-all duration-150 cursor-pointer justify-center 
            items-center opacity-0 group-hover:opacity-100"
          onClick={props.onToggle}
        >
          {props.expanded ? "−" : "+"}
        </span>
      )}
    </div>
  );
}

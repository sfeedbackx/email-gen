import { useEffect, useRef, useState } from 'react';

export default function DefaultMessageBox(props: {
  message: string;
  expanded: boolean;
  onToggle: () => void;
}) {
  const textRef = useRef<HTMLDivElement>(null);
  const [_hasMore, setHasMore] = useState(false);
  const regex = new RegExp('\\n\\n', 'g');
  const newMessage = props.message.replace(regex, '\n');

  useEffect(() => {
    const el = textRef.current;

    if (el) {
      setHasMore(el.scrollHeight > el.clientHeight);
    }
  }, [newMessage]);

  return (
    <div className="flex  items-end flex-col gap-2 group w-fit max-w-[70%] min-w-0">
      <div
        className={`rounded-lg border p-1 bg-gray-100 flex justify-center
        transition-all duration-300 w-full min-w-0 overflow-hidden
          `}
        ref={textRef}
      >
        <p className="text-sm/4 text-gray-800 whitespace-pre-wrap break-all min-w-0 p-2">
          {newMessage}
        </p>
      </div>
    </div>
  );
}

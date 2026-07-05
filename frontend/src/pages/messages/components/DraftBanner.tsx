export const DraftsBanner = ({
  title,
  message,
  onClick,
}: {
  title: string;
  message: string;
  onClick: () => void;
}) => {
  return (
    <>
      <div
        className="flex flex-col gap-1 rounded-lg border px-2 py-2 hover:cursor-pointer
            text-black hover:text-blue-500 hover:bg-blue-50 active:bg-blue-100 
            active:scale-95 transition-all duration-150"
        onClick={() => onClick()}
      >
        <span className="text-sm font-medium">{title}</span>
        <span className="text-xs text-gray-500 truncate">{message}</span>
      </div>
    </>
  );
};

export const ContactMessage = (props: { message: string }) => {
  const regex = new RegExp('\\n\\n', 'g');
  const newMessage = props.message.replace(regex, '\n');
  return (
    <>
      <div className={`flex w-full  over flex-row-start  transition-all duration-300 `}>
        <div className="flex w-80  flex-col">
          <div className="rounded-lg w-full border p-1 bg-gray-100 border-emerald-600">
            <p className=" text-sm/4 text-emerald-600 whitespace-pre-wrap wrap-break-word overflow-hidden">
              {newMessage}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export const DraftsBanner = ({ title, onClick }: {
  title: string
  message: string
  onClick: () => void
}) => {
  return (
    <>
      <div className="flex items-center gap-3 rounded-lg border px-2 py-2 hover:cursor-pointer
            text-black hover:text-blue-500 hover:bg-blue-50 active:bg-blue-100 
            active:scale-95 transition-all duration-150" onClick={() => onClick()}>
        {title}
      </div>
    </>
  )
}

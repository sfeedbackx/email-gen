export default function DraftsMessage({ onClick }: { onClick: () => void }) {
  return (
    <>
      <div className={`flex w-80  over flex-row-reverse trans transition-all duration-300 `}>
        <div className="flex items-end flex-col">
          <div className="rounded-lg border p-1 bg-gray-100 border-amber-600 
              cursor-pointer hover:bg-amber-50 active:scale-95 transition-all duration-150" onClick={onClick}>
            <text className=" text-sm/7 text-amber-600 ">
              draft-12121212
            </text>
          </div>
        </div>
      </div>
    </>

  )
}


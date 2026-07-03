import type { Draft } from "../../../types/draft.types";

export default function DraftsMessage({ onClick,count ,draft }: { onClick: () => void, count: number, draft: Draft }) {
  return (
    <>
      <div className={`flex w-80  over flex-row-reverse  transition-all duration-300 `}>
        <div className="flex items-end flex-col">
          <div className="rounded-lg border p-2 h-10 items-center justify-center flex bg-gray-100 border-amber-600 
             w-18 cursor-pointer hover:bg-amber-50 active:scale-95 transition-all duration-150" onClick={onClick}>
            <p className=" text-sm/7 text-amber-600 ">
              {`Draft ${count + 1}`}
            </p>
          </div>
        </div>
      </div>
    </>

  )
}


import { TextInput } from "@mantine/core"
import { CiSearch } from "react-icons/ci"
import { FiPlusCircle } from "react-icons/fi"

export const ThreadsSearch = (props: {}) => {
  return (

    <div className=" border-r-2 h-[calc(100%)] p-2 justify-center items-center">
      <div className="flex flex-row w-full items-center justify-between mb-4">
        <div className="">
          <div className="text-sm font-bold mb-0.5">Input label</div>
        </div>
        <div  >
          <FiPlusCircle className="w-6 h-6 hover:text-blue-500"></FiPlusCircle>
        </div>
      </div>
      <TextInput
        placeholder="Input placeholder"
        className="w-full"
        leftSection={<CiSearch className="w-4 h-4" />}
      />
      <div className="flex flex-col w-full  mt-4">
        <div className="flex items-center gap-3  px-2 py-2  hover:cursor-pointer text-black hover:text-blue-500 hover:bg-blue-50 active:bg-blue-100 active:scale-95 transition-all duration-150 ">Input label</div>
        <div className="w-[calc(100%+1rem)] h-px bg-blue-500 -mx-2 " />
      </div>
    </div>
  )
}

import { Box, Button, Center, Container, Divider, TextInput } from "@mantine/core";
import { SideBar } from "../components/common/SideBar";
import { CiSearch } from "react-icons/ci";

export const Threads = (props: {}) => {
  return (
    <>
      <SideBar />
      <div className="flex w-screen h-screen  justify-center">
        <div className="flex flex-col w-3xl p-6">
          <div className="flex flex-row w-full items-center justify-between mb-4">
            <div className="">
              <div className="text-sm font-bold mb-0.5">Input label</div>
            </div>
            <div className=" " >
              <Button size="sm">Button</Button>
            </div>
          </div>
          <TextInput
            placeholder="Input placeholder"
            className="w-full"
            leftSection={<CiSearch className="w-4 h-4" />}
          />
          <div className="flex flex-col w-full mt-4">
            <div className="flex items-center gap-3  px-2 py-2 rounded-lg hover:cursor-pointer text-black hover:text-blue-500 hover:bg-blue-50 active:bg-blue-100 active:scale-95 transition-all duration-150 ">Input label</div>
            <Divider color="blue.5" />
          </div>
        </div>
      </div>
    </>
  );
}

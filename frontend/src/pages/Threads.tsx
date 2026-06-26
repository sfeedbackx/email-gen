import { Button, Divider, TextInput } from "@mantine/core";
import { SideBar } from "../components/common/SideBar";
import { CiSearch } from "react-icons/ci";
import React from "react";
import { getContact } from "../hooks/useContact";
import { formatDate } from "../utils/helpers";

export const Threads = (props: {}) => {
  const dump = new Array<string>(20).fill('Input')
  const { data } = getContact()
  console.log(data);

  return (
    <>
      <SideBar />
      <div className="flex w-screen h-screen  justify-center select-none">
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
          <div className="flex flex-col w-full mt-4 overflow-auto h-full">
            {data?.map((msg, i) => (
              <React.Fragment key={msg.id}>
                <button className="flex items-center px-2 py-2 rounded-lg 
                    cursor-pointer text-black hover:text-blue-500
                hover:bg-blue-50 active:bg-blue-100 transition-all duration-150">
                  <div className="flex justify-between items-center flex-row w-full">
                    <div>{msg.name}</div>
                    <div className="text-gray-500">{formatDate(msg.updatedAt)}</div>
                  </div>
                </button>
                {i < (data.length - 1) && <Divider />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

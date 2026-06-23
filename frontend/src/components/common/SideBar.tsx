import { Box, Button, Flex } from "@mantine/core";
import { useEffect, useRef, useState } from 'react';
import { FiSidebar } from "react-icons/fi";
import { RiContactsLine } from "react-icons/ri";
import { MdMailOutline } from "react-icons/md";
import { LuArrowDownUp } from "react-icons/lu";
export const SideBar = (props: {}) => {
  const [sideOpen, setsideOpen] = useState(false);
  const [secondMenuOpened, setSecondMenuOpened] = useState(false)
  const getInitial = (name: string) => name.charAt(0).toUpperCase();

  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (ref.current?.contains(target)) return;
      setSecondMenuOpened(false);
    };

    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <Box className={`flex flex-col px-2 pt-2 h-screen bg-white  border-r-2 border-r-blue-500 transition-all duration-300 ${sideOpen ? 'w-72' : 'w-14 items-center'}`}>

      {/* Header */}
      <div className="flex flex-row gap-4 items-center justify-between px-1 py-1">
        {sideOpen && <span className="text-lg font-medium text-blue-500">EmilGen</span>}
        <FiSidebar
          className="text-gray-600 hover:cursor-pointer w-5 h-5 shrink-0 ml-auto hover:text-blue-500"
          onClick={() => setsideOpen(!sideOpen)}
        />
      </div>

      {/* Nav Items */}
      <div className="mt-8 w-full flex flex-col gap-2">
        <div className={`flex items-center gap-3 px-2 py-2 rounded-lg hover:cursor-pointer text-gray-600 hover:text-blue-500 hover:bg-blue-50 active:bg-blue-100 active:scale-95 transition-all duration-150 ${!sideOpen && 'justify-center'}`}>
          <MdMailOutline className="w-6 h-6 shrink-0" />
          {sideOpen && <span className="text-sm font-medium">Contact</span>}
        </div>

        <div className={`flex items-center gap-3 px-2 py-2 rounded-lg hover:cursor-pointer text-gray-600 hover:text-blue-500 hover:bg-blue-50 active:bg-blue-100 active:scale-95 transition-all duration-150 ${!sideOpen && 'justify-center'}`}>
          <RiContactsLine className="w-6 h-6 shrink-0" />
          {sideOpen && <span className="text-sm font-medium">Threads</span>}
        </div>
      </div>

      {/* Footer / User */}
      <div className="mt-auto w-full relative   flex flex-row  items-center ">
        <Flex
          gap="0.5rem"
          justify="center"
          align="center"
          direction="column"
          wrap="wrap"
          className={`z-10 w-full p-3  absolute  ${secondMenuOpened ? "-translate-y-6" : ""} bottom-3  transition-all duration-300`}

        >
          <Button fullWidth>Button 1</Button>
          <Button>Button 2</Button>
        </Flex>
        <div className={`relative -mx-2 ${sideOpen ? 'border-t-2 border-t-black w-[calc(100%+1rem)]' : ''}  
    flex items-center gap-3 py-2 px-3 hover:cursor-pointer text-gray-600 hover:text-blue-500
    hover:bg-blue-50 active:bg-blue-100 active:scale-95 transition-all duration-150 ${!sideOpen && 'justify-center'}`} onClick={() => {
            setSecondMenuOpened(!secondMenuOpened);
          }} ref={ref} >
          <div className="w-10 h-10 rounded-full bg-blue-500 flex  items-center justify-center text-white font-bold shrink-0">
            {getInitial('ahmed')}
          </div>
          {sideOpen && <span className="text-sm font-medium">Ahmed</span>}
          {sideOpen &&
            <LuArrowDownUp className="ml-auto w-6 h-6 " />}
        </div>
      </div>

    </Box>
  );
}

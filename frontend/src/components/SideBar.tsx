import { Box, Button, Flex } from "@mantine/core";
import { useEffect, useRef, useState } from 'react';
import { FiSidebar } from "react-icons/fi";
import { RiContactsLine } from "react-icons/ri";
import { MdMailOutline } from "react-icons/md";
import { LuArrowDownUp } from "react-icons/lu";
import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useAuth";
import { ROUTES } from "../utils/constants";


export const SideBar = () => {

  const [sideOpen, setSideOpen] = useState(false);

  const [secondMenuOpened, setSecondMenuOpened] = useState(false)

  const getInitial = (name: string) => name.charAt(0).toUpperCase();

  const { mutate: logout, isPending } = useLogout()

  const ref = useRef<HTMLDivElement>(null);

  const onSubmit = () => {
    logout()
  }

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

    <Box className={`flex flex-col px-2 pt-2 h-screen bg-white
    border-r-2 border-r-blue-500 transition-all duration-300 ${sideOpen ? 'w-72' : 'w-14 items-center'}`}>

      {/* Header */}
      <div className="flex flex-row gap-4 items-center justify-between px-1 py-1">

        {sideOpen && <span className="text-lg font-medium text-blue-500">EmilGen</span>}

        <FiSidebar
          className="text-gray-600 hover:cursor-pointer w-5 h-5 shrink-0 ml-auto hover:text-blue-500"
          onClick={() => setSideOpen(!sideOpen)} />

      </div>

      {/* Nav Items */}
      <div className="mt-8 w-full flex flex-col gap-2">

        <Link to={ROUTES.CONTACTS} className={`flex items-center gap-3 
          px-2 py-2 rounded-lg hover:cursor-pointer text-gray-600 hover:text-blue-500
          hover:bg-blue-50 active:bg-blue-100 active:scale-95 transition-all
          duration-150 ${!sideOpen && 'justify-center'}`}>

          <MdMailOutline className="w-6 h-6 shrink-0" />

          {sideOpen && <span className="text-sm font-medium">Contact</span>}

        </Link>

        <div className={`flex items-center gap-3 px-2 py-2 rounded-lg hover:cursor-pointer
          text-gray-600 hover:text-blue-500 hover:bg-blue-50 active:bg-blue-100 
          active:scale-95 transition-all duration-150 ${!sideOpen && 'justify-center'}`}>

          <RiContactsLine className="w-6 h-6 shrink-0" />

          {sideOpen && <span className="text-sm font-medium">Threads</span>}

        </div>

      </div>

      {/* Footer / User */}
      <div className="mt-auto w-full relative   flex flex-row  items-center " ref={ref}>
        {secondMenuOpened && <Flex
          gap="0.5rem"
          justify="center"
          align="center"
          direction="column"
          wrap="wrap"
          className={`div-sec-win  bg-white z-40  w-58 p-3  absolute border border-blue-500 rounded-sm   bottom-16  transition-all duration-300`}

        >
          <Button variant="default" fullWidth className="div-sec-win flex w-full 
            justify-center items-center gap-3 px-2 py-2 hover:cursor-pointer text-black
            hover:text-gray-800 hover:bg-gray-100 active:bg-gray-100 active:scale-95 
            transition-all duration-150" loading={isPending} onClick={onSubmit}>
            Logout
          </Button>

        </Flex>}
        <div className={` ${sideOpen ? ' -mx-2  gap-3 border-t-2 border-t-black w-[calc(100%+1rem)]' : 'w-full'}  
          flex items-center   py-2 px-3 hover:cursor-pointer text-gray-600 hover:text-blue-500
          hover:bg-blue-50 active:bg-blue-100 active:scale-95 transition-all duration-150 
          ${!sideOpen && 'justify-center'}`} onClick={() => {
            setSecondMenuOpened((prev) => !prev);
          }}  >

          <div className="w-10 h-10 rounded-full bg-blue-500 flex  items-center justify-center
            text-white font-bold shrink-0">

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

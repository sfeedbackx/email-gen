import { Box, Button, Center, Select, TextInput, Title } from "@mantine/core";
import { useState, useRef, useEffect } from 'react';
import { SideBar } from "../components/common/SideBar";

export default function Home() {
  const [opened, setOpened] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (ref.current?.contains(target)) return;
      if (target.closest('.mantine-Select-dropdown')) return;
      setOpened(false);
    };

    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
  return (
    <>
      <SideBar/>
      <Center className="w-screen h-screen relative" bg="var(--mantine-color-gray-light)">
        <Button onClick={() => setOpened(true)}>Open dropdown</Button>

        {opened && (
          <>
            <div className="fixed inset-0 bg-black opacity-40 z-10" />
            <Center className="fixed inset-0 z-20">
              <Box ref={ref} className="w-lg flex flex-col gap-2 items-center justify-center bg-white rounded-lg p-6">
                <Title className="text-center" order={2}>Contact</Title>
                <TextInput
                  label="Email"
                  placeholder="test@gmail.com"
                  classNames={{ label: 'text-blue-500 font-semibold' }}
                  className="w-full"
                />
                <TextInput
                  className="w-full"
                  label="First Name"
                  placeholder="Mark"
                  classNames={{ label: 'text-blue-500 font-semibold' }}
                />
                <TextInput
                  className="w-full"
                  label="Last Name"
                  placeholder="Chen"
                  classNames={{ label: 'text-blue-500 font-semibold' }}
                />
                <Select
                  mt="md"
                  label="Gender"
                  placeholder="Select gender"
                  classNames={{ label: 'text-blue-500 font-semibold' }}
                  data={[
                    { value: 'MALE', label: 'Male' },
                    { value: 'FEMALE', label: 'Female' },
                  ]}
                  className="w-full"
                />
                <Button mt="xl" fullWidth>
                  Sign Up
                </Button>
              </Box>
            </Center>
          </>
        )}
      </Center>
    </>
  );
}

import { Box, Button, Text, Center, TextInput, Title } from "@mantine/core";
import React, { useState } from "react";
import z from "zod";
import { useAddThreat } from "../../../hooks/useThreads";
import type { Thread } from "../../../types/thread.types";

const schema = z.object({
  subject: z.string().trim().min(2, "subject"),
});
export type AddThreatForm = z.infer<typeof schema>;
type FormErrors = Partial<string>;
const ThreadsForm = React.forwardRef<
  HTMLDivElement,
  {
    contactId: number;
    setOpenedThreatForm: (b: boolean) => void;
    setSelectedThread: (selectedThread: Thread) => void;
  }
>((props, ref) => {
  const [form, setForm] = useState<Partial<AddThreatForm>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [errors, setError] = useState<FormErrors>();
  const { mutate: postThreat, isPending } = useAddThreat(
    setError,
    props.contactId,
    setServerError,
    props.setSelectedThread,
    props.setOpenedThreatForm,
  );
  const handleChange = (field: keyof AddThreatForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };
  const onSubmit = () => {
    const result = schema.safeParse(form);

    console.log(result.error?.issues);

    if (!result.success) {
      const errorMessage: string = result.error.issues[0].message;
      setError(errorMessage);
      return;
    }

    setError(undefined);
    postThreat(result.data);
  };
  return (
    <>
      <div className='fixed inset-0 bg-black opacity-40 z-10' />
      <Center className='fixed inset-0 z-20'>
        <Box
          ref={ref}
          className='w-lg flex flex-col gap-2 items-center justify-center bg-white rounded-lg p-6'
        >
          <Title className='text-center' order={2}>
            Thread
          </Title>
          <TextInput
            className='w-full'
            label='Subject'
            placeholder='your subject'
            error={errors}
            onChange={(e) => handleChange("subject", e.target.value)}
            classNames={{ label: "text-blue-500 font-semibold" }}
          />
          <div className='flex w-full  mt-5 flex-col gap-4'>
            {serverError && (
              <Text c='red' size='sm' ta='center'>
                {serverError}
              </Text>
            )}
            <Button mt='xl' fullWidth onClick={onSubmit} loading={isPending}>
              Add Thread
            </Button>
          </div>
        </Box>
      </Center>
    </>
  );
});

export default ThreadsForm;

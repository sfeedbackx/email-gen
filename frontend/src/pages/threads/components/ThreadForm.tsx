import { Box, Button, Center, Text, TextInput, Title } from '@mantine/core';
import { extractApiError } from '@utils/helpers';
import React, { useEffect, useState } from 'react';
import z from 'zod';
import { useAddThread } from '../../../hooks/useThreads';
import type { Thread } from '../../../types/thread.types';

const schema = z.object({
  subject: z.string().trim().min(2, 'subject'),
});
export type AddThreadForm = z.infer<typeof schema>;
type FormErrors = Partial<string>;
const ThreadsForm = React.forwardRef<
  HTMLDivElement,
  {
    contactId: number;
    setOpenedThreadForm: (b: boolean) => void;
    setSelectedThread: (selectedThread: Thread) => void;
  }
>((props, ref) => {
  const [form, setForm] = useState<Partial<AddThreadForm>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [errors, setError] = useState<FormErrors>();
  const {
    mutate: postThread,
    isPending,
    isSuccess,
    isError,
    error,
  } = useAddThread(props.contactId, props.setSelectedThread);
  const handleChange = (field: keyof AddThreadForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };
  const onSubmit = () => {
    const result = schema.safeParse(form);

    if (!result.success) {
      const errorMessage: string = result.error.issues[0].message;
      setError(errorMessage);
      return;
    }

    setError(undefined);
    postThread(result.data);
  };

  useEffect(() => {
    if (isSuccess) props.setOpenedThreadForm(false);
  }, [isSuccess]);

  useEffect(() => {
    if (!isError) return;
    const { issues, serverError } = extractApiError(error);
    if (Array.isArray(issues)) setError(issues[0].message);
    else setServerError(serverError);
  }, [isError, error]);

  return (
    <>
      <div className="fixed inset-0 bg-black opacity-40 z-10" />
      <Center className="fixed inset-0 z-20">
        <Box
          ref={ref}
          className="w-lg flex flex-col gap-2 items-center justify-center bg-white rounded-lg p-6"
        >
          <Title className="text-center" order={2}>
            Thread
          </Title>
          <TextInput
            className="w-full"
            label="Subject"
            placeholder="your subject"
            error={errors}
            onChange={(e) => handleChange('subject', e.target.value)}
            classNames={{ label: 'text-blue-500 font-semibold' }}
          />
          <div className="flex w-full  mt-5 flex-col gap-4">
            {serverError && (
              <Text c="red" size="sm" ta="center">
                {serverError}
              </Text>
            )}
            <Button mt="xl" fullWidth onClick={onSubmit} loading={isPending}>
              Add Thread
            </Button>
          </div>
        </Box>
      </Center>
    </>
  );
});

export default ThreadsForm;

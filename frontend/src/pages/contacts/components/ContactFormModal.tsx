import {
  Box,
  Button,
  Text,
  Center,
  Select,
  TextInput,
  Title,
} from "@mantine/core";
import React, { useState } from "react";
import { postContact } from "../../../hooks/useContacts";
import { mapZodIssues } from "../../../utils/helpers";
import {
  contactFormSchema,
  type ContactForm,
  type ContactFormErrors,
} from "../../../schemas/contact.schema";

const ContactFormModal = React.forwardRef<HTMLDivElement>((_props, ref) => {
  const [form, setForm] = useState<Partial<ContactForm>>({});

  const [serverError, setServerError] = useState<string | null>(null);

  const [errors, setErrors] = useState<ContactFormErrors>({});

  const { mutate: contract, isPending } = postContact(
    setErrors,
    setServerError,
  );

  const handleChange = (field: keyof ContactForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const onSubmit = () => {
    const result = contactFormSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors: ContactFormErrors = mapZodIssues(result.error.issues);
      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    contract(result.data);
  };
  return (
    <>
      <div className='fixed inset-0 bg-black opacity-40 z-10' />

      <Center className='fixed inset-0 z-20'>
        <Box
          ref={ref}
          className='w-lg flex flex-col gap-2 items-center justify-center
          bg-white rounded-lg p-6'
        >
          <Title className='text-center' order={2}>
            Contact
          </Title>

          <TextInput
            className='w-full'
            label='Full Name'
            placeholder='Mark'
            error={errors.name}
            onChange={(e) => handleChange("name", e.target.value)}
            classNames={{ label: "text-blue-500 font-semibold" }}
          />

          <TextInput
            label='Email'
            placeholder='test@gmail.com'
            classNames={{ label: "text-blue-500 font-semibold" }}
            error={errors.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className='w-full'
          />

          <TextInput
            className='w-full'
            label='Context'
            placeholder='Context'
            error={errors.context}
            onChange={(e) => handleChange("context", e.target.value)}
            classNames={{ label: "text-blue-500 font-semibold" }}
          />

          <Select
            mt='md'
            label='Language'
            placeholder='Select Language'
            classNames={{ label: "text-blue-500 font-semibold" }}
            data={[
              { value: "fr", label: "French" },
              { value: "en", label: "English" },
            ]}
            className='w-full'
            error={errors.language}
            onChange={(value) => handleChange("language", value ?? "en")}
          />

          <div className='flex w-full  mt-5 flex-col gap-4'>
            {serverError && (
              <Text c='red' size='sm' ta='center'>
                {serverError}
              </Text>
            )}

            <Button mt='xl' fullWidth onClick={onSubmit} loading={isPending}>
              Add Contact
            </Button>
          </div>
        </Box>
      </Center>
    </>
  );
});

export default ContactFormModal;

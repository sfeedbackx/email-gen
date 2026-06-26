import { Box, Button, Center, Select, TextInput, Title } from "@mantine/core";
import React, { useState } from "react";
import z from "zod";

const schema = z.object({
  name: z.string().trim().min(2, 'full name is too short'),
  email: z.email('Invalid email').trim(),
  context: z.string().trim().optional(),
  language: z.enum(['fr', 'en']).default('en'),
})
type ContactForm = z.infer<typeof schema>
type FormErrors = Partial<Record<keyof ContactForm, string>>
const PopUpFormNewContact = React.forwardRef<HTMLDivElement>((_props, ref) => {
  const [form, setForm] = useState<Partial<ContactForm>>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [errors, setErrors] = useState<FormErrors>({})
  //const { mutate: signup, isPending } = useSignup(setErrors , setServerError)
  const handleChange = (field: keyof ContactForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }
  const onSubmit = () => {
    const result = schema.safeParse(form)

    console.log(result.error?.issues);

    if (!result.success) {
      const fieldErrors: FormErrors = {}
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof ContactForm
        fieldErrors[field] = issue.message
      })
      setErrors(fieldErrors)
      return
    }

    setErrors({})
    console.log(errors);
    console.log(result);

  }
  return (
    <>
      <div className="fixed inset-0 bg-black opacity-40 z-10" />
      <Center className="fixed inset-0 z-20">
        <Box ref={ref} className="w-lg flex flex-col gap-2 items-center justify-center bg-white rounded-lg p-6">
          <Title className="text-center" order={2}>Contact</Title>
          <TextInput
            className="w-full"
            label="Full Name"
            placeholder="Mark"
            error={errors.name}
            onChange={(e) => handleChange('name', e.target.value)}
            classNames={{ label: 'text-blue-500 font-semibold' }}
          />
          <TextInput
            label="Email"
            placeholder="test@gmail.com"
            classNames={{ label: 'text-blue-500 font-semibold' }}
            error={errors.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full"
          />
          <TextInput
            className="w-full"
            label="Context"
            placeholder="Context"
            error={errors.context}
            onChange={(e) => handleChange('context', e.target.value)}
            classNames={{ label: 'text-blue-500 font-semibold' }}
          />
          <Select
            mt="md"
            label="Language"
            placeholder="Select Language"
            classNames={{ label: 'text-blue-500 font-semibold' }}
            data={[
              { value: 'fr', label: 'French' },
              { value: 'en', label: 'English' },
            ]}
            className="w-full"
            error={errors.language}
            onChange={(value) => handleChange('language', value ?? 'en')}
          />
          <Button mt="xl" fullWidth onClick={onSubmit}>
            Add Contact
          </Button>
        </Box>
      </Center>
    </>
  )
})

export default PopUpFormNewContact

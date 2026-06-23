import { Box, Center, Flex, TextInput, PasswordInput, Select, Text, Anchor, Button } from "@mantine/core"
import { useState } from "react"
import { z } from "zod"
import { useSignup } from "../../hooks/useAuth"

const schema = z.object({
  firstName: z.string().min(2, 'First name too short'),
  lastName: z.string().min(2, 'Last name too short'),
  email: z.string('Invalid email'),
  password: z.string().min(8, 'Min 8 characters'),
  confirmPassword: z.string(),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['MALE', 'FEMALE']),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

type SignupForm = z.infer<typeof schema>
type FormErrors = Partial<Record<keyof SignupForm, string>>

export const Signup = () => {
  const [dateSet, setDateSet] = useState(false)
  const [form, setForm] = useState<Partial<SignupForm>>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [errors, setErrors] = useState<FormErrors>({})
  const { mutate: signup, isPending } = useSignup(setErrors , setServerError)
  const handleChange = (field: keyof SignupForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const onSubmit = () => {
    const result = schema.safeParse(form)


    if (!result.success) {
      const fieldErrors: FormErrors = {}
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof SignupForm
        fieldErrors[field] = issue.message
      })
      setErrors(fieldErrors)
      return
    }

    setErrors({})
    signup(result.data)
    console.log(`${serverError}`);

  }

  return (
    <div>
      <Center className="w-screen h-screen" bg="var(--mantine-color-gray-light)">
        <Box w={400}>
          <Flex gap="md">
            <TextInput
              className="flex-1"
              label="First Name"
              placeholder="Mark"
              classNames={{ label: 'text-blue-500 font-semibold' }}
              error={errors.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
            />
            <TextInput
              className="flex-1"
              label="Last Name"
              placeholder="Chen"
              classNames={{ label: 'text-blue-500 font-semibold' }}
              error={errors.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
            />
          </Flex>

          <TextInput
            mt="md"
            label="Email"
            placeholder="test@gmail.com"
            classNames={{ label: 'text-blue-500 font-semibold' }}
            error={errors.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />

          <PasswordInput
            mt="md"
            label="Password"
            placeholder="#Test1235"
            classNames={{ label: 'text-blue-500 font-semibold' }}
            error={errors.password}
            onChange={(e) => handleChange('password', e.target.value)}
          />

          <PasswordInput
            mt="md"
            label="Confirm Password"
            placeholder="#Test1235"
            classNames={{ label: 'text-blue-500 font-semibold' }}
            error={errors.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
          />

          <TextInput
            mt="md"
            label="Date of Birth"
            type="date"
            classNames={{ label: 'text-blue-500 font-semibold' }}
            styles={{ input: { color: !dateSet ? '#9ca3af' : '' } }}
            error={errors.dateOfBirth}
            onChange={(e) => {
              handleChange('dateOfBirth', e.target.value);
              if (e.target.value.trim().length == 0 || e.target.value.trim() === '') {
                setDateSet(false);
              } else {
                setDateSet(true);
              }
            }}
          />

          <Select
            mt="md"
            label="Gender"
            placeholder="Select gender"
            classNames={{ label: 'text-blue-500 font-semibold' }}
            error={errors.gender}
            data={[
              { value: 'MALE', label: 'Male' },
              { value: 'FEMALE', label: 'Female' },
            ]}
            onChange={(value) => handleChange('gender', value ?? '')}
          />
          <div className="flex w-full  mt-5 flex-col gap-4">
          {serverError && (
            <Text c="red" size="sm" ta="center">
              {serverError}
            </Text>
          )}
          <Button mt="" fullWidth onClick={onSubmit} loading={isPending}>
            Sign Up
          </Button>
          </div>
          <Text mt="md" ta="center" size="sm" c="dimmed">
            Already have an account?{' '}
            <Anchor href="/login" size="sm">
              Login
            </Anchor>
          </Text>
        </Box>
      </Center>
    </div>
  )
}

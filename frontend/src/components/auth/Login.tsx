import { Box, Center, TextInput, PasswordInput, Text, Anchor, Button } from "@mantine/core"
import { useState } from "react"
import { z } from "zod"

const schema = z.object({
  email: z.email('Invalid email'),
  password: z.string().min(8, 'Min 8 characters'),
})

type LoginForm = z.infer<typeof schema>
type FormErrors = Partial<Record<keyof LoginForm, string>>

export const Login = () => {
  const [form, setForm] = useState<Partial<LoginForm>>({})
  const [errors, setErrors] = useState<FormErrors>({})

  const handleChange = (field: keyof LoginForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const onSubmit = () => {
    const result = schema.safeParse(form)

    if (!result.success) {
      const fieldErrors: FormErrors = {}
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof LoginForm
        fieldErrors[field] = issue.message
      })
      setErrors(fieldErrors)
      return
    }

    setErrors({})
    console.log('Valid data:', result.data)
    // call your API here
  }

  return (
    <div>
      <Center className="w-screen h-screen" bg="var(--mantine-color-gray-light)">
        <Box w={400}>
          <TextInput
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

          <Button mt="xl" fullWidth onClick={onSubmit}>
            Login
          </Button>

          <Text mt="md" ta="center" size="sm" c="dimmed">
            Don't have an account?{' '}
            <Anchor href="/signup" size="sm">
              Sign Up
            </Anchor>
          </Text>
        </Box>
      </Center>
    </div>
  )
}

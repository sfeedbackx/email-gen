import {
  Box,
  Center,
  TextInput,
  PasswordInput,
  Text,
  Button,
} from "@mantine/core";
import { useState } from "react";
import { useLogin } from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import { ROUTES } from "../../utils/constants";
import { mapZodIssues } from "../../utils/helpers";
import {
  loginFormSchema,
  type LoginForm,
  type LoginFormErrors,
} from "../../schemas/auth.schema";

export const Login = () => {
  const [form, setForm] = useState<Partial<LoginForm>>({});

  const [errors, setErrors] = useState<LoginFormErrors>({});

  const [serverError, setServerError] = useState<string | null>(null);

  const { mutate: login, isPending } = useLogin(setErrors, setServerError);

  const handleChange = (field: keyof LoginForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const onSubmit = () => {
    const result = loginFormSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors: LoginFormErrors = mapZodIssues(result.error.issues);
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    login(result.data);
  };

  return (
    <div>
      <Center
        className='w-screen h-screen'
        bg='var(--mantine-color-gray-light)'
      >
        <Box w={400}>
          <TextInput
            label='Email'
            placeholder='test@gmail.com'
            classNames={{ label: "text-blue-500 font-semibold" }}
            error={errors.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />

          <PasswordInput
            mt='md'
            label='Password'
            placeholder='#Test1235'
            classNames={{ label: "text-blue-500 font-semibold" }}
            error={errors.password}
            onChange={(e) => handleChange("password", e.target.value)}
          />

          <div className='flex w-full  mt-5 flex-col gap-4'>
            {serverError && (
              <Text c='red' size='sm' ta='center'>
                {serverError}
              </Text>
            )}
            <Button mt='' fullWidth onClick={onSubmit} loading={isPending}>
              Login
            </Button>
          </div>
          <Text mt='md' ta='center' size='sm' c='dimmed'>
            Don't have an account?{" "}
            <Link to={ROUTES.REGISTER} className='text-sm text-blue-500'>
              Sign Up
            </Link>
          </Text>
        </Box>
      </Center>
    </div>
  );
};

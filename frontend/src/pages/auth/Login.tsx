import { Box, Button, Center, Divider, PasswordInput, Text, TextInput } from '@mantine/core';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { env } from '../../config/env';
import { useLogin } from '../../hooks/useAuth';
import { type LoginForm, type LoginFormErrors, loginFormSchema } from '../../schemas/auth.schema';
import { ROUTES } from '../../utils/constants';
import { extractApiError, mapZodIssues } from '../../utils/helpers';

export const Login = () => {
  const [form, setForm] = useState<Partial<LoginForm>>({});

  const [errors, setErrors] = useState<LoginFormErrors>({});

  const [serverError, setServerError] = useState<string | null>(null);

  const { mutate: login, isPending, error, isError } = useLogin();

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

  useEffect(() => {
    if (!isError) return;
    const { issues, serverError } = extractApiError(error);

    if (serverError) {
      setServerError(serverError);
    }

    if (Array.isArray(issues)) {
      const fieldErrors: Record<string, string> = mapZodIssues(issues);
      setErrors(fieldErrors);
    }
  }, [isError, error]);

  return (
    <div>
      <Center className="w-screen h-screen" bg="var(--mantine-color-gray-light)">
        <Box w={400}>
          <TextInput
            label="Email"
            placeholder="email@example.com"
            classNames={{ label: 'text-blue-500 font-semibold' }}
            error={errors.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />

          <PasswordInput
            mt="md"
            label="Password"
            placeholder="Password"
            classNames={{ label: 'text-blue-500 font-semibold' }}
            error={errors.password}
            onChange={(e) => handleChange('password', e.target.value)}
          />

          <div className="flex w-full  mt-5 flex-col gap-4">
            {serverError && (
              <Text c="red" size="sm" ta="center">
                {serverError}
              </Text>
            )}
            <Button mt="" fullWidth onClick={onSubmit} loading={isPending}>
              Login
            </Button>
          </div>

          <Divider my="md" label="Or continue with" labelPosition="center" />

          <div className="flex flex-col gap-2">
            <Button
              fullWidth
              variant="outline"
              component="a"
              href={`${env.apiBaseUrl}/auth/google`}
            >
              Google
            </Button>
            <Button
              fullWidth
              variant="outline"
              component="a"
              href={`${env.apiBaseUrl}/auth/facebook`}
            >
              Facebook
            </Button>
          </div>

          <Text mt="md" ta="center" size="sm" c="dimmed">
            Don't have an account?{' '}
            <Link to={ROUTES.REGISTER} className="text-sm text-blue-500">
              Sign Up
            </Link>
          </Text>
        </Box>
      </Center>
    </div>
  );
};

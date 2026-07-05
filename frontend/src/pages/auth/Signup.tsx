import {
  Anchor,
  Box,
  Button,
  Center,
  Flex,
  PasswordInput,
  Select,
  Text,
  TextInput,
} from '@mantine/core';
import { HttpStatusCode } from 'axios';
import { useEffect, useState } from 'react';
import { useSignup } from '../../hooks/useAuth';
import { type SignupForm, type SignupFormErrors, signupSchema } from '../../schemas/auth.schema';
import { extractApiError, mapZodIssues } from '../../utils/helpers';

export const Signup = () => {
  const [dateSet, setDateSet] = useState(false);

  const [form, setForm] = useState<Partial<SignupForm>>({});

  const [serverError, setServerError] = useState<string | null>(null);

  const [errors, setErrors] = useState<SignupFormErrors>({});

  const { mutate: signup, isPending, isError, error } = useSignup();

  const handleChange = (field: keyof SignupForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const onSubmit = () => {
    const result = signupSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors: SignupFormErrors = mapZodIssues(result.error.issues);
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    signup(result.data);
  };

  useEffect(() => {
    if (!isError) return;
    const { issues, serverError: serverErr, status } = extractApiError(error);

    if (status === HttpStatusCode.Conflict && /email/.test(serverErr)) {
      setErrors({ email: serverErr });
      return;
    }
    if (Array.isArray(issues)) {
      setErrors(mapZodIssues(issues));
      return;
    }
    setServerError(serverErr ?? 'Something went wrong');
  }, [isError, error]);

  return (
    <div>
      <Center className="w-screen h-screen" bg="var(--mantine-color-gray-light)">
        <Box w={400}>
          <Flex gap="md">
            <TextInput
              className="flex-1"
              label="First Name"
              placeholder="First name"
              classNames={{ label: 'text-blue-500 font-semibold' }}
              error={errors.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
            />
            <TextInput
              className="flex-1"
              label="Last Name"
              placeholder="Last name"
              classNames={{ label: 'text-blue-500 font-semibold' }}
              error={errors.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
            />
          </Flex>

          <TextInput
            mt="md"
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

          <PasswordInput
            mt="md"
            label="Confirm Password"
            placeholder="Confirm password"
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
  );
};

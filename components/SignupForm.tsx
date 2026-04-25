'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import FormInput from '@/components/FormInput';
import ErrorAlert from '@/components/ErrorAlert';
import SuccessAlert from '@/components/SuccessAlert';

export interface SignupFormProps {
  onSuccess?: () => void;
}

export default function SignupForm({ onSuccess }: SignupFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [displayNameError, setDisplayNameError] = useState<string | null>(null);

  const validateEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const validatePassword = (value: string): boolean => {
    const hasUppercase = /[A-Z]/.test(value);
    const hasLowercase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    return value.length >= 8 && hasUppercase && hasLowercase && hasNumber;
  };

  const validateUsername = (value: string): boolean => {
    return value.length >= 1 && value.length <= 100;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (value && !validateEmail(value)) {
      setEmailError('Invalid email format');
    } else {
      setEmailError(null);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (value && !validatePassword(value)) {
      setPasswordError(
        'Password must be at least 8 characters with uppercase, lowercase, and number'
      );
    } else {
      setPasswordError(null);
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    if (value && value !== password) {
      setConfirmPasswordError('Passwords do not match');
    } else {
      setConfirmPasswordError(null);
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
    if (value && !validateUsername(value)) {
      setUsernameError('Username must be 1-100 characters');
    } else {
      setUsernameError(null);
    }
  };

  const handleDisplayNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDisplayName(value);
    if (value.length === 0) {
      setDisplayNameError('Display name is required');
    } else {
      setDisplayNameError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    let hasErrors = false;

    if (!validateEmail(email)) {
      setEmailError('Invalid email format');
      hasErrors = true;
    }

    if (!validatePassword(password)) {
      setPasswordError(
        'Password must be at least 8 characters with uppercase, lowercase, and number'
      );
      hasErrors = true;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      hasErrors = true;
    }

    if (!validateUsername(username)) {
      setUsernameError('Username must be 1-100 characters');
      hasErrors = true;
    }

    if (displayName.length === 0) {
      setDisplayNameError('Display name is required');
      hasErrors = true;
    }

    if (hasErrors) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, username, displayName }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Signup failed');
        return;
      }

      setSuccess('Account created successfully!');
      if (onSuccess) {
        onSuccess();
      } else {
        setTimeout(() => {
          router.push('/feed');
        }, 500);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
      <div className="space-y-4">
        <FormInput
          label="Email"
          type="email"
          name="email"
          value={email}
          onChange={handleEmailChange}
          error={emailError}
          required
          aria-label="Email address"
        />
        <FormInput
          label="Username"
          type="text"
          name="username"
          value={username}
          onChange={handleUsernameChange}
          error={usernameError}
          required
          aria-label="Username (1-100 characters)"
        />
        <FormInput
          label="Display Name"
          type="text"
          name="displayName"
          value={displayName}
          onChange={handleDisplayNameChange}
          error={displayNameError}
          required
          aria-label="Display name"
        />
        <FormInput
          label="Password"
          type="password"
          name="password"
          value={password}
          onChange={handlePasswordChange}
          error={passwordError}
          required
          aria-label="Password (8+ chars, uppercase, lowercase, number)"
        />
        <FormInput
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          error={confirmPasswordError}
          required
          aria-label="Confirm password"
        />
      </div>

      {error && <ErrorAlert message={error} />}
      {success && <SuccessAlert message={success} />}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        {isLoading ? 'Creating Account...' : 'Sign Up'}
      </button>

      <p className="mt-4 text-center text-gray-600">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-blue-600 hover:underline font-semibold">
          Log in
        </Link>
      </p>
    </form>
  );
}

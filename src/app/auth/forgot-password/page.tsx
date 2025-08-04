"use client";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../auth-context';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { FormProvider } from 'react-hook-form';
import { Input } from '@/components/ui/form';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/lib/validation';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');
  
  const { resetPassword } = useAuth();

  const methods = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onChange',
  });

  const { handleSubmit } = methods;

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setLoading(true);
    setEmail(data.email);

    try {
      const result = await resetPassword(data.email);
      if (result.error) {
        toast.error(result.error);
      } else {
        setSuccess(true);
        toast.success('Password reset link sent! Please check your email.');
      }
    } catch (err) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 py-12 dark:bg-[#0C0A09]">
        <div className="w-full max-w-md text-center">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-8">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Check Your Email</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              We&apos;ve sent a password reset link to <strong>{email}</strong>. Please check your email and click the link to reset your password.
            </p>
            <div className="space-y-4">
              <Link href="/auth/signin">
                <Button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg">
                  Back to Sign In
                </Button>
              </Link>
              <Link
                href="/"
                className="block text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12 dark:bg-[#0C0A09]">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/auth/signin" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Reset Password</h1>
          <p className="text-gray-600 dark:text-gray-400">Enter your email to receive a reset link</p>
        </div>

        {/* Forgot Password Form */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-8">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email Field */}
              <Input
                name="email"
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                autoComplete="email"
                leftIcon={<Mail className="w-5 h-5" />}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                {loading ? 'Sending Reset Link...' : 'Send Reset Link'}
              </Button>
            </form>
          </FormProvider>

          {/* Links */}
          <div className="mt-6 text-center">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Remember your password?{' '}
              <Link
                href="/auth/signin"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
"use client";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../auth-context';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FormProvider } from 'react-hook-form';
import { Input } from '@/components/ui/form';
import { signInSchema, type SignInFormData } from '@/lib/validation';
import { toast } from 'sonner';

export default function SignInPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const { signIn, signInWithGoogle } = useAuth();
    const router = useRouter();

    const methods = useForm<SignInFormData>({
        resolver: zodResolver(signInSchema),
        mode: 'onChange',
    });

    const { handleSubmit } = methods;

    const onSubmit = async (data: SignInFormData) => {
        setLoading(true);

        try {
            const result = await signIn(data.email, data.password);
            if (result.error) {
                toast.error(result.error?.message || 'An error occurred');
            } else {
                router.push('/');
                toast.success('Welcome back!');
            }
        } catch {
            toast.error('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setGoogleLoading(true);

        try {
            const result = await signInWithGoogle();
            if (result.error) {
                toast.error(result.error?.message || 'An error occurred');
                setGoogleLoading(false);
            }
            // Google OAuth will redirect, so we don't need to handle success here
        } catch {
            toast.error('An unexpected error occurred');
            setGoogleLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
                    <p className="text-muted-foreground">Sign in to your Chronos account</p>
                </div>

                {/* Sign In Form */}
                <div className="bg-card rounded-2xl shadow-lg border border-border p-8">
                    {/* Google Sign In Button */}
                    <Button
                        type="button"
                        onClick={handleGoogleSignIn}
                        disabled={googleLoading}
                        className="w-full bg-card border border-border text-card-foreground py-3 font-semibold rounded-xl hover:bg-muted transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg mb-6"
                    >
                        <div className="flex items-center justify-center gap-3">
                            <div className="w-5 h-5 bg-card rounded flex items-center justify-center">
                                <span className="text-xs font-bold text-blue-600">G</span>
                            </div>
                            {googleLoading ? 'Signing in with Google...' : 'Continue with Google'}
                        </div>
                    </Button>

                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex-1 h-px bg-border" />
                        <span className="text-sm text-muted-foreground uppercase tracking-wider">
                            or sign in with email
                        </span>
                        <div className="flex-1 h-px bg-border" />
                    </div>

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

                            {/* Password Field */}
                            <Input
                                name="password"
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                leftIcon={<Lock className="w-5 h-5" />}
                                rightIcon={
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                }
                            />

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                            >
                                {loading ? 'Signing In...' : 'Sign In'}
                            </Button>
                        </form>
                    </FormProvider>

                    {/* Links */}
                    <div className="mt-6 text-center space-y-4">
                        <Link
                            href="/auth/forgot-password"
                            className="text-sm text-primary hover:text-primary/80 transition-colors"
                        >
                            Forgot your password?
                        </Link>
                        <div className="text-sm text-muted-foreground">
                            Don&apos;t have an account?{' '}
                            <Link
                                href="/auth/signup"
                                className="text-primary hover:text-primary/80 font-medium transition-colors"
                            >
                                Sign up
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
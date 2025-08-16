"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Loader2 } from 'lucide-react';

export default function AuthCallbackPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(true);

    useEffect(() => {
        const handleAuthCallback = async () => {
            try {
                setIsProcessing(true);
                
                // Get the URL hash and search params
                const hash = window.location.hash;
                const searchParams = new URLSearchParams(window.location.search);
                
                console.log('Auth callback - Hash:', hash);
                console.log('Auth callback - Search params:', searchParams.toString());
                
                // Check if this is an OAuth callback with error
                const hasError = searchParams.has('error') || searchParams.has('error_description');
                
                if (hasError) {
                    const errorMsg = searchParams.get('error_description') || searchParams.get('error') || 'Authentication failed';
                    console.error('OAuth error:', errorMsg);
                    setError(errorMsg);
                    setIsProcessing(false);
                    return;
                }

                // Check if this is an OAuth callback (has access_token in hash or params)
                const hasAccessToken = hash.includes('access_token') || searchParams.has('access_token');
                
                if (hasAccessToken) {
                    console.log('Processing OAuth callback...');
                    
                    // For OAuth callbacks, we need to let Supabase handle the session
                    // The session should be automatically set by Supabase
                    // Let's wait a moment for the session to be established
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    
                    // Now check if we have a session
                    const { data, error } = await supabase.auth.getSession();
                    
                    if (error) {
                        console.error('Error getting session after OAuth:', error);
                        setError(error.message);
                        setIsProcessing(false);
                        return;
                    }

                    if (data.session) {
                        console.log('OAuth authentication successful, session:', data.session.user.email);
                        // Successful OAuth authentication
                        router.push('/');
                    } else {
                        console.error('No session found after OAuth');
                        setError('Authentication failed - no session created');
                        setIsProcessing(false);
                    }
                } else {
                    console.log('No OAuth callback detected, checking existing session...');
                    
                    // Check if user is already authenticated
                    const { data, error } = await supabase.auth.getSession();
                    
                    if (error) {
                        console.error('Error getting session:', error);
                        setError(error.message);
                        setIsProcessing(false);
                        return;
                    }

                    if (data.session) {
                        console.log('User already authenticated:', data.session.user.email);
                        // User is already authenticated
                        router.push('/');
                    } else {
                        console.log('No session found, redirecting to sign in');
                        // No session found, redirect to sign in
                        router.push('/auth/signin');
                    }
                }
            } catch (err) {
                console.error('Auth callback error:', err);
                setError('An unexpected error occurred');
                setIsProcessing(false);
            }
        };

        handleAuthCallback();
    }, [router]);

    if (error) {
        return (
            <main className="min-h-screen flex items-center justify-center px-4 py-12 dark:bg-[#0C0A09]">
                <div className="w-full max-w-md text-center">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-8">
                        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-2xl">⚠️</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Authentication Error</h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            {error}
                        </p>
                        <button
                            onClick={() => router.push('/auth/signin')}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                        >
                            Back to Sign In
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen flex items-center justify-center px-4 py-12 dark:bg-[#0C0A09]">
            <div className="w-full max-w-md text-center">
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-8">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        {isProcessing ? 'Signing you in...' : 'Processing...'}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Please wait while we complete your authentication.
                    </p>
                </div>
            </div>
        </main>
    );
} 
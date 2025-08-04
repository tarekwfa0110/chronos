"use client";

import { useState } from 'react';
import { useAuth } from '../../auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { ArrowLeft, User, Mail, Phone, Lock, AlertTriangle } from 'lucide-react';
import { AccountSkeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateProfileSchema, UpdateProfileFormData } from '@/lib/validation';
import { useEffect } from 'react';
import { toast } from 'sonner';

export default function AccountSettingsPage() {
  const { user, loading, updateProfile, updatePassword, signOut } = useAuth();
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    mode: 'onChange',
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin');
    }
    
    // Pre-fill form with user data when available
    if (user) {
      setValue('fullName', user.user_metadata?.full_name || '');
      setValue('email', user.email || '');
      setValue('phone', user.user_metadata?.phone || '');
    }
  }, [user, loading, router, setValue]);

  const onSubmit = async (data: UpdateProfileFormData) => {
    if (!user) return;
    
    setIsUpdating(true);
    try {
      const { error } = await updateProfile({
        full_name: data.fullName,
        phone: data.phone
      });
      
      if (error) throw error;
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    
    try {
      const { error } = await updatePassword(''); // This will trigger a password reset email
      if (error) throw error;
      toast.success('Password reset email sent');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send password reset email');
    }
  };

  const handleAccountDeletion = async () => {
    // In a real implementation, this would call an API to delete the user's account
    toast.error('Account deletion is not implemented yet');
    setShowDeleteConfirm(false);
  };

  if (loading) {
    return (
      <main className="max-w-4xl mx-auto py-16 px-4 sm:px-8 min-h-screen">
        <AccountSkeleton />
      </main>
    );
  }

  if (!user) {
    return null; // Will redirect to sign in
  }

  return (
    <main className="max-w-4xl mx-auto py-16 px-4 sm:px-8 min-h-screen">
      {/* Header */}
      <div className="mb-12">
        <Link href="/account" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-6">
          <ArrowLeft className="w-5 h-5" />
          Back to Account
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Account Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your profile and account preferences</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Profile Information Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Profile Information</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="fullName"
                  type="text"
                  className="pl-10 w-full"
                  placeholder="Your full name"
                  {...register('fullName')}
                />
              </div>
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="email"
                  type="email"
                  className="pl-10 w-full bg-gray-50 dark:bg-gray-800"
                  placeholder="Your email address"
                  disabled
                  {...register('email')}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="phone"
                  type="tel"
                  className="pl-10 w-full"
                  placeholder="Your phone number"
                  {...register('phone')}
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200"
              disabled={isUpdating}
            >
              {isUpdating ? 'Updating...' : 'Save Changes'}
            </Button>
          </div>
        </form>

        {/* Security Settings */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <Lock className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Security</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Password</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Change your password or reset it if you've forgotten it</p>
              <Button 
                onClick={handlePasswordReset}
                className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium rounded-xl transition-all duration-200"
              >
                Reset Password
              </Button>
            </div>

            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Sign Out</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Sign out from your account on this device</p>
              <Button 
                onClick={() => signOut()}
                className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium rounded-xl transition-all duration-200"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 dark:bg-red-900/10 rounded-2xl shadow-lg border border-red-200 dark:border-red-900/20 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-red-600 dark:text-red-400">Danger Zone</h2>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Delete Account</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Permanently delete your account and all associated data</p>
            
            {!showDeleteConfirm ? (
              <Button 
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-all duration-200"
              >
                Delete Account
              </Button>
            ) : (
              <div className="space-y-4 p-4 border border-red-300 dark:border-red-800 rounded-xl bg-red-100 dark:bg-red-900/20">
                <p className="text-red-600 dark:text-red-400 font-medium">Are you sure? This action cannot be undone.</p>
                <div className="flex gap-4">
                  <Button 
                    onClick={handleAccountDeletion}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-all duration-200"
                  >
                    Yes, Delete
                  </Button>
                  <Button 
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium rounded-xl transition-all duration-200"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
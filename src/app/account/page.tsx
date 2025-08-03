"use client";
import { useAuth } from '../auth-context';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, User, Mail, Settings, Heart, Package } from 'lucide-react';
import { AccountSkeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AccountPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin');
    }
  }, [user, loading, router]);

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
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-6">
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Account</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Information */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Profile Information</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <p className="text-gray-900 dark:text-white font-medium">{user.email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">User ID</p>
                <p className="text-gray-900 dark:text-white font-medium text-sm">{user.id}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200">
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <Settings className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Quick Actions</h2>
          </div>
          
          <div className="space-y-4">
            <Link href="/wishlist">
              <div className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                <Heart className="w-5 h-5 text-red-500" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">My Wishlist</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">View saved items</p>
                </div>
              </div>
            </Link>
            
            <Link href="/orders">
              <div className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                <Package className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Order History</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">View past orders</p>
                </div>
              </div>
            </Link>
            
            <Link href="/account/settings">
              <div className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                <Settings className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Account Settings</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Manage preferences</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Account Status */}
      <div className="mt-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Account Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">Active</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Account Status</p>
          </div>
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {user.email_confirmed_at ? '✓' : '✗'}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Email Verified</p>
          </div>
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {new Date(user.created_at).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Member Since</p>
          </div>
        </div>
      </div>
    </main>
  );
} 
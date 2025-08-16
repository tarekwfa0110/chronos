"use client";
import { useAuth } from '../auth-context';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
    ArrowLeft, User, Mail, Settings, Heart, Package, MapPin, 
    Shield, Star, Calendar, ChevronRight, Edit3, Crown,
    Activity, Gift, CreditCard, Bell
} from 'lucide-react';
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
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-8 min-h-screen">
                <AccountSkeleton />
            </main>
        );
    }

    if (!user) {
        return null;
    }

    const memberSince: Date = new Date(user.created_at);
    const memberDays: number = Math.floor((new Date().getTime() - memberSince.getTime()) / (1000 * 60 * 60 * 24));

    return (
        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-8 min-h-screen">
            {/* Header */}
            <div className="mb-12">
                <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-200 mb-8 group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
                    <span className="font-medium">Back to Home</span>
                </Link> 
                
                {/* Welcome Header */}
                <div className="flex items-start gap-6 mb-2">
                    <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <User className="w-10 h-10 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h1 className="text-4xl font-bold text-foreground mb-2">
                            Account Dashboard
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Welcome back! Manage your account and preferences
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                <div className="bg-card rounded-xl p-6 border border-border hover:border-border/60 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                            <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                            <p className="font-semibold text-green-600 dark:text-green-400">Active</p>
                        </div>
                    </div>
                </div>

                <div className="bg-card rounded-xl p-6 border border-border hover:border-border/60 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                            <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm text-muted-foreground">Email</p>
                            <p className="font-semibold text-blue-600 dark:text-blue-400">
                                {user.email_confirmed_at ? 'Verified' : 'Pending'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-card rounded-xl p-6 border border-border hover:border-border/60 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Member Since</p>
                            <p className="font-semibold text-purple-600 dark:text-purple-400">
                                {memberSince.toLocaleDateString('en', { month: 'short', year: 'numeric' })}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-card rounded-xl p-6 border border-border hover:border-border/60 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/20 rounded-lg flex items-center justify-center">
                            <Activity className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm text-muted-foreground">Days Active</p>
                            <p className="font-semibold text-amber-600 dark:text-amber-400">{memberDays}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Information */}
                <div className="lg:col-span-1">
                    <div className="bg-card rounded-xl border border-border p-6">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-blue-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                                <User className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-xl font-semibold text-card-foreground mb-1">Profile</h2>
                            <p className="text-muted-foreground">Your account information</p>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="p-4 rounded-lg bg-muted/50">
                                <div className="flex items-center gap-2 mb-2">
                                    <Mail className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-sm font-medium text-muted-foreground">Email</span>
                                </div>
                                <p className="text-card-foreground font-medium">{user.email}</p>
                            </div>

                            <div className="p-4 rounded-lg bg-muted/50">
                                <div className="flex items-center gap-2 mb-2">
                                    <User className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-sm font-medium text-muted-foreground">User ID</span>
                                </div>
                                <p className="text-card-foreground font-mono text-sm">{user.id}</p>
                            </div>
                        </div>

                        <Link href="/account/settings" className="block">
                            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg py-2.5">
                                <Edit3 className="w-4 h-4 mr-2" />
                                Edit Profile
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="lg:col-span-2">
                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold text-foreground mb-2">Quick Actions</h2>
                        <p className="text-muted-foreground">Access your most used features</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Action Cards */}
                        <Link href="/wishlist" className="group block">
                            <div className="bg-card rounded-xl p-6 border border-border hover:border-red-300 dark:hover:border-red-700 transition-all duration-200 group-hover:-translate-y-0.5">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                                        <Heart className="w-5 h-5 text-red-600 dark:text-red-400" />
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors" />
                                </div>
                                <h3 className="font-semibold text-card-foreground mb-1">My Wishlist</h3>
                                <p className="text-sm text-muted-foreground">View and manage saved items</p>
                            </div>
                        </Link>

                        <Link href="/orders" className="group block">
                            <div className="bg-card rounded-xl p-6 border border-border hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200 group-hover:-translate-y-0.5">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                                        <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                                </div>
                                <h3 className="font-semibold text-card-foreground mb-1">Order History</h3>
                                <p className="text-sm text-muted-foreground">Track and view past orders</p>
                            </div>
                        </Link>

                        <Link href="/account/addresses" className="group block">
                            <div className="bg-card rounded-xl p-6 border border-border hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-200 group-hover:-translate-y-0.5">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                                        <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
                                </div>
                                <h3 className="font-semibold text-card-foreground mb-1">My Addresses</h3>
                                <p className="text-sm text-muted-foreground">Manage shipping addresses</p>
                            </div>
                        </Link>

                        <Link href="/account/settings" className="group block">
                            <div className="bg-card rounded-xl p-6 border border-border hover:border-green-300 dark:hover:border-green-700 transition-all duration-200 group-hover:-translate-y-0.5">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                                        <Settings className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors" />
                                </div>
                                <h3 className="font-semibold text-card-foreground mb-1">Account Settings</h3>
                                <p className="text-sm text-muted-foreground">Manage preferences & security</p>
                            </div>
                        </Link>

                        <Link href="/account/payment" className="group block">
                            <div className="bg-card rounded-xl p-6 border border-border hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200 group-hover:-translate-y-0.5">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center">
                                        <CreditCard className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
                                </div>
                                <h3 className="font-semibold text-card-foreground mb-1">Payment Methods</h3>
                                <p className="text-sm text-muted-foreground">Manage cards & billing</p>
                            </div>
                        </Link>

                        <Link href="/account/notifications" className="group block">
                            <div className="bg-card rounded-xl p-6 border border-border hover:border-amber-300 dark:hover:border-amber-700 transition-all duration-200 group-hover:-translate-y-0.5">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/20 rounded-lg flex items-center justify-center">
                                        <Bell className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors" />
                                </div>
                                <h3 className="font-semibold text-card-foreground mb-1">Notifications</h3>
                                <p className="text-sm text-muted-foreground">Manage alerts & updates</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Loyalty Section */}
            <div className="mt-12 bg-card rounded-xl border border-border p-8">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-amber-600 rounded-xl flex items-center justify-center">
                        <Crown className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-card-foreground">Loyalty Status</h3>
                        <p className="text-muted-foreground">Your membership benefits and rewards</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-muted/50 rounded-xl">
                        <Star className="w-8 h-8 text-amber-500 mx-auto mb-3" />
                        <p className="text-xl font-semibold text-amber-600 dark:text-amber-400 mb-1">Gold</p>
                        <p className="text-sm text-muted-foreground">Membership Tier</p>
                    </div>
                    <div className="text-center p-6 bg-muted/50 rounded-xl">
                        <Gift className="w-8 h-8 text-purple-500 mx-auto mb-3" />
                        <p className="text-xl font-semibold text-purple-600 dark:text-purple-400 mb-1">1,250</p>
                        <p className="text-sm text-muted-foreground">Reward Points</p>
                    </div>
                    <div className="text-center p-6 bg-muted/50 rounded-xl">
                        <Package className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                        <p className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-1">Free</p>
                        <p className="text-sm text-muted-foreground">Next Shipping</p>
                    </div>
                </div>
            </div>
        </main>
    );
}
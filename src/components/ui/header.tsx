"use client";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ShoppingCart, User, LogOut, Settings, Heart } from "lucide-react";
import { useCart } from "@/app/cart-context";
import { useAuth } from "@/app/auth-context";
import { useState, useEffect, useRef } from "react";

export function Header() {
    const { openCart } = useCart();
    const { user, signOut, loading } = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setShowUserMenu(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSignOut = async () => {
        await signOut();
        setShowUserMenu(false);
    };

    return (
        <header className="fixed top-0 left-0 w-full z-40 bg-background border-b border-gray-200 dark:border-gray-800 h-16 flex items-center px-6">
            <div className="flex-1 flex justify-center">
                <Link href="/" className="text-2xl font-extrabold tracking-widest select-none">CHRONOS</Link>
            </div>
            <div className="flex items-center gap-4 absolute right-6">
                <ThemeToggle />
                <button onClick={openCart} aria-label="Open cart" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <ShoppingCart className="w-6 h-6" />
                </button>
                
                {/* Auth Section */}
                {!loading && (
                    <>
                        {user ? (
                            <div className="relative" ref={userMenuRef}>
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                    aria-label="User menu"
                                >
                                    <User className="w-6 h-6" />
                                </button>
                                
                                {showUserMenu && (
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 py-2">
                                        <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {user.email}
                                            </p>
                                        </div>
                                        <Link
                                            href="/account"
                                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            <Settings className="w-4 h-4" />
                                            Account Settings
                                        </Link>
                                        <Link
                                            href="/wishlist"
                                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            <Heart className="w-4 h-4" />
                                            Wishlist
                                        </Link>
                                        <button
                                            onClick={handleSignOut}
                                            className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full text-left"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                href="/auth/signin"
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                            >
                                Sign In
                            </Link>
                        )}
                    </>
                )}
            </div>
        </header>
    );
} 
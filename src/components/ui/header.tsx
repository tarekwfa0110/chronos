"use client";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ShoppingCart, User, LogOut, Settings, Heart } from "lucide-react";
import { useCart } from "@/app/cart-context";
import { useAuth } from "@/app/auth-context";
import { useWishlist } from "@/app/wishlist-context";
import { useState, useEffect, useRef } from "react";

export function Header() {
    const { openCart, cart } = useCart();
    const { user, signOut, loading } = useAuth();
    const { wishlist } = useWishlist();
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

    const cartItemCount = Array.isArray(cart) ? cart.reduce((total, item) => total + item.quantity, 0) : 0;

    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-background/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 h-14 sm:h-16 md:h-18 flex items-center justify-around px-3 sm:px-4 md:px-6 lg:px-8">
            {/* Left empty div: only visible on sm+ */}
            <div className="hidden sm:block flex-1" />
            
            {/* Centered Logo */}
            <div className="flex-1 flex justify-center min-w-0">
                <Link 
                    href="/" 
                    className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-extrabold tracking-widest select-none truncate hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                    CHRONOS
                </Link>
            </div>

            {/* Right Actions */}
            <div className="flex flex-1 justify-end items-center gap-1 sm:gap-2 md:gap-3 lg:gap-4 min-w-0">
                <ThemeToggle />
                <button 
                    onClick={openCart} 
                    aria-label="Open cart" 
                    className="relative p-1.5 sm:p-2 md:p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                >
                    <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" />
                    {cartItemCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[16px] sm:min-w-[18px] h-[16px] sm:h-[18px] flex items-center justify-center font-medium text-[10px] sm:text-xs">
                            {cartItemCount > 99 ? '99+' : cartItemCount}
                        </span>
                    )}
                </button>
                {/* Auth Section */}
                {!loading && (
                    <>
                        {user ? (
                            <div className="relative" ref={userMenuRef}>
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="p-1.5 sm:p-2 md:p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                                    aria-label="User menu"
                                >
                                    <User className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" />
                                </button>
                                {showUserMenu && (
                                    <div className="absolute right-0 top-full mt-2 w-44 sm:w-48 md:w-52 lg:w-56 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 py-2 text-sm animate-in slide-in-from-top-2 duration-200">
                                        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                {user.email}
                                            </p>
                                        </div>
                                        <Link
                                            href="/account"
                                            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            <Settings className="w-4 h-4" />
                                            Account Settings
                                        </Link>
                                        <Link
                                            href="/wishlist"
                                            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            <Heart className="w-4 h-4" />
                                            Wishlist
                                            {wishlist.length > 0 && (
                                                <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center font-medium">
                                                    {wishlist.length}
                                                </span>
                                            )}
                                        </Link>
                                        <button
                                            onClick={handleSignOut}
                                            className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full text-left"
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
                                className="px-3 md:px-4 lg:px-5 py-2 md:py-2.5 text-sm md:text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
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
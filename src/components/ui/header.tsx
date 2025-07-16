"use client";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/app/cart-context";

export function Header() {
    const { openCart } = useCart();
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
            </div>
        </header>
    );
} 
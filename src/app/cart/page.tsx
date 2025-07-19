"use client";
import { useCart } from "../cart-context";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Minus, Plus, X, ShoppingBag, ArrowLeft } from "lucide-react";
import { useState } from "react";

export default function CartPage() {
    const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    if (cart.length === 0) {
        return (
            <main className="max-w-4xl mx-auto py-16 px-4 sm:px-8 min-h-screen">
                <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                        <ShoppingBag className="w-12 h-12 text-gray-400" />
                    </div>
                    <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Your cart is empty</h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">Start adding some items to your cart!</p>
                    <Link href="/">
                        <Button className="px-8 py-3 text-lg font-semibold rounded-xl bg-black dark:bg-white text-white dark:text-black hover:opacity-90 transition-opacity">
                            Start Shopping
                        </Button>
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="max-w-5xl mx-auto py-12 px-4 sm:px-8 min-h-screen">
            {/* Header */}
            <div className="mb-12">
                <div className="flex items-center gap-4 mb-6">
                    <Link href="/" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Continue Shopping</span>
                    </Link>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                    Shopping Cart
                </h1>
                <div className="flex items-center justify-between">
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        {itemCount} item{itemCount !== 1 ? "s" : ""} in your cart
                    </p>
                    {cart.length > 0 && (
                        <button
                            onClick={clearCart}
                            className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium transition-colors rounded-lg px-4 py-2 ml-2 shadow-sm border border-gray-200 dark:border-gray-700"
                        >
                            Clear Cart
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-6">
                    {cart.map((item) => (
                        <div key={item.id} className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow">
                            <div className="flex gap-6">
                                {/* Product Image */}
                                <div className="flex-shrink-0">
                                    <div className="w-24 h-24 relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                                        <Image
                                            src={item.image_url || "/placeholder.png"}
                                            alt={item.name}
                                            fill
                                            style={{ objectFit: "cover" }}
                                            className="rounded-xl"
                                        />
                                    </div>
                                </div>

                                {/* Product Details */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-lg text-gray-900 dark:text-white leading-tight">
                                            {item.name}
                                        </h3>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                            aria-label="Remove item"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                    
                                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                        Black, 15oz
                                    </div>

                                    <div className="flex items-center justify-between">
                                        {/* Quantity Controls */}
                                        <div className="flex items-center">
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-4">
                                                Quantity:
                                            </span>
                                            <div className="inline-flex items-center border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800">
                                                <button
                                                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 rounded-l-lg transition-colors"
                                                    disabled={item.quantity <= 1}
                                                    aria-label="Decrease quantity"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="px-4 py-2 font-semibold min-w-[3rem] text-center text-gray-900 dark:text-white">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-lg transition-colors"
                                                    aria-label="Increase quantity"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Price */}
                                        <div className="text-right">
                                            <div className="text-xl font-bold text-gray-900 dark:text-white">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                ${item.price.toFixed(2)} each
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 sticky top-8">
                        <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
                            Order Summary
                        </h2>
                        
                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 dark:text-gray-400">Subtotal ({itemCount} item{itemCount !== 1 ? "s" : ""})</span>
                                <span className="font-semibold text-gray-900 dark:text-white">${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                                <span className="text-green-600 dark:text-green-400 font-semibold">FREE</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 dark:text-gray-400">Tax</span>
                                <span className="font-semibold text-gray-900 dark:text-white">Calculated at checkout</span>
                            </div>
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                                    <span className="text-2xl font-bold text-gray-900 dark:text-white">${subtotal.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        <Link href="/checkout" className="block w-full">
                            <Button className="w-full py-4 text-lg font-bold rounded-xl bg-black dark:bg-white text-white dark:text-black hover:opacity-90 transition-opacity shadow-lg">
                                Proceed to Checkout
                            </Button>
                        </Link>

                        <div className="mt-4 text-center">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Secure checkout with SSL encryption
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
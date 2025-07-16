"use client";
import { useCart } from "../cart-context";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ChevronDown, ChevronUp, Shield, CreditCard, Lock, Gift, MapPin, User, Mail, Phone, Building } from "lucide-react";

const countries = ["Egypt", "United States", "United Kingdom", "Germany", "France", "Canada"];

export default function CheckoutPage() {
    const { cart } = useCart();
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const [donation, setDonation] = useState(10);
    const [country, setCountry] = useState("Egypt");
    const [promoOpen, setPromoOpen] = useState(false);
    const [promoCode, setPromoCode] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("card");

    const shipping = 0; // Free shipping
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + donation + shipping + tax;

    return (
        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-8 min-h-screen">
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    CHRONOS
                </h1>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Shield className="w-4 h-4" />
                    <span>Secure Checkout</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Checkout Form */}
                <section className="lg:col-span-3 space-y-8">
                    {/* Express Checkout */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                Express Checkout
                            </span>
                            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                        </div>

                        <div className="space-y-3">
                            <Button className="w-full bg-black dark:bg-white text-white dark:text-black py-4 text-base font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg">
                                <div className="flex items-center justify-center gap-3">
                                    <div className="w-6 h-6 bg-white dark:bg-black rounded flex items-center justify-center">
                                        <span className="text-xs font-bold text-black dark:text-white">G</span>
                                    </div>
                                    Pay with Google Pay
                                </div>
                            </Button>

                            <Button className="w-full bg-blue-600 text-white py-4 text-base font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg">
                                <div className="flex items-center justify-center gap-3">
                                    <CreditCard className="w-5 h-5" />
                                    Pay with Apple Pay
                                </div>
                            </Button>
                        </div>

                        <div className="flex items-center gap-4 my-6">
                            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                            <span className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                or continue with
                            </span>
                            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                                <Mail className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Contact Information</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="Enter your email address"
                                    className="w-full px-4 py-4 pl-12 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                                <Mail className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                            </div>

                            <label className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                                <input type="checkbox" className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" defaultChecked />
                                <span>Keep me updated about new releases and special offers</span>
                            </label>
                        </div>
                    </div>

                    {/* Shipping Information */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                                <MapPin className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Shipping Address</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="relative">
                                <select
                                    value={country}
                                    onChange={e => setCountry(e.target.value)}
                                    className="w-full px-4 py-4 pl-12 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
                                >
                                    {countries.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                                <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                                <ChevronDown className="absolute right-4 top-4 w-5 h-5 text-gray-400" />
                            </div>

                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Full name"
                                    className="w-full px-4 py-4 pl-12 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                                <User className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                            </div>

                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Street address"
                                    className="w-full px-4 py-4 pl-12 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                                <Building className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Apartment, suite, etc."
                                    className="px-4 py-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                                <input
                                    type="text"
                                    placeholder="City"
                                    className="px-4 py-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="State/Province"
                                    className="px-4 py-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                                <input
                                    type="text"
                                    placeholder="Postal code"
                                    className="px-4 py-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>

                            <div className="relative">
                                <input
                                    type="tel"
                                    placeholder="Phone number"
                                    className="w-full px-4 py-4 pl-12 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                                <Phone className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                            </div>
                        </div>
                    </div>

                    {/* Optional Message & Donation */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                                <Gift className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Optional Message & Donation</h2>
                        </div>

                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Your name or nickname (optional)"
                                className="w-full px-4 py-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />

                            <textarea
                                placeholder="Leave a message or ask a question (optional)"
                                rows={3}
                                className="w-full px-4 py-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                            />

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                    Support our mission (optional)
                                </label>
                                <div className="flex flex-wrap gap-3">
                                    {[3, 10, 20].map(val => (
                                        <button
                                            key={val}
                                            onClick={() => setDonation(val)}
                                            className={`px-6 py-3 rounded-xl font-semibold transition-all ${donation === val
                                                    ? "bg-blue-600 text-white shadow-lg transform scale-105"
                                                    : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
                                                }`}
                                        >
                                            ${val}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setDonation(0)}
                                        className={`px-6 py-3 rounded-xl font-semibold transition-all ${donation === 0
                                                ? "bg-blue-600 text-white shadow-lg transform scale-105"
                                                : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
                                            }`}
                                    >
                                        No donation
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                                <CreditCard className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Payment Method</h2>
                        </div>

                        <div className="space-y-4">
                            <label className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                                <input type="checkbox" className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" defaultChecked />
                                <span>Use shipping address for billing</span>
                            </label>

                            <div className="space-y-3">
                                <label className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="card"
                                        checked={paymentMethod === "card"}
                                        onChange={e => setPaymentMethod(e.target.value)}
                                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                    />
                                    <CreditCard className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                    <span className="font-medium text-gray-900 dark:text-white">Credit/Debit Card</span>
                                </label>

                                <label className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="paypal"
                                        checked={paymentMethod === "paypal"}
                                        onChange={e => setPaymentMethod(e.target.value)}
                                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                    />
                                    <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center">
                                        <span className="text-white text-xs font-bold">P</span>
                                    </div>
                                    <span className="font-medium text-gray-900 dark:text-white">PayPal</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Complete Order Button */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                        <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-6 text-lg font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg transform hover:scale-105">
                            <div className="flex items-center justify-center gap-3">
                                <Lock className="w-5 h-5" />
                                Complete Order • ${total.toFixed(2)}
                            </div>
                        </Button>

                        <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-500 dark:text-gray-400">
                            <Shield className="w-4 h-4" />
                            <span>Your payment information is secure and encrypted</span>
                        </div>
                    </div>
                </section>

                {/* Order Summary */}
                <aside className="lg:col-span-2">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm sticky top-28">
                        <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Order Summary</h2>

                        {/* Cart Items */}
                        <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                            {cart.map((item) => (
                                <div key={item.id} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                                    <div className="w-16 h-16 relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                                        <Image
                                            src={item.image_url || "/placeholder.png"}
                                            alt={item.name}
                                            fill
                                            style={{ objectFit: "cover" }}
                                            className="rounded-xl"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                                            {item.name}
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                            Black, 15oz • Qty: {item.quantity}
                                        </div>
                                    </div>
                                    <div className="font-bold text-sm text-gray-900 dark:text-white">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Promo Code */}
                        <div className="mb-6">
                            <button
                                onClick={() => setPromoOpen(!promoOpen)}
                                className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                            >
                                <span>Have a promo code?</span>
                                {promoOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>

                            {promoOpen && (
                                <div className="mt-3 flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Enter code"
                                        value={promoCode}
                                        onChange={e => setPromoCode(e.target.value)}
                                        className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <Button className="px-4 py-2 text-sm bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:opacity-90">
                                        Apply
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Order Totals */}
                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Subtotal ({itemCount} items)</span>
                                <span className="font-semibold text-gray-900 dark:text-white">${subtotal.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                                <span className="text-green-600 dark:text-green-400 font-semibold">FREE</span>
                            </div>

                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Tax</span>
                                <span className="font-semibold text-gray-900 dark:text-white">${tax.toFixed(2)}</span>
                            </div>

                            {donation > 0 && (
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Donation</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">${donation.toFixed(2)}</span>
                                </div>
                            )}

                            <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                                    <span className="text-2xl font-bold text-gray-900 dark:text-white">${total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Security Badge */}
                        <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                            <div className="flex items-center justify-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                                <Lock className="w-4 h-4" />
                                <span>SSL secured checkout</span>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </main>
    );
}
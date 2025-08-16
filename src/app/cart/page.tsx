"use client";
import { useCart } from "../cart-context";
import Link from "next/link";
import { ThumbnailImage } from "@/components/ui/optimized-image";
import { Button } from "@/components/ui/button";
import { Minus, Plus, X, ShoppingBag, ArrowLeft, Trash2 } from "lucide-react";

export default function CartPage() {
    const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
    const subtotal = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    if (cart.length === 0) {
        return (
            <main className="w-full max-w-4xl mx-auto py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8 min-h-screen flex items-center justify-center">
                <div className="text-center max-w-md mx-auto">
                    <div className="w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 mx-auto mb-6 sm:mb-8 bg-muted rounded-full flex items-center justify-center">
                        <ShoppingBag className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 text-gray-400" />
                    </div>
                    <h1 className="text-2xl xs:text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 text-foreground leading-tight">
                        Your cart is empty
                    </h1>
                    <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
                        Start adding some items to your cart!
                    </p>
                    <Link href="/">
                        <Button className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-lg sm:rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-opacity shadow-lg">
                            Start Shopping
                        </Button>
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="w-full max-w-7xl mx-auto py-6 sm:py-8 md:py-12 px-4 sm:px-6 md:px-8 min-h-screen">
            {/* Header */}
            <div className="mb-6 sm:mb-8 md:mb-12">
                <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
                    <Link
                        href="/"
                        className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground hover:text-foreground transition-colors p-2 -ml-2 rounded-lg hover:bg-muted"
                    >
                        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="text-sm sm:text-base font-medium">
                            Continue Shopping
                        </span>
                    </Link>
                </div>
                <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-foreground leading-tight">
                    Shopping Cart
                </h1>
                <div className="flex items-center justify-between gap-2 flex-wrap">
                    <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
                        {itemCount} item{itemCount !== 1 ? "s" : ""} in your cart
                    </p>
                    {cart.length > 0 && (
                        <button
                            onClick={clearCart}
                            className="flex items-center gap-1 text-xs sm:text-sm text-destructive border border-destructive/20 hover:bg-destructive/10 font-medium transition-colors rounded-lg px-3 sm:px-4 py-2 shadow-sm"
                        >
                            <Trash2 className="w-4 h-4" />
                            <span>Clear Cart</span>
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8 md:gap-10 xl:gap-12">
                {/* Cart Items */}
                <div className="xl:col-span-2 space-y-4 sm:space-y-6">
                    {cart.map((item) => (
                        // -- START OF MODIFIED SECTION --
                        <div
                            key={item.id}
                            className="group bg-card rounded-xl sm:rounded-2xl border border-border shadow-sm hover:shadow-lg transition-shadow p-4 sm:p-5 flex flex-row gap-4 sm:gap-6 relative overflow-hidden"
                        >
                            {/* Product Image */}
                            <div className="flex-shrink-0">
                                <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 relative rounded-lg sm:rounded-xl overflow-hidden bg-muted border border-border">
                                    <ThumbnailImage
                                        src={item.image_url || "/placeholder.png"}
                                        alt={item.name}
                                        fill
                                        style={{ objectFit: "cover" }}
                                        className="rounded-lg sm:rounded-xl"
                                    />
                                </div>
                            </div>

                            {/* Product Details - Re-architected for better mobile view */}
                            <div className="flex flex-1 flex-col justify-between min-w-0">
                                {/* Top Part: Name and Remove Button */}
                                <div className="flex justify-between items-start gap-2 mb-2">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-base sm:text-lg md:text-xl text-card-foreground leading-tight truncate">
                                            {item.name}
                                        </h3>
                                        <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                                            Black, 15oz {/* Example variant */}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                                        aria-label="Remove item"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Bottom Part: Quantity and Price */}
                                <div className="flex justify-between items-end mt-auto">
                                    {/* Quantity Controls */}
                                    <div className="flex flex-row items-center gap-1 bg-muted/50 border border-border rounded-lg p-1">
                                        <button
                                            onClick={() =>
                                                updateQuantity(item.id, Math.max(1, item.quantity - 1))
                                            }
                                            className="p-1.5 hover:bg-muted disabled:opacity-50 rounded transition-colors"
                                            disabled={item.quantity <= 1}
                                            aria-label="Decrease quantity"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="px-2 font-semibold min-w-[2.25rem] text-center text-card-foreground text-base">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="p-1.5 hover:bg-muted rounded transition-colors"
                                            aria-label="Increase quantity"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Price */}
                                    <div className="text-right">
                                        <div className="text-lg sm:text-xl font-bold text-card-foreground">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </div>
                                        {item.quantity > 1 && (
                                            <div className="text-xs sm:text-sm text-muted-foreground">
                                                ${item.price.toFixed(2)} each
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        // -- END OF MODIFIED SECTION --
                    ))}
                </div>

                {/* Order Summary */}
                <div className="xl:col-span-1">
                    <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-border sticky top-4 sm:top-6 md:top-8">
                        <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 text-card-foreground">
                            Order Summary
                        </h2>

                        <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                            <div className="flex justify-between items-center">
                                <span className="text-sm sm:text-base text-muted-foreground">
                                    Subtotal ({itemCount} item{itemCount !== 1 ? "s" : ""})
                                </span>
                                <span className="font-semibold text-sm sm:text-base text-card-foreground">
                                    ${subtotal.toFixed(2)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm sm:text-base text-muted-foreground">
                                    Shipping
                                </span>
                                <span className="text-green-600 dark:text-green-400 font-semibold text-sm sm:text-base">
                                    FREE
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm sm:text-base text-muted-foreground">
                                    Tax
                                </span>
                                <span className="font-semibold text-xs sm:text-sm text-card-foreground">
                                    Calculated at checkout
                                </span>
                            </div>
                            <div className="border-t border-border pt-3 sm:pt-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-base sm:text-lg md:text-xl font-bold text-card-foreground">
                                        Total
                                    </span>
                                    <span className="text-xl sm:text-2xl md:text-3xl font-bold text-card-foreground">
                                        ${subtotal.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <Link href="/checkout" className="block w-full">
                            <Button className="w-full py-3 sm:py-4 md:py-5 text-sm sm:text-base md:text-lg font-bold rounded-lg sm:rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-opacity shadow-lg">
                                Proceed to Checkout
                            </Button>
                        </Link>

                        <div className="mt-3 sm:mt-4 text-center">
                            <p className="text-xs sm:text-sm text-muted-foreground">
                                Secure checkout with SSL encryption
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

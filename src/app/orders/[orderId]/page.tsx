"use client";

import { useAuth } from '../../auth-context';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Package, Truck, MapPin, Calendar, CreditCard, ChevronDown, ChevronUp } from 'lucide-react';
import { AccountSkeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabaseClient';
import Image from 'next/image';

type OrderItem = {
  id: string;
  product_id: string;
  product_name: string;
  product_price: number;
  quantity: number;
  total_price: number;
};

type Order = {
  id: string;
  order_number: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  created_at: string;
  notes?: string;
  shipping_address_id?: string;
  billing_address_id?: string;
};

type Address = {
  id: string;
  full_name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string;
};

export default function OrderDetailsPage({ params }: { params: { orderId: string } }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [shippingAddress, setShippingAddress] = useState<Address | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && params.orderId) {
      fetchOrderDetails(params.orderId);
    }
  }, [user, params.orderId]);

  const fetchOrderDetails = async (orderId: string) => {
    setIsLoading(true);
    try {
      // Fetch order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (orderError) throw orderError;
      setOrder(orderData);

      // Fetch order items
      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId);

      if (itemsError) throw itemsError;
      setOrderItems(itemsData || []);

      // Fetch shipping address if available
      if (orderData.shipping_address_id) {
        const { data: addressData, error: addressError } = await supabase
          .from('addresses')
          .select('*')
          .eq('id', orderData.shipping_address_id)
          .single();

        if (!addressError) {
          setShippingAddress(addressData);
        }
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  if (loading || isLoading) {
    return (
      <main className="max-w-4xl mx-auto py-16 px-4 sm:px-8 min-h-screen">
        <AccountSkeleton />
      </main>
    );
  }

  if (!user) {
    return null; // Will redirect to sign in
  }

  if (!order) {
    return (
      <main className="max-w-4xl mx-auto py-16 px-4 sm:px-8 min-h-screen">
        <Link href="/orders" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-6">
          <ArrowLeft className="w-5 h-5" />
          Back to Orders
        </Link>
        
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-8 text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Order Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The order you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Button 
            onClick={() => router.push('/orders')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200"
          >
            View All Orders
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto py-16 px-4 sm:px-8 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <Link href="/orders" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-6">
          <ArrowLeft className="w-5 h-5" />
          Back to Orders
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Order {order.order_number}
            </h1>
            <div className="flex items-center gap-3">
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                Placed on {formatDate(order.created_at)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Order Items</h2>
            
            <div className="space-y-6">
              {orderItems.map((item) => (
                <div key={item.id} className="flex gap-4 pb-6 border-b border-gray-200 dark:border-gray-700 last:border-0 last:pb-0">
                  <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Package className="w-10 h-10 text-gray-400" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {item.product_name}
                      </h3>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        ${item.total_price.toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        ${item.product_price.toFixed(2)} × {item.quantity}
                      </div>
                      
                      <Link 
                        href={`/products/${item.product_id}`}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        View Product
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Information */}
          {shippingAddress && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Shipping Address</h2>
              </div>
              
              <div className="space-y-1 text-gray-700 dark:text-gray-300">
                <p className="font-medium">{shippingAddress.full_name}</p>
                <p>{shippingAddress.address_line1}</p>
                {shippingAddress.address_line2 && <p>{shippingAddress.address_line2}</p>}
                <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.postal_code}</p>
                <p>{shippingAddress.country}</p>
                {shippingAddress.phone && <p className="mt-2">{shippingAddress.phone}</p>}
              </div>
            </div>
          )}

          {/* Order Notes */}
          {order.notes && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Order Notes</h2>
              <p className="text-gray-700 dark:text-gray-300">{order.notes}</p>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 sticky top-20">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span className="text-gray-900 dark:text-white font-medium">${order.subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {order.shipping > 0 ? `$${order.shipping.toFixed(2)}` : 'Free'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Tax</span>
                <span className="text-gray-900 dark:text-white font-medium">${order.tax.toFixed(2)}</span>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                <div className="flex justify-between">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Order Timeline */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button 
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center justify-between w-full text-left"
              >
                <span className="text-lg font-bold text-gray-900 dark:text-white">Order Details</span>
                {showDetails ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>
              
              {showDetails && (
                <div className="mt-4 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Order Placed</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{formatDate(order.created_at)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <CreditCard className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Payment</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Paid via Credit Card</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${order.status === 'shipped' || order.status === 'delivered' ? 'bg-purple-100 dark:bg-purple-900/20' : 'bg-gray-100 dark:bg-gray-800'}`}>
                      <Truck className={`w-4 h-4 ${order.status === 'shipped' || order.status === 'delivered' ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400'}`} />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Shipping</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {order.status === 'shipped' || order.status === 'delivered' ? 'Shipped' : 'Pending'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${order.status === 'delivered' ? 'bg-green-100 dark:bg-green-900/20' : 'bg-gray-100 dark:bg-gray-800'}`}>
                      <Package className={`w-4 h-4 ${order.status === 'delivered' ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`} />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Delivery</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {order.status === 'delivered' ? 'Delivered' : 'Pending'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Need Help */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Need Help?</h3>
              <Button className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium rounded-xl transition-all duration-200">
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
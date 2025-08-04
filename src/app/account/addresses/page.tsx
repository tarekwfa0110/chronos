"use client";

import { useAuth } from '../../auth-context';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, MapPin, Plus, Edit, Trash2, Check } from 'lucide-react';
import { AccountSkeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabaseClient';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addressSchema, AddressFormData } from '@/lib/validation';
import { toast } from 'sonner';

type Address = {
  id: string;
  user_id: string;
  type: 'shipping' | 'billing' | 'both';
  is_default: boolean;
  full_name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string;
};

export default function AddressesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const supabase = createClient();

  const fetchAddresses = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAddresses(data || []);
    } catch (error: unknown) {
      const message = typeof error === 'object' && error && 'message' in error
        ? (error as { message?: string }).message
        : String(error);
      console.error('Error fetching addresses:', message);
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchAddresses();
    }
  }, [user, fetchAddresses]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    mode: 'onChange',
  });

  useEffect(() => {
    if (editingAddress) {
      setValue('firstName', editingAddress.full_name.split(' ')[0] || '');
      setValue('lastName', editingAddress.full_name.split(' ').slice(1).join(' ') || '');
      setValue('addressLine1', editingAddress.address_line1);
      setValue('addressLine2', editingAddress.address_line2 || '');
      setValue('city', editingAddress.city);
      setValue('state', editingAddress.state);
      setValue('postalCode', editingAddress.postal_code);
      setValue('country', editingAddress.country);
      setValue('phone', editingAddress.phone || '');
      setValue('isDefault', editingAddress.is_default);
    } else {
      reset({
        firstName: '',
        lastName: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'Egypt',
        phone: '',
        isDefault: false,
        company: '',
      });
    }
  }, [editingAddress, setValue, reset]);

  const onSubmit = async (data: AddressFormData) => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      const fullName = `${data.firstName} ${data.lastName}`.trim();
      
      const addressData = {
        user_id: user.id,
        type: 'both', // Default type
        is_default: data.isDefault,
        full_name: fullName,
        address_line1: data.addressLine1,
        address_line2: data.addressLine2 || null,
        city: data.city,
        state: data.state,
        postal_code: data.postalCode,
        country: data.country,
        phone: data.phone || null
      };

      let result;
      
      if (editingAddress) {
        // Update existing address
        result = await supabase
          .from('addresses')
          .update(addressData)
          .eq('id', editingAddress.id);
        
        if (result.error) throw result.error;
        toast.success('Address updated successfully');
      } else {
        // Create new address
        result = await supabase
          .from('addresses')
          .insert(addressData);
        
        if (result.error) throw result.error;
        toast.success('Address added successfully');
      }

      // If this is set as default, update other addresses to not be default
      if (data.isDefault) {
        const updatePromises = addresses
          .filter(addr => addr.id !== (editingAddress?.id || 'new'))
          .map(addr => {
            return supabase
              .from('addresses')
              .update({ is_default: false })
              .eq('id', addr.id);
          });
        
        await Promise.all(updatePromises);
      }

      // Refresh addresses
      fetchAddresses();
      setShowAddressModal(false);
      setEditingAddress(null);
    } catch (error: unknown) {
      const message = typeof error === 'object' && error && 'message' in error
        ? (error as { message?: string }).message
        : String(error);
      toast.error(message || 'Failed to save address');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setAddresses(addresses.filter(addr => addr.id !== id));
      setShowDeleteConfirm(null);
      toast.success('Address deleted successfully');
    } catch (error: unknown) {
      const message = typeof error === 'object' && error && 'message' in error
        ? (error as { message?: string }).message
        : String(error);
      toast.error(message || 'Failed to delete address');
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      // Set the selected address as default
      await supabase
        .from('addresses')
        .update({ is_default: true })
        .eq('id', id);
      
      // Set all other addresses as non-default
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .neq('id', id);
      
      // Refresh addresses
      fetchAddresses();
      toast.success('Default address updated');
    } catch (error: unknown) {
      const message = typeof error === 'object' && error && 'message' in error
        ? (error as { message?: string }).message
        : String(error);
      toast.error(message || 'Failed to update default address');
    }
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

  return (
    <main className="max-w-4xl mx-auto py-16 px-4 sm:px-8 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <Link href="/account" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-6">
          <ArrowLeft className="w-5 h-5" />
          Back to Account
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Addresses</h1>
            <p className="text-gray-600 dark:text-gray-400">
              {addresses.length} {addresses.length === 1 ? 'address' : 'addresses'} saved
            </p>
          </div>
          
          <Button 
            onClick={() => {
              setEditingAddress(null);
              setShowAddressModal(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Address
          </Button>
        </div>
      </div>

      {/* Addresses List */}
      {addresses.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-gray-500 dark:text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            No addresses saved yet
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Add your shipping and billing addresses for faster checkout
          </p>
          <Button 
            onClick={() => {
              setEditingAddress(null);
              setShowAddressModal(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Address
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((address) => (
            <div 
              key={address.id} 
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {address.full_name}
                    </h3>
                    {address.is_default && (
                      <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                        Default
                      </span>
                    )}
                  </div>
                  
                  <div className="text-gray-700 dark:text-gray-300 space-y-1">
                    <p>{address.address_line1}</p>
                    {address.address_line2 && <p>{address.address_line2}</p>}
                    <p>{address.city}, {address.state} {address.postal_code}</p>
                    <p>{address.country}</p>
                    {address.phone && <p className="mt-1">{address.phone}</p>}
                  </div>
                </div>
                
                <div className="flex flex-row sm:flex-col gap-2 self-end sm:self-start">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingAddress(address);
                      setShowAddressModal(true);
                    }}
                    className="text-gray-700 dark:text-gray-300"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  
                  {!address.is_default && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefault(address.id)}
                      className="text-green-700 dark:text-green-300"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Set Default
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(address.id)}
                    className="text-red-700 dark:text-red-300"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
              
              {/* Delete Confirmation */}
              {showDeleteConfirm === address.id && (
                <div className="mt-4 p-4 border border-red-300 dark:border-red-800 rounded-xl bg-red-50 dark:bg-red-900/10">
                  <p className="text-red-600 dark:text-red-400 font-medium mb-3">
                    Are you sure you want to delete this address?
                  </p>
                  <div className="flex gap-3">
                    <Button
                      size="sm"
                      onClick={() => handleDeleteAddress(address.id)}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      Yes, Delete
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowDeleteConfirm(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Address Modal */}
      <Dialog open={showAddressModal} onOpenChange={setShowAddressModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingAddress ? 'Edit Address' : 'Add New Address'}</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  {...register('firstName')}
                  placeholder="John"
                />
                {errors.firstName && (
                  <p className="text-sm text-red-600">{errors.firstName.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  {...register('lastName')}
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <p className="text-sm text-red-600">{errors.lastName.message}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="addressLine1">Address Line 1</Label>
              <Input
                id="addressLine1"
                {...register('addressLine1')}
                placeholder="123 Main St"
              />
              {errors.addressLine1 && (
                <p className="text-sm text-red-600">{errors.addressLine1.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
              <Input
                id="addressLine2"
                {...register('addressLine2')}
                placeholder="Apt 4B"
              />
              {errors.addressLine2 && (
                <p className="text-sm text-red-600">{errors.addressLine2.message}</p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  {...register('city')}
                  placeholder="Cairo"
                />
                {errors.city && (
                  <p className="text-sm text-red-600">{errors.city.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="state">State/Province</Label>
                <Input
                  id="state"
                  {...register('state')}
                  placeholder="Cairo Governorate"
                />
                {errors.state && (
                  <p className="text-sm text-red-600">{errors.state.message}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  {...register('postalCode')}
                  placeholder="12345"
                />
                {errors.postalCode && (
                  <p className="text-sm text-red-600">{errors.postalCode.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  {...register('country')}
                  placeholder="Egypt"
                />
                {errors.country && (
                  <p className="text-sm text-red-600">{errors.country.message}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number (Optional)</Label>
              <Input
                id="phone"
                {...register('phone')}
                placeholder="+20 123 456 7890"
              />
              {errors.phone && (
                <p className="text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isDefault"
                {...register('isDefault', { required: true })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <Label htmlFor="isDefault" className="text-sm font-normal">
                Set as default address
              </Label>
            </div>
            
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAddressModal(false);
                  setEditingAddress(null);
                }}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Address'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
}
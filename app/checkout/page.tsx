'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/store/cart-store';
import { CheckoutForm } from '@/components/checkout/checkout-form';
import { OrderSummary } from '@/components/checkout/order-summary';
import { loadStripe } from '@stripe/stripe-js';
import { createCheckoutSession } from '@/lib/checkout';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK || '');

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalAmount, clearCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const [profileDefaults, setProfileDefaults] = useState({});
  const [profileLoading, setProfileLoading] = useState(true);
  
  useEffect(() => {
    async function fetchProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        if (data) {
          setProfileDefaults({
            email: user.email,
            phone: data.phone || '',
            firstName: data.first_name || '',
            lastName: data.last_name || '',
            address: data.address || '',
            apartment: data.apartment || '',
            city: data.city || '',
            state: data.state || '',
            zipCode: data.zip_code || '',
            country: data.country || '',
          });
        }
      }
      setProfileLoading(false);
    }
    fetchProfile();
  }, []);
  
  const onCheckout = async (formData: any) => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    
    try {
      setIsLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      const user_id = user?.id || null;
      const session = await createCheckoutSession({
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          size: item.selectedSize,
        })),
        customerInfo: formData,
        user_id,
      });
      
      const stripe = await stripePromise;
      
      if (stripe && session.id) {
        const { error } = await stripe.redirectToCheckout({
          sessionId: session.id,
        });
        
        if (error) {
          toast.error(error.message || "Something went wrong with the checkout process");
        }
      }
    } catch (error) {
      toast.error("An error occurred during checkout");
      console.error("Checkout error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          {!profileLoading && (
            <CheckoutForm
              onSubmit={onCheckout}
              isLoading={isLoading}
              defaultValues={profileDefaults}
            />
          )}
        </div>
        
        <div>
          <OrderSummary />
        </div>
      </div>
    </div>
  );
}
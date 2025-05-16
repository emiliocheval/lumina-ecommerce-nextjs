'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/lib/store/cart-store';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CheckoutSuccessPage() {
  const { clearCart } = useCartStore();
  
  useEffect(() => {
    // Clear the cart upon successful checkout
    clearCart();
  }, [clearCart]);
  
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
      <div className="bg-green-100 dark:bg-green-900/20 rounded-full p-6 mb-6">
        <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
      </div>
      <h1 className="text-3xl font-bold mb-2">Thank you for your order!</h1>
      <p className="text-muted-foreground mb-6 max-w-md">
        We've received your order and are processing it now. You'll receive a confirmation email shortly.
      </p>
      <div className="flex gap-4">
        <Link href="/products">
          <Button variant="outline">Continue Shopping</Button>
        </Link>
        <Link href="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}
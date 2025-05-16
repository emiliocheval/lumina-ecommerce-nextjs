'use client';

import { useEffect, useState } from 'react';
import { useCartStore } from '@/lib/store/cart-store';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

export default function CartSummary() {
  const { items, totalAmount } = useCartStore();
  const [mounted, setMounted] = useState(false);
  
  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return null;
  
  // Calculate order summary values
  const subtotal = totalAmount();
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + shipping;
  
  return (
    <div className="bg-muted rounded-lg p-6 sticky top-20">
      <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
      
      {/* Summary Items */}
      <div className="space-y-3 mb-4">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span>
            {shipping === 0 ? 'Free' : formatCurrency(shipping)}
          </span>
        </div>
        
        <Separator />
        
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>
      
      {/* Free Shipping Message */}
      {subtotal < 100 && (
        <div className="text-sm bg-primary/10 text-primary p-3 rounded mb-4">
          Add {formatCurrency(100 - subtotal)} more to qualify for free shipping!
        </div>
      )}
      
      {/* Checkout Button */}
      <Link href="/checkout">
        <Button className="w-full">
          Proceed to Checkout
        </Button>
      </Link>
    </div>
  );
}
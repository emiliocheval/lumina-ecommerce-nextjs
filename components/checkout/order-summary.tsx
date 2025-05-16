'use client';

import { useEffect, useState } from 'react';
import { useCartStore } from '@/lib/store/cart-store';
import { formatCurrency } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CreditCard, ShieldCheck } from 'lucide-react';

export function OrderSummary() {
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
  const tax = Math.round(subtotal * 0.07 * 100) / 100;  // 7% tax rate
  const total = subtotal + shipping + tax;
  
  return (
    <div className="bg-card rounded-lg p-6 shadow-sm border sticky top-20">
      <h3 className="text-lg font-medium mb-4">Order Summary</h3>
      
      {/* Order Items */}
      <div className="space-y-4 max-h-80 overflow-y-auto pb-2">
        {items.map((item) => (
          <div key={`${item.id}-${item.selectedSize}`} className="flex gap-3">
            <div className="relative h-16 w-16 rounded bg-muted flex-shrink-0">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover rounded"
              />
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full h-5 w-5 text-xs flex items-center justify-center">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm line-clamp-1">{item.name}</p>
              {item.selectedSize && (
                <p className="text-xs text-muted-foreground">Size: {item.selectedSize}</p>
              )}
              <p className="text-sm">{formatCurrency(item.salePrice || item.price)}</p>
            </div>
          </div>
        ))}
      </div>
      
      <Separator className="my-4" />
      
      {/* Summary Calculation */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span>
            {shipping === 0 ? 'Free' : formatCurrency(shipping)}
          </span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Tax (7%)</span>
          <span>{formatCurrency(tax)}</span>
        </div>
      </div>
      
      <Separator className="my-4" />
      
      {/* Total */}
      <div className="flex justify-between font-medium">
        <span>Total</span>
        <span>{formatCurrency(total)}</span>
      </div>
      
      {/* Secure Checkout Badge */}
      <div className="mt-6 bg-muted/50 p-3 rounded-md flex items-center gap-2">
        <ShieldCheck className="h-5 w-5 text-green-600" />
        <div className="text-xs">
          <p className="font-medium">Secure Checkout</p>
          <p className="text-muted-foreground">Your payment information is protected</p>
        </div>
      </div>
      
      {/* Payment Methods */}
      <div className="mt-4 flex items-center gap-2">
        <CreditCard className="h-4 w-4 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">Powered by Stripe</span>
      </div>
      
      {/* Continue Shopping Link */}
      <div className="mt-6">
        <Link href="/cart">
          <Button variant="ghost" size="sm" className="gap-1 w-full">
            <ArrowLeft className="h-4 w-4" />
            Return to Cart
          </Button>
        </Link>
      </div>
    </div>
  );
}
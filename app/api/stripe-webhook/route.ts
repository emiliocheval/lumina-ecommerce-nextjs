import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  console.log('Received Stripe webhook event:', event.type);

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log('Checkout session completed:', session);

    const { id, amount_total, customer_email, metadata } = session;
    const user_id = metadata?.user_id || null;

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          stripe_session_id: id,
          total: amount_total ? amount_total / 100 : null,
          status: 'paid',
          user_id,
          customer_email,
        },
      ])
      .select()
      .single();
    if (orderError) {
      console.error('Order insert error:', orderError.message);
      return NextResponse.json({ error: orderError.message }, { status: 500 });
    }
    console.log('Order inserted:', order);

    // 2. Fetch line items from Stripe and insert order_items
    try {
      const lineItems = await stripe.checkout.sessions.listLineItems(id, { expand: ['data.price.product'] });
      const orderItems = lineItems.data.map(item => {
        let product_id = null;
        const priceProduct = item.price?.product;
        if (typeof priceProduct === 'object' && priceProduct !== null && 'metadata' in priceProduct) {
          product_id = (priceProduct as any).metadata?.product_id || null;
        }
        return {
          order_id: order.id,
          product_id,
          quantity: item.quantity,
          price: item.amount_total ? item.amount_total / 100 : null,
        };
      });
      const { error: orderItemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
      if (orderItemsError) {
        console.error('Order items insert error:', orderItemsError.message);
        // Don't fail the webhook, just log
      } else {
        console.log('Order items inserted:', orderItems);
      }
    } catch (err: any) {
      console.error('Failed to fetch line items for session:', id, err.message);
      // Don't fail the webhook, just log
    }
  }

  return NextResponse.json({ received: true });
}

export const config = {
  api: {
    bodyParser: false,
  },
}; 
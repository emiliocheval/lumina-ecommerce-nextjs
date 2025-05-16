import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(req: NextRequest) {
  const { items, user_id } = await req.json(); // items: [{ name, price, quantity }], user_id from frontend
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map((item: any) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            metadata: { product_id: item.id },
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${req.nextUrl.origin}/checkout/success`,
      cancel_url: `${req.nextUrl.origin}/cart`,
      metadata: {
        user_id: user_id || '',
      },
    });
    return NextResponse.json({ id: session.id });
  } catch (err: any) {
    console.error('Stripe checkout session error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 
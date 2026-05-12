import { NextResponse } from "next/server";
import { z } from "zod";
import { CREDIT_PRICE_USD } from "@/lib/engine/costs";

const CheckoutSchema = z.object({
  businessId: z.string().min(1),
  credits: z.number().int().min(5).max(500)
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = CheckoutSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid checkout request", details: parsed.error.flatten() }, { status: 400 });
  }

  const amountUsd = parsed.data.credits * CREDIT_PRICE_USD;

  // Replace this with Stripe Checkout Session creation once STRIPE_SECRET_KEY is live.
  return NextResponse.json({
    checkoutMode: "mock",
    businessId: parsed.data.businessId,
    credits: parsed.data.credits,
    amountUsd,
    stripeCheckoutUrl: `/mock-checkout?credits=${parsed.data.credits}&amount=${amountUsd}`
  });
}

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@daracademy/database";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    console.error("[Stripe Webhook] Missing stripe-signature header");
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 },
    );
  }

  if (!webhookSecret) {
    console.error("[Stripe Webhook] STRIPE_WEBHOOK_SECRET not configured");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 },
    );
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret,
    );

    console.log("[Stripe Webhook] Received event:", event.type);

    switch (event.type) {
      case "charge.succeeded": {
        const charge = event.data.object as Stripe.Charge;
        const paymentIntentId = charge.payment_intent as string;

        if (paymentIntentId) {
          const updated = await prisma.payment.updateMany({
            where: { stripeSessionId: paymentIntentId },
            data: { status: "COMPLETED" },
          });
          console.log(
            "[Stripe Webhook] Updated payments on charge.succeeded:",
            updated.count,
          );
        }
        break;
      }

      case "charge.failed": {
        const charge = event.data.object as Stripe.Charge;
        const paymentIntentId = charge.payment_intent as string;

        if (paymentIntentId) {
          const updated = await prisma.payment.updateMany({
            where: { stripeSessionId: paymentIntentId },
            data: { status: "FAILED" },
          });
          console.log(
            "[Stripe Webhook] Updated payments on charge.failed:",
            updated.count,
          );
        }
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        const paymentIntentId = charge.payment_intent as string;

        if (paymentIntentId) {
          const updated = await prisma.payment.updateMany({
            where: { stripeSessionId: paymentIntentId },
            data: { status: "REFUNDED" },
          });
          console.log(
            "[Stripe Webhook] Updated payments on charge.refunded:",
            updated.count,
          );
        }
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        const updated = await prisma.payment.updateMany({
          where: { stripeSessionId: paymentIntent.id },
          data: { status: "COMPLETED" },
        });
        console.log(
          "[Stripe Webhook] Updated payments on payment_intent.succeeded:",
          updated.count,
        );
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        const updated = await prisma.payment.updateMany({
          where: { stripeSessionId: paymentIntent.id },
          data: { status: "FAILED" },
        });
        console.log(
          "[Stripe Webhook] Updated payments on payment_intent.payment_failed:",
          updated.count,
        );
        break;
      }

      default:
        console.log("[Stripe Webhook] Unhandled event type:", event.type);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[Stripe Webhook] Error processing webhook:", error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 400 },
    );
  }
}

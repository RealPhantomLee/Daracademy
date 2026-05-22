import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@daracademy/database";
import { sendEmail, SessionScheduledEmail } from "@daracademy/notifications";
import { createHmac } from "crypto";

async function verifySignature(
  signature: string,
  body: string,
): Promise<boolean> {
  const secret = process.env.CALENDLY_WEBHOOK_SECRET;

  // SECURITY: Reject unsigned webhooks if secret is not configured
  if (!secret) {
    console.error(
      "[Calendly webhook] CRITICAL: No CALENDLY_WEBHOOK_SECRET configured. Rejecting webhook.",
    );
    return false;
  }

  try {
    const hash = createHmac("sha256", secret).update(body).digest("hex");
    return signature === hash;
  } catch (error) {
    console.error("[Calendly webhook] Signature verification error:", error);
    return false;
  }
}

export async function POST(req: NextRequest) {
  const signature = req.headers.get("X-Calendly-Webhook-Signature");
  const body = await req.text();

  console.log("[Calendly webhook] Received event");

  // SECURITY: Verify signature is present and valid
  if (!signature) {
    console.error(
      "[Calendly webhook] CRITICAL: No signature provided. Rejecting webhook.",
    );
    return NextResponse.json({ error: "Missing signature" }, { status: 401 });
  }

  const isValid = await verifySignature(signature, body);
  if (!isValid) {
    console.error(
      "[Calendly webhook] CRITICAL: Invalid signature detected. Rejecting webhook.",
    );
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }
  console.log("[Calendly webhook] Signature verified");

  let event;
  try {
    event = JSON.parse(body);
  } catch (error) {
    console.error("[Calendly webhook] Failed to parse JSON:", error);
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // TODO 2: Parse event type
  if (event.event === "invitee.created") {
    const { name, email } = event.payload.invitee;
    const eventStartTime = event.payload.event_start_time;
    const eventEndTime = event.payload.event_end_time;

    console.log("[Calendly webhook] Processing invitee.created event", {
      name,
      email,
    });

    try {
      // TODO 3: Upsert TutoringSession
      const user = await prisma.user.findFirst({
        where: { email },
      });

      if (user && user.role === "STUDENT") {
        const tutorId = process.env.DEFAULT_TUTOR_ID;

        if (!tutorId) {
          console.error(
            "[Calendly webhook] DEFAULT_TUTOR_ID not configured, cannot create session",
          );
          return NextResponse.json(
            {
              error:
                "DEFAULT_TUTOR_ID environment variable not configured. Contact administrator.",
            },
            { status: 500 },
          );
        }

        const session = await prisma.tutoringSession.create({
          data: {
            studentId: user.id,
            tutorId,
            subject: "General",
            title: event.payload.event_name || "Tutoring Session",
            description: event.payload.event_name,
            startTime: new Date(eventStartTime),
            endTime: new Date(eventEndTime),
            status: "SCHEDULED",
          },
        });

        console.log("[Calendly webhook] Session created:", session.id);

        // TODO 4: Send confirmation email
        const emailResult = await sendEmail({
          to: email,
          subject: "Your Tutoring Session Has Been Scheduled!",
          react: SessionScheduledEmail({
            studentName: name,
            sessionTime: new Date(eventStartTime).toLocaleString(),
            sessionUrl: `${process.env.NEXT_PUBLIC_APP_URL || "https://daracademy.com"}/dashboard/sessions`,
          }) as React.ReactNode,
        });

        if (emailResult.success) {
          console.log("[Calendly webhook] Confirmation email sent to", email);
        } else {
          console.error(
            "[Calendly webhook] Failed to send email:",
            emailResult.error,
          );
        }
      } else {
        console.log(
          "[Calendly webhook] User not found or not a student:",
          email,
        );
      }
    } catch (error) {
      console.error(
        "[Calendly webhook] Error processing invitee.created event:",
        error,
      );
    }
  } else if (event.event === "invitee.canceled") {
    console.log("[Calendly webhook] Processing invitee.canceled event");

    try {
      // Handle cancellation: find and update session
      const eventName = event.payload.event_name;
      const inviteeEmail = event.payload.invitee.email;

      const user = await prisma.user.findFirst({
        where: { email: inviteeEmail },
      });

      if (user) {
        const updatedCount = await prisma.tutoringSession.updateMany({
          where: {
            studentId: user.id,
            title: eventName,
            status: "SCHEDULED",
          },
          data: { status: "CANCELLED" },
        });

        console.log(
          "[Calendly webhook] Cancelled",
          updatedCount.count,
          "session(s)",
        );
      }
    } catch (error) {
      console.error(
        "[Calendly webhook] Error processing invitee.canceled event:",
        error,
      );
    }
  } else {
    console.log("[Calendly webhook] Unhandled event type:", event.event);
  }

  return NextResponse.json({ received: true });
}

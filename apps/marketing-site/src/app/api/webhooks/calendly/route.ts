export async function POST(request: Request) {
  const body = await request.json();

  console.log("Calendly webhook received:", body);

  // TODO: Signature verification using CALENDLY_SIGNING_KEY
  // TODO: Parse event type (scheduling.created, scheduling.cancelled, etc.)
  // TODO: Upsert event to database
  // TODO: Send confirmation email to student/parent

  return Response.json({ received: true });
}

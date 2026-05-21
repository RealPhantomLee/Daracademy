import { Resend } from "resend";

const IS_STUB = !process.env.RESEND_API_KEY;

const resend = IS_STUB ? null : new Resend(process.env.RESEND_API_KEY);

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  react?: React.ReactNode;
  from?: string;
  replyTo?: string;
}

export async function sendEmail(
  options: SendEmailOptions,
): Promise<{ success: boolean; id?: string; error?: string }> {
  const {
    to,
    subject,
    html,
    react,
    from = "noreply@daracademy.com",
    replyTo,
  } = options;

  if (IS_STUB) {
    console.log("[EMAIL STUB]", {
      to,
      subject,
      from,
      replyTo,
      previewUrl: react ? "[React component]" : "N/A",
    });
    return { success: true, id: "stub-email-" + Date.now() };
  }

  if (!resend) {
    return {
      success: false,
      error: "Email service not configured",
    };
  }

  try {
    const response = await resend.emails.send({
      from,
      to,
      subject,
      html,
      react: react as React.ReactElement,
      reply_to: replyTo,
    });

    if (response.error) {
      return {
        success: false,
        error: response.error.message,
      };
    }

    return {
      success: true,
      id: response.data?.id,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      error: message,
    };
  }
}

export default resend;

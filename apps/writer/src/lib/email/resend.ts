import { Resend } from "resend";

let resendClient: Resend | null = null;

function getResend(): Resend {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) throw new Error("RESEND_API_KEY not configured");
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

const FROM_EMAIL =
  process.env.EMAIL_FROM ?? "NeoByteWriter <noreply@neobytestudios.com>";

export async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
}) {
  const resend = getResend();
  return resend.emails.send({
    from: FROM_EMAIL,
    to: params.to,
    subject: params.subject,
    html: params.html,
  });
}

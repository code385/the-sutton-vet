type RegistrationConfirmation = {
  email: string;
  firstName: string;
  petName: string;
  reference: string;
};

type BookingConfirmation = RegistrationConfirmation & {
  appointmentStart: string;
};

type EmailResult =
  | { sent: true; id: string }
  | { sent: false; reason: "not_configured" | "provider_error" };

const resendEndpoint = "https://api.resend.com/emails";
const defaultFrom = "The Sutton Vet <registrations@mail.thesuttonvet.co.uk>";
const defaultReplyTo = "info@thesuttonvet.co.uk";

const escapeHtml = (value: string) => value.replace(/[&<>"]/g, (character) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
}[character] || character));

const emailShell = (preview: string, title: string, content: string) => `<!doctype html>
<html lang="en">
  <head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${escapeHtml(title)}</title></head>
  <body style="margin:0;background:#f5f1f7;color:#263238;font-family:Arial,sans-serif">
    <div style="display:none;max-height:0;overflow:hidden">${escapeHtml(preview)}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f1f7;padding:32px 16px">
      <tr><td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border-radius:18px;overflow:hidden">
          <tr><td style="background:#4d186f;padding:26px 32px;color:#ffffff;font-size:22px;font-weight:700">The Sutton Vet</td></tr>
          <tr><td style="padding:32px;line-height:1.65">
            <h1 style="margin:0 0 18px;color:#4d186f;font-size:28px;line-height:1.2">${escapeHtml(title)}</h1>
            ${content}
            <p style="margin:28px 0 0;color:#596576;font-size:14px">Need help? Reply to this email or call <a href="tel:+442036030298" style="color:#4d186f">0203 603 0298</a>.</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;

async function sendEmail({
  to,
  subject,
  html,
  text,
  idempotencyKey,
}: {
  to: string;
  subject: string;
  html: string;
  text: string;
  idempotencyKey: string;
}): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    console.warn("[Transactional email] RESEND_API_KEY is not configured; confirmation email skipped.");
    return { sent: false, reason: "not_configured" };
  }

  try {
    const response = await fetch(resendEndpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": idempotencyKey.slice(0, 256),
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL?.trim() || defaultFrom,
        reply_to: process.env.RESEND_REPLY_TO?.trim() || defaultReplyTo,
        to: [to],
        subject,
        html,
        text,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });

    const payload = await response.json().catch(() => null) as { id?: string; message?: string } | null;
    if (!response.ok || !payload?.id) {
      console.error("[Transactional email] Resend rejected the message.", {
        status: response.status,
      });
      return { sent: false, reason: "provider_error" };
    }

    return { sent: true, id: payload.id };
  } catch {
    console.error("[Transactional email] Could not reach Resend.");
    return { sent: false, reason: "provider_error" };
  }
}

export async function sendVerificationCode(input: { email: string; code: string; reference: string }): Promise<EmailResult> {
  return sendEmail({
    to: input.email,
    subject: "Your Sutton Vet verification code",
    html: emailShell("Your email verification code expires in 10 minutes.", "Verify your email", `<p>Your code is:</p><p style="font-size:32px;font-weight:700;letter-spacing:6px">${escapeHtml(input.code)}</p><p>This code expires in 10 minutes and can only be used once. Do not share it. If you did not request it, you can ignore this email.</p>`),
    text: `Your Sutton Vet verification code is ${input.code}. It expires in 10 minutes and can only be used once. Do not share it. If you did not request it, ignore this email.`,
    idempotencyKey: `booking-verification/${input.reference}`,
  });
}

export async function sendRegistrationConfirmation(input: RegistrationConfirmation): Promise<EmailResult> {
  const firstName = escapeHtml(input.firstName);
  const petName = escapeHtml(input.petName);
  const html = emailShell(
    `Registration received for ${input.petName}.`,
    "Registration received",
    `<p style="margin:0 0 16px">Hello ${firstName},</p>
     <p style="margin:0 0 16px">Thank you for registering <strong>${petName}</strong> with The Sutton Vet. Your details have been received by our practice team.</p>
     <p style="margin:0">We will contact you if we need any more information.</p>`,
  );

  return sendEmail({
    to: input.email,
    subject: `Registration received for ${input.petName}`,
    html,
    text: `Hello ${input.firstName},\n\nThank you for registering ${input.petName} with The Sutton Vet. Your details have been received by our practice team.\n\nWe will contact you if we need any more information.\n\nNeed help? Reply to this email or call 0203 603 0298.`,
    idempotencyKey: `lupa-registration/${input.reference}`,
  });
}

export async function sendBookingConfirmation(input: BookingConfirmation): Promise<EmailResult> {
  const firstName = escapeHtml(input.firstName);
  const petName = escapeHtml(input.petName);
  const appointment = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Europe/London",
  }).format(new Date(input.appointmentStart));
  const safeAppointment = escapeHtml(appointment);
  const html = emailShell(
    `Appointment request received for ${input.petName}.`,
    "Appointment request received",
    `<p style="margin:0 0 16px">Hello ${firstName},</p>
     <p style="margin:0 0 16px">We have received your appointment request for <strong>${petName}</strong>.</p>
     <p style="margin:0 0 16px;padding:16px;border-radius:12px;background:#f5f1f7;color:#4d186f"><strong>Requested time:</strong><br>${safeAppointment}</p>
     <p style="margin:0">This is a request, not a confirmed appointment. The practice team will contact you to confirm your booking.</p>`,
  );

  return sendEmail({
    to: input.email,
    subject: `Appointment request received for ${input.petName}`,
    html,
    text: `Hello ${input.firstName},\n\nWe have received your appointment request for ${input.petName}.\n\nRequested time: ${appointment}\n\nThis is a request, not a confirmed appointment. The practice team will contact you to confirm your booking.\n\nNeed help? Reply to this email or call 0203 603 0298.`,
    idempotencyKey: `lupa-booking/${input.reference}`,
  });
}

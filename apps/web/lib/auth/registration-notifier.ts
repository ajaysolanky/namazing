import "server-only";

import nodemailer from "nodemailer";

import { createAdminClient } from "@/lib/supabase/admin";

type RegistrationNotificationInput = {
  userId: string;
  email: string;
  displayName?: string | null;
  provider?: string | null;
};

let transporterPromise: Promise<nodemailer.Transporter> | null = null;

function isNotificationConfigured() {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      process.env.NOTIFY_SIGNUPS_TO
  );
}

function getTransporter() {
  if (!transporterPromise) {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !port || !user || !pass) {
      throw new Error("SMTP configuration is incomplete");
    }

    transporterPromise = Promise.resolve(
      nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: {
          user,
          pass,
        },
      })
    );
  }

  return transporterPromise;
}

function buildMessage({ email, displayName, provider }: RegistrationNotificationInput) {
  const lines = [
    "A new Namazing account was created.",
    "",
    `Email: ${email}`,
    `Display name: ${displayName || "(not set)"}`,
    `Provider: ${provider || "email"}`,
    `Created at: ${new Date().toISOString()}`,
  ];

  return lines.join("\n");
}

export async function notifyRegistrationIfNeeded(input: RegistrationNotificationInput) {
  if (!isNotificationConfigured()) {
    console.warn("[registration-notifier] SMTP notification skipped: configuration missing");
    return { status: "skipped", reason: "missing_config" } as const;
  }

  const admin = createAdminClient();
  const {
    data: { user },
    error: getUserError,
  } = await admin.auth.admin.getUserById(input.userId);

  if (getUserError) {
    throw getUserError;
  }

  const metadata = user?.user_metadata ?? {};

  if (metadata.registration_notified_at) {
    return { status: "skipped", reason: "already_sent" } as const;
  }

  const transporter = await getTransporter();
  const from = process.env.SMTP_FROM || process.env.SMTP_USER!;
  const to = process.env.NOTIFY_SIGNUPS_TO!;

  await transporter.sendMail({
    from,
    to,
    subject: "New Namazing signup",
    text: buildMessage(input),
  });

  const registrationNotifiedAt = new Date().toISOString();
  const { error } = await admin.auth.admin.updateUserById(input.userId, {
    user_metadata: {
      ...metadata,
      registration_notified_at: registrationNotifiedAt,
    },
  });

  if (error) {
    throw error;
  }

  return { status: "sent" } as const;
}

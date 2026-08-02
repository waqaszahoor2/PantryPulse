export interface BuildEmailOptions {
  recipient?: string;
  fullName: string;
  email: string;
  category: string;
  subject: string;
  message: string;
  pageUrl?: string;
}

export const SUPPORT_CATEGORIES = [
  "Account problem",
  "Pantry problem",
  "Notification problem",
  "Privacy or data request",
  "General feedback",
  "Other",
] as const;

export type SupportCategory = (typeof SUPPORT_CATEGORIES)[number];

export function getFixedSupportEmail(): string {
  return process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@example.com";
}

export function buildEmailSubject(category: string, subject: string): string {
  const cleanCategory = category.trim() || "General Feedback";
  const cleanSubject = subject.trim() || "Support Request";
  return `[PantryPulse Support] ${cleanCategory}: ${cleanSubject}`;
}

export function buildEmailBody(options: BuildEmailOptions): string {
  const pageUrl = options.pageUrl || (typeof window !== "undefined" ? window.location.href : "https://pantry-pulse-seven-xi.vercel.app/support");

  return [
    "Hello PantryPulse Support,",
    "",
    `Name: ${options.fullName.trim()}`,
    `Email: ${options.email.trim()}`,
    `Category: ${options.category.trim()}`,
    `Subject: ${options.subject.trim()}`,
    "",
    "Message:",
    options.message.trim(),
    "",
    "Page:",
    pageUrl,
    "",
    "Sent from the PantryPulse support form.",
  ].join("\n");
}

export function buildGmailComposeUrl(options: BuildEmailOptions): string {
  const recipient = getFixedSupportEmail();
  const subject = buildEmailSubject(options.category, options.subject);
  const body = buildEmailBody(options);

  const params = new URLSearchParams({
    view: "cm",
    fs: "1",
    to: recipient,
    su: subject,
    body: body,
  });

  return `https://mail.google.com/mail/?${params.toString()}`;
}

export function buildMailtoUrl(options: BuildEmailOptions): string {
  const recipient = getFixedSupportEmail();
  const subject = buildEmailSubject(options.category, options.subject);
  const body = buildEmailBody(options);

  const params = new URLSearchParams({
    subject: subject,
    body: body,
  });

  return `mailto:${encodeURIComponent(recipient)}?${params.toString()}`;
}

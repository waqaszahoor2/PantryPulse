export interface SupportEmailInput {
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
  const email = process.env.NEXT_PUBLIC_SUPPORT_EMAIL?.trim();
  return email || "support@example.com";
}

export function isConfiguredSupportEmail(email: string): boolean {
  if (!email || email.includes("example.com") || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return false;
  }
  return true;
}

export function buildEmailSubject(category: string, subject: string): string {
  const cleanCategory = category.trim() || "General Feedback";
  const cleanSubject = subject.trim() || "Support Request";
  return `[PantryPulse Support] ${cleanCategory}: ${cleanSubject}`;
}

export function buildEmailBody(input: SupportEmailInput): string {
  const pageUrl = input.pageUrl || (typeof window !== "undefined" ? window.location.href : "https://pantry-pulse-seven-xi.vercel.app/support");

  return [
    "Hello PantryPulse Support,",
    "",
    `Name: ${input.fullName.trim()}`,
    `Email: ${input.email.trim()}`,
    `Category: ${input.category.trim()}`,
    `Subject: ${input.subject.trim()}`,
    "",
    "Message:",
    input.message.trim(),
    "",
    `Page: ${pageUrl}`,
    "",
    "Sent from the PantryPulse support form.",
  ].join("\n");
}

export function buildGmailComposeUrl(input: SupportEmailInput): string {
  const recipient = input.recipient?.trim() || getFixedSupportEmail();
  const url = new URL("https://mail.google.com/mail/");
  url.searchParams.set("view", "cm");
  url.searchParams.set("fs", "1");
  url.searchParams.set("to", recipient);
  url.searchParams.set(
    "su",
    buildEmailSubject(input.category, input.subject)
  );

  url.searchParams.set("body", buildEmailBody(input));

  return url.toString();
}

export function buildMailtoUrl(input: SupportEmailInput): string {
  const recipient = input.recipient?.trim() || getFixedSupportEmail();
  const subject = buildEmailSubject(input.category, input.subject);
  const body = buildEmailBody(input);

  const params = new URLSearchParams();
  params.set("subject", subject);
  params.set("body", body);

  return `mailto:${encodeURIComponent(recipient)}?${params.toString()}`;
}

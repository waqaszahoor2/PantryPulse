import { describe, expect, it, beforeEach, afterEach } from "vitest";
import {
  buildEmailBody,
  buildEmailSubject,
  buildGmailComposeUrl,
  buildMailtoUrl,
  getFixedSupportEmail,
} from "@/lib/support/build-email-links";

describe("Support Email Links Generator", () => {
  const originalEnv = process.env.NEXT_PUBLIC_SUPPORT_EMAIL;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_SUPPORT_EMAIL = "fixed-support@pantrypulse.app";
  });

  afterEach(() => {
    process.env.NEXT_PUBLIC_SUPPORT_EMAIL = originalEnv;
  });

  it("returns the fixed recipient from environment variable", () => {
    expect(getFixedSupportEmail()).toBe("fixed-support@pantrypulse.app");
  });

  it("uses fallback recipient when environment variable is missing", () => {
    delete process.env.NEXT_PUBLIC_SUPPORT_EMAIL;
    expect(getFixedSupportEmail()).toBe("support@example.com");
  });

  it("formats the email subject correctly with category and subject", () => {
    const subject = buildEmailSubject("Account problem", "Cannot reset password");
    expect(subject).toBe("[PantryPulse Support] Account problem: Cannot reset password");
  });

  it("formats multiline email body correctly", () => {
    const body = buildEmailBody({
      fullName: "Jane Doe",
      email: "jane@example.com",
      category: "Pantry problem",
      subject: "Item expiry date issue",
      message: "First line of issue.\nSecond line of details.",
      pageUrl: "https://pantrypulse.app/pantry",
    });

    expect(body).toContain("Name: Jane Doe");
    expect(body).toContain("Email: jane@example.com");
    expect(body).toContain("Category: Pantry problem");
    expect(body).toContain("Subject: Item expiry date issue");
    expect(body).toContain("First line of issue.\nSecond line of details.");
    expect(body).toContain("Page:\nhttps://pantrypulse.app/pantry");
    expect(body).toContain("Sent from the PantryPulse support form.");
  });

  it("generates a safe, fully-encoded Gmail compose URL", () => {
    const gmailUrl = buildGmailComposeUrl({
      fullName: "John & Smith",
      email: "john@example.com",
      category: "General feedback",
      subject: "Great app!",
      message: "Loved the PKR currency support & analytics = 100%!",
    });

    expect(gmailUrl).toContain("https://mail.google.com/mail/?");
    expect(gmailUrl).toContain("view=cm");
    expect(gmailUrl).toContain("fs=1");
    expect(gmailUrl).toContain("to=fixed-support%40pantrypulse.app");
    expect(gmailUrl).toContain("su=%5BPantryPulse+Support%5D+General+feedback%3A+Great+app%21");
    expect(gmailUrl).toContain("Loved+the+PKR+currency");
  });

  it("generates a safe mailto URL fallback", () => {
    const mailtoUrl = buildMailtoUrl({
      fullName: "Alice",
      email: "alice@example.com",
      category: "Other",
      subject: "Feature suggestion",
      message: "Please add barcode scanning feature.",
    });

    expect(mailtoUrl).toContain("mailto:fixed-support%40pantrypulse.app?");
    expect(mailtoUrl).toContain("subject=%5BPantryPulse+Support%5D+Other%3A+Feature+suggestion");
    expect(mailtoUrl).toContain("Please+add+barcode+scanning+feature.");
  });

  it("properly encodes special characters and prevents raw URL injection", () => {
    const gmailUrl = buildGmailComposeUrl({
      fullName: "<script>alert('xss')</script>",
      email: "test@example.com",
      category: "Account problem",
      subject: "Subject & Special ? = # % Characters",
      message: "Message line 1 & line 2? #hash",
    });

    expect(gmailUrl).not.toContain("<script>");
    expect(gmailUrl).toContain("%3Cscript%3Ealert%28%27xss%27%29%3C%2Fscript%3E");
    expect(gmailUrl).toContain("Special+%3F+%3D+%23+%25+Characters");
  });
});

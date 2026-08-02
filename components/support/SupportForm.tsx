"use client";

import { useEffect, useId, useState } from "react";
import { Check, Copy, Mail, ExternalLink, AlertCircle, Info } from "lucide-react";
import {
  SUPPORT_CATEGORIES,
  buildGmailComposeUrl,
  buildMailtoUrl,
  getFixedSupportEmail,
} from "@/lib/support/build-email-links";

interface FormState {
  fullName: string;
  email: string;
  category: string;
  subject: string;
  message: string;
}

interface ErrorsState {
  fullName?: string;
  email?: string;
  category?: string;
  subject?: string;
  message?: string;
}

export function SupportForm() {
  const supportEmail = getFixedSupportEmail();

  const [form, setForm] = useState<FormState>({
    fullName: "",
    email: "",
    category: "General feedback",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<ErrorsState>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [notice, setNotice] = useState<{ text: string; type: "info" | "error" } | null>(null);
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fullNameId = useId();
  const emailId = useId();
  const categoryId = useId();
  const subjectId = useId();
  const messageId = useId();

  const fullNameErrId = `${fullNameId}-error`;
  const emailErrId = `${emailId}-error`;
  const categoryErrId = `${categoryId}-error`;
  const subjectErrId = `${subjectId}-error`;
  const messageErrId = `${messageId}-error`;

  const validate = (values: FormState): ErrorsState => {
    const errs: ErrorsState = {};
    const trimmedName = values.fullName.trim();
    const trimmedEmail = values.email.trim();
    const trimmedSubject = values.subject.trim();
    const trimmedMessage = values.message.trim();

    if (!trimmedName) {
      errs.fullName = "Full name is required.";
    } else if (trimmedName.length < 2) {
      errs.fullName = "Full name must be at least 2 characters.";
    }

    if (!trimmedEmail) {
      errs.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errs.email = "Enter a valid email address.";
    }

    if (!values.category) {
      errs.category = "Please select a category.";
    }

    if (!trimmedSubject) {
      errs.subject = "Subject is required.";
    } else if (trimmedSubject.length < 3) {
      errs.subject = "Subject must be at least 3 characters.";
    } else if (trimmedSubject.length > 120) {
      errs.subject = "Subject cannot exceed 120 characters.";
    }

    if (!trimmedMessage) {
      errs.message = "Message is required.";
    } else if (trimmedMessage.length < 10) {
      errs.message = "Message must be at least 10 characters.";
    } else if (trimmedMessage.length > 2000) {
      errs.message = "Message cannot exceed 2,000 characters.";
    }

    return errs;
  };

  function handleChange(field: keyof FormState, value: string) {
    const nextForm = { ...form, [field]: value };
    setForm(nextForm);
    if (touched[field]) {
      setErrors(validate(nextForm));
    }
  }

  function handleBlur(field: keyof FormState) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validate(form));
  }

  function handleOpenGmail(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ fullName: true, email: true, category: true, subject: true, message: true });
    const validationErrors = validate(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setNotice({ text: "Please correct the validation errors above before proceeding.", type: "error" });
      return;
    }

    setIsSubmitting(true);
    setNotice(null);

    try {
      const gmailUrl = buildGmailComposeUrl({
        fullName: form.fullName,
        email: form.email,
        category: form.category,
        subject: form.subject,
        message: form.message,
      });

      const win = window.open(gmailUrl, "_blank", "noopener,noreferrer");
      if (win) {
        setNotice({
          text: "Gmail has been opened with your message. Review the email and press Send.",
          type: "info",
        });
      } else {
        setNotice({
          text: "We could not open Gmail. Use the alternative email button or contact support directly.",
          type: "error",
        });
      }
    } catch {
      setNotice({
        text: "We could not open Gmail. Use the alternative email button or contact support directly.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleCopyEmail() {
    navigator.clipboard.writeText(supportEmail).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  }

  const mailtoUrl = buildMailtoUrl({
    fullName: form.fullName,
    email: form.email,
    category: form.category,
    subject: form.subject,
    message: form.message,
  });

  const isFormValid = Object.keys(validate(form)).length === 0;

  return (
    <div className="support-form-container" style={{ display: "grid", gap: "1.25rem" }}>
      {notice && (
        <div
          role="status"
          aria-live="polite"
          className={`form-message ${notice.type === "error" ? "error" : "success"}`}
          style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}
        >
          {notice.type === "error" ? <AlertCircle size={18} /> : <Info size={18} />}
          <span>{notice.text}</span>
        </div>
      )}

      <form onSubmit={handleOpenGmail} noValidate style={{ display: "grid", gap: "1rem" }}>
        <div className="form-grid two">
          <div className="field">
            <label htmlFor={fullNameId}>
              Full name <span style={{ color: "var(--red)" }}>*</span>
            </label>
            <input
              id={fullNameId}
              type="text"
              required
              aria-invalid={Boolean(touched.fullName && errors.fullName)}
              aria-describedby={touched.fullName && errors.fullName ? fullNameErrId : undefined}
              value={form.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              onBlur={() => handleBlur("fullName")}
              placeholder="e.g. Sarah Connor"
            />
            {touched.fullName && errors.fullName && (
              <span id={fullNameErrId} style={{ color: "var(--red)", fontSize: "0.75rem", fontWeight: 600 }}>
                {errors.fullName}
              </span>
            )}
          </div>

          <div className="field">
            <label htmlFor={emailId}>
              User email <span style={{ color: "var(--red)" }}>*</span>
            </label>
            <input
              id={emailId}
              type="email"
              required
              aria-invalid={Boolean(touched.email && errors.email)}
              aria-describedby={touched.email && errors.email ? emailErrId : undefined}
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              onBlur={() => handleBlur("email")}
              placeholder="e.g. sarah@example.com"
            />
            {touched.email && errors.email && (
              <span id={emailErrId} style={{ color: "var(--red)", fontSize: "0.75rem", fontWeight: 600 }}>
                {errors.email}
              </span>
            )}
          </div>
        </div>

        <div className="form-grid two">
          <div className="field">
            <label htmlFor={categoryId}>
              Category <span style={{ color: "var(--red)" }}>*</span>
            </label>
            <select
              id={categoryId}
              required
              aria-invalid={Boolean(touched.category && errors.category)}
              aria-describedby={touched.category && errors.category ? categoryErrId : undefined}
              value={form.category}
              onChange={(e) => handleChange("category", e.target.value)}
              onBlur={() => handleBlur("category")}
            >
              {SUPPORT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {touched.category && errors.category && (
              <span id={categoryErrId} style={{ color: "var(--red)", fontSize: "0.75rem", fontWeight: 600 }}>
                {errors.category}
              </span>
            )}
          </div>

          <div className="field">
            <label htmlFor={subjectId}>
              Subject <span style={{ color: "var(--red)" }}>*</span>
            </label>
            <input
              id={subjectId}
              type="text"
              required
              minLength={3}
              maxLength={120}
              aria-invalid={Boolean(touched.subject && errors.subject)}
              aria-describedby={touched.subject && errors.subject ? subjectErrId : undefined}
              value={form.subject}
              onChange={(e) => handleChange("subject", e.target.value)}
              onBlur={() => handleBlur("subject")}
              placeholder="Brief summary of your query"
            />
            {touched.subject && errors.subject && (
              <span id={subjectErrId} style={{ color: "var(--red)", fontSize: "0.75rem", fontWeight: 600 }}>
                {errors.subject}
              </span>
            )}
          </div>
        </div>

        <div className="field">
          <label htmlFor={messageId}>
            Message <span style={{ color: "var(--red)" }}>*</span>
            <small style={{ marginLeft: "auto", float: "right" }}>
              {form.message.trim().length} / 2,000
            </small>
          </label>
          <textarea
            id={messageId}
            required
            rows={5}
            minLength={10}
            maxLength={2000}
            aria-invalid={Boolean(touched.message && errors.message)}
            aria-describedby={touched.message && errors.message ? messageErrId : undefined}
            value={form.message}
            onChange={(e) => handleChange("message", e.target.value)}
            onBlur={() => handleBlur("message")}
            placeholder="Describe your issue or feedback in detail (10 to 2,000 characters)…"
            style={{ resize: "vertical" }}
          />
          {touched.message && errors.message && (
            <span id={messageErrId} style={{ color: "var(--red)", fontSize: "0.75rem", fontWeight: 600 }}>
              {errors.message}
            </span>
          )}
        </div>

        <p className="muted" style={{ fontSize: "0.82rem", margin: "0.35rem 0" }}>
          Your email application will open with your message prepared. Review it and press Send to deliver your query.
        </p>

        <div className="support-actions" style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <button
            type="submit"
            className="button button-primary"
            disabled={isSubmitting || !isFormValid}
            style={{ minHeight: "44px" }}
          >
            <Mail size={18} />
            {isSubmitting ? "Preparing Gmail…" : "Send query with Gmail"}
          </button>

          <a
            href={mailtoUrl}
            className={`button button-soft ${!isFormValid ? "disabled" : ""}`}
            style={{ minHeight: "44px", opacity: !isFormValid ? 0.5 : 1, pointerEvents: !isFormValid ? "none" : "auto" }}
          >
            <ExternalLink size={18} />
            Use another email app
          </a>
        </div>
      </form>

      <div
        className="support-email-footer"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          padding: "0.85rem 1rem",
          background: "var(--surface-soft)",
          borderRadius: "12px",
          border: "1px solid var(--line)",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.55rem", fontSize: "0.86rem" }}>
          <Mail size={18} style={{ color: "var(--primary)" }} />
          <span>
            Support email:{" "}
            <a href={`mailto:${supportEmail}`} className="link-text" style={{ fontWeight: 700 }}>
              {supportEmail}
            </a>
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopyEmail}
          className="button button-ghost button-small"
          aria-label="Copy support email address to clipboard"
        >
          {copied ? <Check size={15} style={{ color: "var(--primary)" }} /> : <Copy size={15} />}
          <span>{copied ? "Support email copied." : "Copy support email"}</span>
        </button>
      </div>
    </div>
  );
}

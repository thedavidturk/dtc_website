"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { siteContent } from "@/data/siteContent";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FormStatus = "idle" | "submitting" | "success" | "error";

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const { contact, cta } = siteContent;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });

  const [status, setStatus] = useState<FormStatus>("idle");

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const submitForm = async () => {
    console.log("Form submission started", formData);
    setStatus("submitting");

    const FORMSPREE_ENDPOINT = "https://formspree.io/f/meezzwjl";

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.company,
          message: formData.message,
          _subject: `New inquiry from ${formData.name} - DT+C Website`,
        }),
      });

      console.log("Formspree response:", response.status, response.ok);

      if (response.ok) {
        setStatus("success");
        setTimeout(() => {
          setFormData({ name: "", email: "", company: "", message: "" });
          setStatus("idle");
          onClose();
        }, 2000);
      } else {
        const errorData = await response.json();
        console.error("Formspree error:", errorData);
        throw new Error("Form submission failed");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setStatus("error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form onSubmit triggered");
    await submitForm();
  };

  const handleButtonClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Button onClick triggered");

    // Validate required fields
    if (!formData.name || !formData.email || !formData.message) {
      console.log("Validation failed - missing required fields");
      return;
    }

    await submitForm();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Generate mailto fallback
  const mailtoHref = `mailto:david@davidturkcreative.com?subject=Project Inquiry from ${encodeURIComponent(formData.name || "Website")}&body=${encodeURIComponent(
    `Name: ${formData.name}\nCompany: ${formData.company}\nEmail: ${formData.email}\n\n${formData.message}`
  )}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg z-[51] bg-[var(--background-elevated)] rounded-2xl border border-[var(--border)] overflow-hidden max-h-[calc(100vh-2rem)] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
              <div>
                <h3 className="text-xl font-semibold">{contact.title}</h3>
                <p className="text-sm text-[var(--foreground-muted)] mt-1">
                  {contact.subtitle}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-[var(--background-card)] rounded-lg transition-colors"
                aria-label="Close modal"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-[var(--foreground-muted)] mb-2"
                >
                  {contact.fields.name.label}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={contact.fields.name.placeholder}
                  required
                  className="w-full px-4 py-3 bg-[var(--background-card)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-[var(--foreground-muted)] mb-2"
                >
                  {contact.fields.email.label}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={contact.fields.email.placeholder}
                  required
                  className="w-full px-4 py-3 bg-[var(--background-card)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                />
              </div>

              {/* Company */}
              <div>
                <label
                  htmlFor="company"
                  className="block text-sm font-medium text-[var(--foreground-muted)] mb-2"
                >
                  {contact.fields.company.label}
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder={contact.fields.company.placeholder}
                  className="w-full px-4 py-3 bg-[var(--background-card)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                />
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-[var(--foreground-muted)] mb-2"
                >
                  {contact.fields.message.label}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={contact.fields.message.placeholder}
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-[var(--background-card)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] focus:outline-none focus:border-[var(--accent)] transition-colors resize-none"
                />
              </div>

              {/* Status messages */}
              {status === "success" && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-green-400"
                >
                  {contact.successMessage}
                </motion.p>
              )}

              {status === "error" && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-400"
                >
                  {contact.errorMessage}
                </motion.p>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleButtonClick}
                  disabled={status === "submitting" || status === "success"}
                  className="relative flex-1 px-6 py-3 bg-[var(--accent)] text-[var(--background)] font-medium rounded-lg hover:bg-[var(--accent-hover)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === "submitting" && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    </span>
                  )}
                  <span className={status === "submitting" ? "invisible" : ""}>
                    {contact.submitLabel}
                  </span>
                </button>
                <a
                  href={mailtoHref}
                  className="flex-1 px-6 py-3 border border-[var(--border)] text-[var(--foreground)] font-medium rounded-lg hover:border-[var(--border-hover)] hover:bg-[var(--background-card)] transition-all text-center"
                >
                  {cta.secondaryCta.label}
                </a>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

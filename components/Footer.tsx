"use client";

import { siteContent } from "@/data/siteContent";

export default function Footer() {
  const { footer, nav } = siteContent;

  return (
    <footer className="py-8 border-t border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <a
            href="#"
            className="text-xl font-bold tracking-tight text-[var(--foreground)] hover:text-[var(--accent)] transition-colors"
          >
            {nav.logo}
          </a>

          {/* Location info */}
          <div className="flex items-center gap-2 text-sm text-[var(--foreground-subtle)]">
            <span>{footer.location}</span>
            <span className="w-1 h-1 rounded-full bg-[var(--foreground-subtle)]" />
            <span>{footer.reach}</span>
          </div>

          {/* Copyright */}
          <p className="text-sm text-[var(--foreground-subtle)]">{footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}

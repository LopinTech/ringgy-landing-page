"use client";

import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { SIGNUP_URL } from "@/lib/site";

export type NavLink = { href: string; label: string };

const DEFAULT_LINKS: NavLink[] = [
  { href: "#how", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#demo", label: "Demo" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

/**
 * Sticky header. At the top of the page it blends into the hero (same surface
 * tint, no border); once scrolled it becomes frosted white with a soft shadow
 * and eases a little shorter.
 */
export function Navbar({ links = DEFAULT_LINKS, badge }: { links?: NavLink[]; badge?: string }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-[background-color,border-color,box-shadow] duration-300 ease-out ${
        scrolled
          ? "border-line bg-white/80 shadow-[0_8px_24px_-18px_rgba(15,37,64,.35)] backdrop-blur-xl backdrop-saturate-150"
          : "border-transparent bg-surface"
      }`}
    >
      <div
        className={`mx-auto flex max-w-[1520px] items-center gap-3 px-4 sm:gap-8 transition-[padding] duration-300 ease-out sm:px-7 ${
          scrolled ? "py-3" : "py-[18px]"
        }`}
      >
        <a href="#" className="mr-auto flex min-w-0 items-center gap-2 transition-opacity sm:gap-3 hover:opacity-85" aria-label="Ringgy AI home">
          <Logo />
          {badge && (
            <span className="whitespace-nowrap rounded-full bg-tint px-2.5 py-1 text-[11px] font-bold sm:px-3 sm:py-[5px] sm:text-xs tracking-[.06em] text-brand">{badge}</span>
          )}
        </a>
        <nav className="hidden min-w-0 gap-1 overflow-hidden whitespace-nowrap text-[15px] font-medium text-[#3B4959] lg:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="rounded-full px-3.5 py-2 transition-colors duration-200 hover:bg-tint-2 hover:text-brand">
              {l.label}
            </a>
          ))}
        </nav>
        <a
          href={SIGNUP_URL}
          className="flex-none whitespace-nowrap rounded-lg bg-brand px-4 py-2.5 text-sm sm:px-5 sm:py-[11px] sm:text-[15px] font-medium text-white shadow-[0_10px_20px_-12px_rgba(21,87,176,.8)] transition-[background-color,transform] duration-200 hover:-translate-y-px hover:bg-brand-dark"
        >
          Start for Free
        </a>
      </div>
    </header>
  );
}

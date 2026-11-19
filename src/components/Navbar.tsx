'use client';

import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { ShakibaLogo } from './ShakibaLogo';

const NAV_LINKS = [
  { href: '#about', label: 'About' },
  { href: '#research', label: 'Research' },
  { href: '#career', label: 'Career' },
  { href: '#credentials', label: 'Credentials' },
] as const;

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-200 ${
        scrolled
          ? 'border-b border-white/10 bg-[#000000]/95'
          : 'border-b border-transparent bg-[#000000]/80'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-6 lg:px-10">
        {/* Zone 1: Single-line Brand Wordmark */}
        <a
          href="#top"
          className="flex shrink-0 items-center gap-3 whitespace-nowrap text-white transition-opacity duration-200 hover:opacity-85"
          aria-label="Shakiba Mashini home"
        >
          <ShakibaLogo size={32} className="text-white" />
          <span className="text-[15px] font-medium tracking-[0.04em] text-white">
            Shakiba Mashini
          </span>
        </a>

        {/* Zone 2: 4 Clean Single-Line Nav Links */}
        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-8 md:flex"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group relative shrink-0 whitespace-nowrap py-1 text-sm font-normal text-white/70 transition-colors duration-200 hover:text-white"
            >
              {link.label}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-white transition-transform duration-200 group-hover:scale-x-100"
              />
            </a>
          ))}
        </nav>

        {/* Zone 3: Single Primary Action + Mobile Drawer Toggle */}
        <div className="flex shrink-0 items-center gap-3">
          <a
            href="#contact"
            className="hidden shrink-0 whitespace-nowrap rounded-lg bg-white px-5 py-2 text-xs font-semibold tracking-[0.04em] text-[#0a0c0c] transition-colors duration-200 hover:bg-white/88 md:inline-flex"
          >
            Connect
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation-drawer"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/15 bg-[#0a0c0c] text-white transition-colors duration-200 hover:border-white/35 md:hidden"
          >
            {mobileOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div
          id="mobile-navigation-drawer"
          className="border-t border-white/10 bg-[#0a0c0c] px-6 py-6 md:hidden"
        >
          <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex min-h-[44px] items-center justify-between border-b border-white/8 py-3 text-base font-normal text-white/85 transition-colors hover:text-white"
              >
                <span>{link.label}</span>
              </a>
            ))}
            <div className="pt-4">
              <a
                href="#contact"
                onClick={() => setMobileOpen(false)}
                className="flex min-h-[44px] w-full items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-semibold text-[#0a0c0c] transition-colors hover:bg-white/90"
              >
                Connect
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

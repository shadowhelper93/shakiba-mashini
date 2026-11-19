import { ArrowUp, ArrowUpRight } from 'lucide-react';
import { PROFILE } from '../lib/portfolioData';
import { ShakibaLogo } from './ShakibaLogo';
import { SpectralFooterVisual } from './SpectralFooterVisual';

export function ContactSection() {
  return (
    <footer
      id="contact"
      aria-labelledby="footer-heading"
      className="relative scroll-mt-20 border-t border-white/10 bg-[#0a0c0c] pt-20 sm:pt-24 lg:pt-28"
    >
      <div className="mx-auto max-w-7xl px-6 pb-16 lg:px-10 lg:pb-20">
        {/* Editorial Closing Header + Direct LinkedIn Connection */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-medium tracking-[0.14em] text-white/50">
              05. Connect &amp; Research Spectrum
            </p>
            <h2
              id="footer-heading"
              className="mt-4 text-3xl font-semibold leading-[1.12] tracking-[-0.02em] text-white sm:text-5xl"
            >
              Advancing graph intelligence across computer science and medicine.
            </h2>
          </div>

          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center lg:flex-col lg:items-end">
            <a
              href={PROFILE.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex min-h-[46px] shrink-0 items-center gap-2.5 whitespace-nowrap rounded-lg bg-white px-6 py-3 text-sm font-semibold text-[#0a0c0c] transition-colors duration-200 hover:bg-white/88"
            >
              <span>Connect on LinkedIn</span>
              <ArrowUpRight
                size={16}
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
            <p className="text-xs font-light text-white/55">
              Georgia State University · Emory University School of Medicine
            </p>
          </div>
        </div>

        {/* Custom Animated Data-Science Footer Statement */}
        <div className="mt-10 lg:mt-12">
          <SpectralFooterVisual />
        </div>
      </div>

      {/* Quiet Architectural Footer Baseline */}
      <div className="border-t border-white/10 bg-[#000000]">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 py-8 sm:flex-row sm:items-center lg:px-10">
          <div className="flex items-center gap-3">
            <ShakibaLogo size={28} className="text-white" />
            <p className="text-xs font-normal text-white/60">
              © 2026 Shakiba Mashini
              <span className="mx-2 text-white/25" aria-hidden="true">
                ·
              </span>
              Atlanta, Georgia
            </p>
          </div>

          <div className="flex items-center gap-6 text-xs font-medium text-white/65">
            <a
              href={PROFILE.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[36px] items-center gap-1 whitespace-nowrap transition-colors hover:text-white"
            >
              <span>LinkedIn</span>
              <ArrowUpRight size={13} aria-hidden="true" />
            </a>
            <a
              href="#top"
              className="inline-flex min-h-[36px] items-center gap-1 whitespace-nowrap transition-colors hover:text-white"
            >
              <span>Back to Top</span>
              <ArrowUp size={13} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

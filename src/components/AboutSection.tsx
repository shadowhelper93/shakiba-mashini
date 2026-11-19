'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { PROFILE } from '../lib/portfolioData';

const INSTITUTION_RIBBON = [
  'Georgia State University',
  'Emory University School of Medicine',
  'Dell Technologies',
  'Shepherd Center',
  'Georgia Institute of Technology',
  'Alzahra University',
];

export function AboutSection() {
  const [headshotFailed, setHeadshotFailed] = useState(false);

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative scroll-mt-20 bg-[#0a0c0c] py-20 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Section Identity + Compact Gallery Portrait Plate */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-start gap-8 lg:col-span-5"
          >
            <div>
              <p className="text-xs font-medium tracking-[0.14em] text-white/50">
                01. About
              </p>
              <h2
                id="about-heading"
                className="mt-4 text-3xl font-semibold leading-[1.12] tracking-[-0.02em] text-white sm:text-4xl"
              >
                Mathematical precision meets applied intelligence.
              </h2>
            </div>

            {/* Centered Studio Portrait Plate directly under heading on tablet & desktop; mobile unchanged */}
            <figure className="w-full max-w-[280px] overflow-hidden rounded-2xl border border-white/12 bg-[#0c1515] p-3 sm:mx-auto sm:max-w-[310px] sm:p-3.5 lg:max-w-[310px]">
              <div className="overflow-hidden rounded-xl bg-white">
                {!headshotFailed ? (
                  <img
                    src={PROFILE.portraits.studioHeadshot}
                    alt="Studio portrait of Shakiba Mashini"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    onError={() => setHeadshotFailed(true)}
                    className="portrait-editorial-matte h-[220px] w-full object-cover object-[50%_18%] sm:h-[260px] lg:h-[260px]"
                  />
                ) : (
                  <div className="flex h-[220px] w-full items-center justify-center bg-[#0a0c0c] text-white/70 sm:h-[260px] lg:h-[260px]">
                    Shakiba Mashini
                  </div>
                )}
              </div>
              <figcaption className="mt-3.5 flex items-center justify-between gap-3 text-xs text-white/65">
                <span className="font-medium text-white/90">Shakiba Mashini</span>
                <span className="font-light">Ph.D. · Emory</span>
              </figcaption>
            </figure>
          </motion.div>

          {/* Right Column: Narrative Prose & Research Award Proof */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.65, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-between gap-12 lg:col-span-7 lg:pt-10"
          >
            <div className="space-y-6">
              <p className="text-xl font-normal leading-[1.6] text-white sm:text-2xl sm:leading-[1.55]">
                {PROFILE.aboutLead}
              </p>
              <p className="max-w-2xl text-[15px] font-light leading-[1.8] text-white/72 sm:text-base">
                {PROFILE.aboutBody}
              </p>
            </div>

            {/* Adjacent Recognition Block — Single-elevation #0c1515 surface with hairline border */}
            <div className="rounded-2xl border border-white/12 bg-[#0c1515] p-7 sm:p-9">
              <p className="text-xs font-medium tracking-[0.12em] text-white/55">
                Research Recognition
                <span className="mx-2 text-white/25" aria-hidden="true">
                  ·
                </span>
                Georgia State University
              </p>
              <h3 className="mt-3 text-xl font-semibold tracking-[-0.015em] text-white sm:text-2xl">
                {PROFILE.award.title}
              </h3>
              <p className="mt-2 text-sm font-normal text-white/70">
                {PROFILE.award.venue} · {PROFILE.award.issuer}
              </p>
              <div className="my-6 h-px w-full bg-white/10" aria-hidden="true" />
              <p className="text-sm font-light leading-[1.75] text-white/80">
                Poster Presentation: {PROFILE.award.topic}
              </p>
              <p className="mt-4 text-xs font-normal text-white/55">
                Research Advisor: <span className="font-medium text-white/85">{PROFILE.award.advisor}</span>
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Subtle Architectural Institutional Ribbon Divider */}
      <div
        aria-hidden="true"
        className="mt-24 overflow-hidden border-y border-white/8 bg-[#000000] py-5"
      >
        <div className="animate-marquee-drift items-center">
          {[...INSTITUTION_RIBBON, ...INSTITUTION_RIBBON].map((item, idx) => (
            <div
              key={`${item}-${idx}`}
              className="flex shrink-0 items-center whitespace-nowrap"
            >
              <span className="px-6 text-xs font-normal tracking-[0.14em] text-white/45">
                {item}
              </span>
              <span className="text-white/20">·</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

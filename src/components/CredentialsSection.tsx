'use client';

import { PointerEvent, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import {
  getCircularOffset,
  resolveSwipeStep,
  wrapCarouselIndex,
} from '../lib/carouselUtils';
import {
  CERTIFICATIONS,
  CertificationEntry,
  EDUCATION,
  EducationEntry,
} from '../lib/portfolioData';

interface DepthCarouselProps<T extends { id: string }> {
  title: string;
  subtitle: string;
  testId: string;
  items: T[];
  renderCard: (item: T, isActive: boolean, index: number) => React.ReactNode;
}

function DepthCarousel<T extends { id: string }>({
  title,
  subtitle,
  testId,
  items,
  renderCard,
}: DepthCarouselProps<T>) {
  const [activeIndex, setActiveIndex] = useState(0);
  const dragStartX = useRef<number | null>(null);

  const step = (delta: number) => {
    setActiveIndex((prev) => wrapCarouselIndex(prev + delta, items.length));
  };

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    dragStartX.current = e.clientX;
  };

  const handlePointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (dragStartX.current === null) return;
    const deltaX = e.clientX - dragStartX.current;
    dragStartX.current = null;
    const dir = resolveSwipeStep(deltaX, 44);
    if (dir !== 0) step(dir);
  };

  return (
    <div
      data-testid={testId}
      className="rounded-2xl border border-white/10 bg-[#0a0c0c] p-5 sm:p-7 lg:p-8"
    >
      {/* Carousel Header & Accessible Controls */}
      <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold tracking-[-0.015em] text-white sm:text-xl">
            {title}
          </h3>
          <p className="mt-1 text-xs font-light text-white/55">{subtitle}</p>
        </div>

        <div className="flex items-center justify-between gap-4 sm:justify-end">
          <span
            data-testid={`${testId}-counter`}
            className="tabular-nums text-xs font-medium text-white/60"
          >
            {String(activeIndex + 1).padStart(2, '0')} /{' '}
            {String(items.length).padStart(2, '0')}
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label={`Previous ${title.toLowerCase()} card`}
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/15 bg-[#000000] text-white/80 transition-colors duration-200 hover:border-white/45 hover:text-white"
            >
              <ArrowLeft size={16} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label={`Next ${title.toLowerCase()} card`}
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/15 bg-[#000000] text-white/80 transition-colors duration-200 hover:border-white/45 hover:text-white"
            >
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* 3D Perspective Stage */}
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label={title}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') {
            e.preventDefault();
            step(1);
          } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            step(-1);
          }
        }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        className="carousel-perspective relative mt-7 min-h-[315px] w-full overflow-hidden select-none sm:min-h-[285px] lg:min-h-[275px]"
      >
        {items.map((item, idx) => {
          const offset = getCircularOffset(idx, activeIndex, items.length);
          const isActive = offset === 0;
          const isAdjacent = Math.abs(offset) === 1;
          const isHidden = Math.abs(offset) > 1;

          // Subtle 3D perspective depth: center card sharp forward, neighbors recessed & angled
          const xPercent = offset === 0 ? '0%' : offset > 0 ? '72%' : '-72%';
          const rotateY = offset === 0 ? 0 : offset > 0 ? -14 : 14;
          const scale = isActive ? 1 : isAdjacent ? 0.88 : 0.78;
          const opacity = isActive ? 1 : isAdjacent ? 0.36 : 0;

          return (
            <motion.div
              key={item.id}
              aria-hidden={!isActive}
              initial={false}
              animate={{
                x: xPercent,
                scale,
                rotateY,
                opacity,
                zIndex: isActive ? 20 : isAdjacent ? 10 : 1,
              }}
              transition={{
                type: 'spring',
                stiffness: 240,
                damping: 28,
                mass: 0.9,
              }}
              onClick={() => {
                if (!isActive && isAdjacent) setActiveIndex(idx);
              }}
              style={{ transformStyle: 'preserve-3d' }}
              className={`absolute inset-y-0 left-1/2 w-full max-w-[560px] -translate-x-1/2 ${
                isAdjacent ? 'hidden cursor-pointer md:block' : ''
              } ${isHidden ? 'pointer-events-none hidden' : ''}`}
            >
              {renderCard(item, isActive, idx)}
            </motion.div>
          );
        })}
      </div>

      {/* Pagination Bar */}
      <div
        className="mt-6 flex items-center justify-center gap-2"
        role="tablist"
        aria-label={`${title} slides`}
      >
        {items.map((item, idx) => {
          const isCurrent = idx === activeIndex;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={isCurrent}
              aria-label={`View ${title} slide ${idx + 1}`}
              onClick={() => setActiveIndex(idx)}
              className="flex h-11 min-w-[28px] items-center justify-center px-1"
            >
              <span
                className={`block h-1.5 rounded-full transition-all duration-300 ${
                  isCurrent ? 'w-8 bg-white' : 'w-2 bg-white/25 hover:bg-white/50'
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function CredentialsSection() {
  return (
    <section
      id="credentials"
      aria-labelledby="credentials-heading"
      className="relative scroll-mt-20 border-t border-white/8 bg-[#000000] py-20 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-2xl">
          <p className="text-xs font-medium tracking-[0.14em] text-white/50">
            04. Academic Foundation &amp; Credentials
          </p>
          <h2
            id="credentials-heading"
            className="mt-4 text-3xl font-semibold leading-[1.12] tracking-[-0.02em] text-white sm:text-4xl"
          >
            Education and verified certifications.
          </h2>
          <p className="mt-3 text-sm font-light text-white/62">
            Explore academic degrees and verified technical credentials using
            the interactive horizontal controls or arrow keys.
          </p>
        </div>

        <div className="mt-12 space-y-8 lg:mt-14 lg:space-y-10">
          {/* Interactive 3D Education Carousel */}
          <DepthCarousel<EducationEntry>
            title="Education"
            subtitle="Doctoral, graduate, and undergraduate mathematical training"
            testId="education-carousel"
            items={EDUCATION}
            renderCard={(entry, isActive, idx) => (
              <article
                className={`flex h-full flex-col justify-between rounded-2xl border p-6 transition-colors duration-300 sm:p-8 ${
                  isActive
                    ? 'border-white/25 bg-[#0c1515]'
                    : 'border-white/10 bg-[#0c1515]/70'
                }`}
              >
                <div>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="tabular-nums text-xs font-medium text-white/60">
                      <span className="mr-2 text-white/35">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      {entry.period}
                      {entry.isCurrent && (
                        <>
                          <span className="mx-1.5 text-white/30" aria-hidden="true">
                            ·
                          </span>
                          <span className="text-white">Current</span>
                        </>
                      )}
                    </p>
                    {entry.grade && (
                      <p className="tabular-nums text-xs font-semibold text-white">
                        Grade: {entry.grade}
                      </p>
                    )}
                  </div>

                  <h4 className="mt-4 text-xl font-semibold leading-snug tracking-[-0.015em] text-white sm:text-2xl">
                    {entry.degree}
                  </h4>

                  <p className="mt-2 text-sm font-normal text-white/75">
                    {entry.institution}
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-white/10 pt-4">
                  <p className="text-xs font-light leading-relaxed text-white/60">
                    {entry.skills.join(' · ')}
                  </p>

                  <a
                    href={entry.institutionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    tabIndex={isActive ? 0 : -1}
                    aria-label={`View ${entry.institution} on LinkedIn`}
                    className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-xs font-medium text-white/75 transition-colors hover:text-white"
                  >
                    <span>Institution</span>
                    <ArrowUpRight size={13} aria-hidden="true" />
                  </a>
                </div>
              </article>
            )}
          />

          {/* Interactive 3D Verified Certifications Carousel */}
          <DepthCarousel<CertificationEntry>
            title="Verified Certifications"
            subtitle="Accredited credentials in data science, machine learning, and programming"
            testId="certifications-carousel"
            items={CERTIFICATIONS}
            renderCard={(cert, isActive, idx) => (
              <article
                className={`flex h-full flex-col justify-between rounded-2xl border p-6 transition-colors duration-300 sm:p-8 ${
                  isActive
                    ? 'border-white/25 bg-[#0c1515]'
                    : 'border-white/10 bg-[#0c1515]/70'
                }`}
              >
                <div>
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="tabular-nums text-xs font-medium text-white/60">
                      <span className="mr-2 text-white/35">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      {cert.issued}
                    </p>
                    <span className="text-[11px] font-medium tracking-[0.1em] text-white/45">
                      VERIFIED
                    </span>
                  </div>

                  <h4 className="mt-4 text-xl font-semibold leading-snug tracking-[-0.015em] text-white sm:text-2xl">
                    {cert.title}
                  </h4>

                  <p className="mt-2 text-sm font-normal text-white/75">
                    {cert.issuer}
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-white/10 pt-4">
                  <p className="text-xs font-light text-white/60">
                    Skills: {cert.skills.join(' · ')}
                  </p>

                  <a
                    href={cert.issuerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    tabIndex={isActive ? 0 : -1}
                    aria-label={`View ${cert.issuer} on LinkedIn`}
                    className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-xs font-medium text-white/75 transition-colors hover:text-white"
                  >
                    <span>Issuer</span>
                    <ArrowUpRight size={13} aria-hidden="true" />
                  </a>
                </div>
              </article>
            )}
          />
        </div>
      </div>
    </section>
  );
}

'use client';

import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  EXPERTISE_DOMAINS,
  ExpertiseCategory,
  filterExpertiseDomains,
} from '../lib/portfolioData';

const DOMAIN_FILTERS: Array<{ id: ExpertiseCategory; label: string }> = [
  { id: 'all', label: 'All Domains' },
  { id: 'graph-ml', label: 'Graph ML' },
  { id: 'bioinformatics', label: 'Bioinformatics' },
  { id: 'data-cloud', label: 'Data & Cloud' },
  { id: 'mathematics', label: 'Mathematics' },
];

export function ExpertiseSection() {
  const [selectedCategory, setSelectedCategory] = useState<ExpertiseCategory>('all');

  const visibleDomains = useMemo(
    () => filterExpertiseDomains(EXPERTISE_DOMAINS, selectedCategory),
    [selectedCategory],
  );

  return (
    <section
      id="research"
      aria-labelledby="research-heading"
      className="relative scroll-mt-20 bg-[#000000] py-20 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Section Header & Interactive Filter Controls */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="text-xs font-medium tracking-[0.14em] text-white/50">
              02. Expertise &amp; Research Domains
            </p>
            <h2
              id="research-heading"
              className="mt-4 text-3xl font-semibold leading-[1.12] tracking-[-0.02em] text-white sm:text-4xl"
            >
              Core disciplines across graph learning, medicine, and data systems.
            </h2>
          </div>

          <div
            role="group"
            aria-label="Filter expertise domains"
            className="flex max-w-full shrink-0 items-center gap-1 overflow-x-auto rounded-lg border border-white/12 bg-[#0a0c0c] p-1"
          >
            {DOMAIN_FILTERS.map((filter) => {
              const isActive = selectedCategory === filter.id;
              return (
                <button
                  key={filter.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setSelectedCategory(filter.id)}
                  className={`min-h-[38px] shrink-0 whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-200 sm:px-3.5 ${
                    isActive
                      ? 'bg-white text-[#0a0c0c]'
                      : 'text-white/65 hover:text-white'
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Architectural Domain Grid */}
        <div
          data-testid="expertise-grid"
          className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2"
        >
          {visibleDomains.map((domain, index) => (
            <motion.article
              key={domain.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{
                duration: 0.5,
                delay: index * 0.06,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-[#0a0c0c] p-8 transition-colors duration-200 hover:border-white/22 hover:bg-[#0c1515]"
            >
              <div>
                <div className="flex items-baseline justify-between gap-4">
                  <span className="tabular-nums text-xs font-medium tracking-[0.12em] text-white/45">
                    {domain.index}
                  </span>
                  <span className="text-right text-xs font-light text-white/50">
                    {domain.context}
                  </span>
                </div>

                <h3 className="mt-5 text-xl font-semibold tracking-[-0.015em] text-white sm:text-2xl">
                  {domain.title}
                </h3>

                <p className="mt-4 text-[15px] font-light leading-[1.75] text-white/72">
                  {domain.summary}
                </p>
              </div>

              {/* Unboxed Metadata Skills Strip (Zero Pills) */}
              <div className="mt-8 border-t border-white/10 pt-5">
                <p className="text-xs font-normal leading-relaxed text-white/60">
                  {domain.skills.map((skill, idx) => (
                    <span key={skill}>
                      <span className="text-white/85">{skill}</span>
                      {idx < domain.skills.length - 1 && (
                        <span className="mx-2 text-white/30" aria-hidden="true">
                          ·
                        </span>
                      )}
                    </span>
                  ))}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

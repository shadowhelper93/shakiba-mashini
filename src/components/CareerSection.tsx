'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import {
  CAREER_ROLES,
  CareerCategory,
  filterCareerRoles,
} from '../lib/portfolioData';
import { CareerTopologyStage } from './CareerTopologyStage';

const CAREER_FILTERS: Array<{ id: CareerCategory; label: string }> = [
  { id: 'all', label: 'All Roles' },
  { id: 'research', label: 'Research' },
  { id: 'clinical-industry', label: 'Clinical & Industry' },
  { id: 'teaching-leadership', label: 'Teaching & Leadership' },
];

export function CareerSection() {
  const [selectedCategory, setSelectedCategory] = useState<CareerCategory>('all');
  const [activeRoleId, setActiveRoleId] = useState<string>(CAREER_ROLES[0].id);

  const visibleRoles = useMemo(
    () => filterCareerRoles(CAREER_ROLES, selectedCategory),
    [selectedCategory],
  );

  // Ensure activeRoleId always stays synchronized with filtered roles
  useEffect(() => {
    if (!visibleRoles.some((r) => r.id === activeRoleId) && visibleRoles.length > 0) {
      setActiveRoleId(visibleRoles[0].id);
    }
  }, [visibleRoles, activeRoleId]);

  const activeRole =
    visibleRoles.find((r) => r.id === activeRoleId) ?? visibleRoles[0] ?? CAREER_ROLES[0];

  return (
    <section
      id="career"
      aria-labelledby="career-heading"
      className="relative scroll-mt-20 border-t border-white/8 bg-[#0a0c0c] py-20 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Header & Category Filter */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="text-xs font-medium tracking-[0.14em] text-white/50">
              03. Career Highlights
            </p>
            <h2
              id="career-heading"
              className="mt-4 text-3xl font-semibold leading-[1.12] tracking-[-0.02em] text-white sm:text-4xl"
            >
              Research, clinical modeling, and academic leadership.
            </h2>
          </div>

          <div
            role="group"
            aria-label="Filter career highlights"
            className="flex max-w-full shrink-0 items-center gap-1 overflow-x-auto rounded-lg border border-white/12 bg-[#000000] p-1"
          >
            {CAREER_FILTERS.map((filter) => {
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

        {/* Immersive 12-Column Interactive Research Observatory */}
        <div className="mt-10 grid grid-cols-1 gap-6 lg:mt-14 lg:grid-cols-12 lg:items-start lg:gap-10">
          {/* Interactive Role Selector: Horizontal Snap Strip on Mobile/Tablet, Vertical Rail on Desktop */}
          <div
            data-testid="career-list"
            className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory lg:col-span-5 lg:block lg:space-y-2.5 lg:overflow-visible lg:pb-0"
            role="list"
            aria-label="Career roles"
          >
            {visibleRoles.map((role, index) => {
              const isSelected = role.id === activeRole.id;
              return (
                <article
                  key={role.id}
                  role="listitem"
                  className="w-[265px] shrink-0 snap-start sm:w-[290px] lg:w-full"
                >
                  <button
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setActiveRoleId(role.id)}
                    className={`group flex h-full w-full items-start justify-between gap-3 rounded-xl border p-4 text-left transition-all duration-200 sm:p-5 ${
                      isSelected
                        ? 'border-white/35 bg-[#0c1515]'
                        : 'border-white/10 bg-[#000000]/70 hover:border-white/22 hover:bg-[#0c1515]/50'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] font-medium text-white/55">
                        <span className="tabular-nums text-white/40">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="tabular-nums">{role.period}</span>
                        {role.isCurrent && (
                          <>
                            <span aria-hidden="true" className="text-white/25">
                              ·
                            </span>
                            <span className="text-white">Present</span>
                          </>
                        )}
                      </div>

                      <h3 className="mt-2 text-[15px] font-semibold leading-snug text-white sm:text-[17px]">
                        {role.role}
                      </h3>

                      <p className="mt-1 truncate text-xs font-light text-white/68 sm:text-sm">
                        {role.organization}
                      </p>
                    </div>

                    <span
                      aria-hidden="true"
                      className={`mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-all duration-200 ${
                        isSelected
                          ? 'border-white bg-white text-[#0a0c0c]'
                          : 'border-white/12 text-white/50 group-hover:border-white/30 group-hover:text-white'
                      }`}
                    >
                      <ChevronRight size={15} />
                    </span>
                  </button>
                </article>
              );
            })}
          </div>

          {/* Right Synchronized 3D Scientific Visualization + Active Research Dossier (7 cols) */}
          <div className="space-y-6 lg:sticky lg:top-24 lg:col-span-7">
            <CareerTopologyStage
              pattern={activeRole.topologyPattern}
              caption={activeRole.topologyCaption}
              roleTitle={activeRole.role}
              organization={activeRole.organization}
            />

            <motion.div
              key={activeRole.id}
              data-testid="career-active-detail"
              initial={{ opacity: 0.25, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-2xl border border-white/12 bg-[#0c1515] p-6 sm:p-8"
            >
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-5">
                <div>
                  <p className="tabular-nums text-xs font-medium text-white/55">
                    {activeRole.period}
                    <span className="mx-2 text-white/25" aria-hidden="true">
                      ·
                    </span>
                    {activeRole.duration}
                    {activeRole.employmentType && (
                      <>
                        <span className="mx-2 text-white/25" aria-hidden="true">
                          ·
                        </span>
                        {activeRole.employmentType}
                      </>
                    )}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold tracking-[-0.015em] text-white sm:text-2xl">
                    {activeRole.role}
                  </h3>
                  <p className="mt-1 text-sm font-normal text-white/75">
                    {activeRole.organization}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <p className="text-xs font-light text-white/60">
                    {activeRole.location}
                  </p>
                  {activeRole.workMode && (
                    <p className="mt-0.5 text-xs font-light text-white/45">
                      {activeRole.workMode}
                    </p>
                  )}
                </div>
              </div>

              <p className="mt-5 text-[15px] font-light leading-[1.78] text-white/85">
                {activeRole.summary}
              </p>

              {activeRole.highlights.length > 0 && (
                <ul className="mt-5 space-y-2.5 text-sm font-light leading-[1.7] text-white/72">
                  {activeRole.highlights.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white/55"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5">
                <p className="text-xs font-normal text-white/60">
                  <span className="font-medium text-white/90">Skills: </span>
                  {activeRole.skills.join(' · ')}
                </p>

                <a
                  href={activeRole.organizationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[38px] shrink-0 items-center gap-1.5 whitespace-nowrap text-xs font-medium text-white/80 transition-colors hover:text-white"
                >
                  <span>Institution Profile</span>
                  <ArrowUpRight size={14} aria-hidden="true" />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

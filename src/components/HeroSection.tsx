'use client';

import { useMemo, useState } from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import {
  computeTopologyStats,
  generateCommunityGraph,
  TopologyMode,
} from '../lib/graphTopology';
import { PROFILE } from '../lib/portfolioData';
import { GraphTopologyCanvas } from './GraphTopologyCanvas';

const TOPOLOGY_MODES: Array<{
  id: TopologyMode;
  label: string;
  caption: string;
}> = [
  {
    id: 'full',
    label: 'Full Graph',
    caption: 'Dense intra- and inter-community connections prior to pruning',
  },
  {
    id: 'sparsified',
    label: 'Sparsified',
    caption: 'Community-aware edge pruning mitigating GNN oversmoothing',
  },
  {
    id: 'manifold',
    label: 'Manifold',
    caption: 'Sparse hub-anchored community backbone & topological skeleton',
  },
];

export function HeroSection() {
  const [topologyMode, setTopologyMode] = useState<TopologyMode>('sparsified');
  const [portraitFailed, setPortraitFailed] = useState(false);

  const graph = useMemo(() => generateCommunityGraph(22, 202501), []);
  const stats = useMemo(
    () => computeTopologyStats(graph, topologyMode),
    [graph, topologyMode],
  );
  const activeModeMeta =
    TOPOLOGY_MODES.find((item) => item.id === topologyMode) ?? TOPOLOGY_MODES[1];

  return (
    <section id="top" aria-label="Introduction" className="relative bg-[#000000]">
      {/* Primary Hero Stage: Typography Anchor + Unobstructed Live 3D Graph Manifold */}
      <div className="relative flex min-h-[78vh] flex-col justify-center overflow-hidden pt-20 pb-12 sm:min-h-[82vh] lg:min-h-[86vh] lg:pt-24 lg:pb-16">
        {/* Subtle tonal depth gradient from pure black to #0c1515 */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(66% 62% at 72% 46%, rgba(12, 21, 21, 0.94) 0%, rgba(10, 12, 12, 0.56) 52%, rgba(0, 0, 0, 1) 100%)',
          }}
        />

        {/* Interactive Three.js 3D Community-Aware Graph Manifold */}
        <GraphTopologyCanvas graph={graph} mode={topologyMode} />

        {/* Directional readability scrim keeping left typography crisp without muting the 3D manifold */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 lg:bg-gradient-to-r lg:from-[#000000]/92 lg:via-[#000000]/58 lg:via-50% lg:to-transparent"
          style={{
            background: undefined,
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#000000]/82 via-[#000000]/55 to-[#000000]/88 lg:hidden"
        />

        {/* Hero Foreground Composition */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-10">
          <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-12">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7"
            >
              <p className="text-xs font-medium tracking-[0.14em] text-white/65 sm:text-[13px]">
                PhD Student in Computer Science
                <span className="mx-2.5 text-white/30" aria-hidden="true">
                  ·
                </span>
                Atlanta, Georgia
              </p>

              <h1 className="mt-4 text-[clamp(2.7rem,6.4vw,5.4rem)] font-semibold leading-[0.98] tracking-[-0.03em] text-white">
                Shakiba
                <span className="block font-light text-white/92">Mashini</span>
              </h1>

              <p className="mt-6 max-w-xl text-base font-light leading-[1.7] text-white/80 sm:text-lg">
                {PROFILE.heroStatement}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-5 sm:gap-6">
                <a
                  href="#research"
                  className="inline-flex min-h-[46px] shrink-0 items-center gap-2.5 whitespace-nowrap rounded-lg bg-white px-7 py-3 text-sm font-semibold text-[#0a0c0c] transition-all duration-200 hover:bg-white/88"
                >
                  <span>Explore Research</span>
                  <ArrowDownRight size={16} aria-hidden="true" />
                </a>

                <a
                  href={PROFILE.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex min-h-[46px] shrink-0 items-center gap-2 whitespace-nowrap border-b border-white/30 pb-1 text-sm font-medium text-white/85 transition-colors duration-200 hover:border-white hover:text-white"
                >
                  <span>LinkedIn Profile</span>
                  <ArrowUpRight
                    size={15}
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </a>
              </div>

              {/* Interactive 3D Graph Sparsification Control Console */}
              <div className="mt-10 max-w-xl rounded-2xl border border-white/12 bg-[#0a0c0c]/92 p-4 sm:mt-12 sm:p-5">
                <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-medium text-white/92">
                      Interactive 3D Topology
                    </p>
                    <p className="mt-0.5 text-xs font-light text-white/60">
                      {activeModeMeta.caption}
                    </p>
                  </div>

                  <div
                    role="group"
                    aria-label="3D graph sparsification mode"
                    className="inline-flex w-full items-center justify-between gap-1 rounded-lg border border-white/12 bg-[#000000] p-1 sm:w-fit"
                  >
                    {TOPOLOGY_MODES.map((item) => {
                      const isActive = topologyMode === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          aria-pressed={isActive}
                          onClick={() => setTopologyMode(item.id)}
                          className={`min-h-[38px] flex-1 shrink-0 whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-200 sm:flex-none sm:px-3.5 ${
                            isActive
                              ? 'bg-white text-[#0a0c0c]'
                              : 'text-white/68 hover:text-white'
                          }`}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div
                  data-testid="topology-telemetry"
                  className="tabular-nums mt-3.5 flex flex-wrap items-center gap-x-3.5 gap-y-1 border-t border-white/10 pt-3 text-xs font-normal text-white/60"
                >
                  <span>{stats.nodeCount} nodes</span>
                  <span aria-hidden="true">·</span>
                  <span>
                    {stats.activeEdgeCount} / {stats.totalEdgeCount} active edges
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="font-medium text-white/85">
                    {stats.retentionPercent}% density
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Right Open Visual Stage Indicator (keeps 3D topology unobstructed) */}
            <div className="hidden lg:col-span-5 lg:flex lg:flex-col lg:items-end lg:justify-end">
              <div className="rounded-xl border border-white/10 bg-[#0a0c0c]/80 px-4 py-3 text-right">
                <p className="text-[11px] font-medium tracking-[0.12em] text-white/55">
                  3-COMMUNITY GRAPH MANIFOLD
                </p>
                <p className="mt-1 text-xs font-light text-white/78">
                  Move pointer to orbit · Switch pruning state left
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Academic Credentials Row: Ph.D. | Emory | 4.11 | 1st | Georgia State University */}
      <div
        aria-label="Academic credentials"
        data-testid="academic-credentials-strip"
        className="relative z-10 border-y border-white/12 bg-[#0a0c0c]"
      >
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-y divide-white/10 sm:grid-cols-3 lg:grid-cols-5 lg:divide-x lg:divide-y-0">
          {PROFILE.proofMetrics.map((metric, idx) => (
            <div
              key={metric.value}
              className={`px-5 py-5 sm:px-6 sm:py-6 lg:px-7 ${
                idx === PROFILE.proofMetrics.length - 1
                  ? 'col-span-2 sm:col-span-1'
                  : ''
              }`}
            >
              <p className="tabular-nums text-lg font-semibold tracking-tight text-white sm:text-xl lg:text-2xl">
                {metric.value}
              </p>
              <p className="mt-1 text-xs font-medium text-white/85">
                {metric.label}
              </p>
              <p className="mt-0.5 text-xs font-light text-white/52">
                {metric.detail}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Compact Editorial Portrait Composition — Directly Beneath Academic Credentials & Before About */}
      <div
        data-testid="hero-editorial-portrait"
        className="relative z-10 border-b border-white/10 bg-[#000000] py-10 sm:py-12 lg:py-14"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 items-center gap-6 overflow-hidden rounded-2xl border border-white/12 bg-[#0c1515]/85 p-4 sm:gap-8 sm:p-5 lg:grid-cols-12 lg:p-6"
          >
            {/* Full Editorial Portrait on Desktop, Compact on Mobile */}
            <figure className="relative overflow-hidden rounded-xl border border-white/12 bg-[#0a0c0c] lg:col-span-6">
              <div className="relative h-[230px] w-full sm:h-[275px] lg:h-[500px]">
                {!portraitFailed ? (
                  <img
                    src={PROFILE.portraits.editorialMono}
                    alt="Monochrome sunlit editorial portrait of Shakiba Mashini"
                    referrerPolicy="no-referrer"
                    fetchPriority="high"
                    onError={() => setPortraitFailed(true)}
                    className="h-full w-full object-cover object-[50%_24%] transition-transform duration-700 hover:scale-[1.02] lg:object-center"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center bg-[#0c1515] p-8 text-center">
                    <span className="text-3xl font-semibold tracking-tight text-white">
                      SM
                    </span>
                    <span className="mt-2 text-xs text-white/60">
                      Shakiba Mashini
                    </span>
                  </div>
                )}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#000000]/85 via-[#000000]/35 to-transparent"
                />
                <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 px-5 py-4">
                  <span className="text-xs font-medium text-white/90">
                    Shakiba Mashini
                  </span>
                  <span className="tabular-nums text-[11px] font-medium tracking-[0.1em] text-white/65">
                    ATL · GA
                  </span>
                </figcaption>
              </div>
            </figure>

            {/* Balanced Curatorial Context Beside the Portrait */}
            <div className="flex flex-col justify-between gap-6 px-1 py-1 sm:px-2 lg:col-span-6 lg:px-6">
              <div>
                <p className="text-xs font-medium tracking-[0.14em] text-white/55">
                  Doctoral &amp; Biomedical Focus
                </p>
                <h2 className="mt-3 text-xl font-semibold leading-[1.25] tracking-[-0.015em] text-white sm:text-2xl">
                  Bridging topological graph theory with computational medicine.
                </h2>
                <p className="mt-3.5 text-sm font-light leading-[1.75] text-white/74">
                  Pursuing a Ph.D. in Computer Science at Georgia State University
                  while advancing computational sequencing and biomedical research
                  workflows at Emory University School of Medicine.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-5 text-xs">
                <div>
                  <p className="font-light text-white/50">Doctoral Advisor</p>
                  <p className="mt-1 font-medium text-white/90">
                    {PROFILE.award.advisor}
                  </p>
                </div>
                <div>
                  <p className="font-light text-white/50">Primary Research</p>
                  <p className="mt-1 font-medium text-white/90">
                    Graph Sparsification
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

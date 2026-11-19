'use client';

import { useEffect, useRef, useState } from 'react';

interface ResearchPillar {
  id: string;
  label: string;
  eigenMode: number;
  detail: string;
}

const RESEARCH_PILLARS: ResearchPillar[] = [
  {
    id: 'sparsification',
    label: 'Graph Sparsification',
    eigenMode: 1.0,
    detail: 'Community-aware edge pruning preserving structural signal',
  },
  {
    id: 'robustness',
    label: 'GNN Robustness',
    eigenMode: 1.55,
    detail: 'Mitigating oversmoothing across deep relational layers',
  },
  {
    id: 'genomics',
    label: 'Biomedical Genomics',
    eigenMode: 2.15,
    detail: 'Computational sequencing workflows at Emory School of Medicine',
  },
  {
    id: 'topology',
    label: 'Applied Topology',
    eigenMode: 2.8,
    detail: 'Mathematical foundations in algorithms, topology, and statistics',
  },
];

interface WaveNode {
  col: number;
  row: number;
  xNorm: number;
  zNorm: number;
  phase: number;
  isAnchor: boolean;
}

export function SpectralFooterVisual() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activePillarIndex, setActivePillarIndex] = useState(0);
  const [pulseCount, setPulseCount] = useState(0);

  const stateRef = useRef({
    eigenMode: RESEARCH_PILLARS[0].eigenMode,
    targetEigen: RESEARCH_PILLARS[0].eigenMode,
    pulseOriginX: 0.5,
    pulseOriginY: 0.5,
    pulseAge: 0.25,
    pointerX: 0.5,
    pointerY: 0.5,
    pointerActive: false,
  });

  const triggerPillar = (idx: number) => {
    setActivePillarIndex(idx);
    setPulseCount((c) => c + 1);
    const s = stateRef.current;
    s.targetEigen = RESEARCH_PILLARS[idx].eigenMode;
    s.pulseOriginX = 0.2 + (idx / (RESEARCH_PILLARS.length - 1)) * 0.6;
    s.pulseOriginY = 0.48;
    s.pulseAge = 0;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = canvas.clientWidth || 1000;
    let height = canvas.clientHeight || 340;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const buildGrid = (w: number) => {
      const cols = w < 640 ? 15 : w < 1024 ? 22 : 30;
      const rows = w < 640 ? 7 : 10;
      const nodes: WaveNode[] = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const xNorm = c / (cols - 1);
          const zNorm = r / (rows - 1);
          const isAnchor =
            (r === Math.floor(rows / 2) && (c === Math.floor(cols * 0.2) || c === Math.floor(cols * 0.4) || c === Math.floor(cols * 0.6) || c === Math.floor(cols * 0.8))) ||
            ((c + r * 3) % 13 === 0);
          nodes.push({
            col: c,
            row: r,
            xNorm,
            zNorm,
            phase: xNorm * Math.PI * 3.1 + zNorm * Math.PI * 1.9,
            isAnchor,
          });
        }
      }
      return { cols, rows, nodes };
    };

    const resize = () => {
      if (!canvas) return;
      width = canvas.clientWidth || 1000;
      height = canvas.clientHeight || 340;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    let grid = buildGrid(width);
    let elapsed = 0;
    let lastTs = performance.now();
    let rafId = 0;

    const renderFrame = (now: number) => {
      const dt = Math.min(0.05, Math.max(0.001, (now - lastTs) / 1000));
      lastTs = now;
      if (!prefersReducedMotion) {
        elapsed += dt;
      }

      const st = stateRef.current;
      st.eigenMode += (st.targetEigen - st.eigenMode) * Math.min(1, dt * 3.5);
      st.pulseAge += dt * 0.68;

      ctx.clearRect(0, 0, width, height);

      const { cols, rows, nodes } = grid;
      const padX = width * 0.04;
      const spanX = width - padX * 2;
      const baseTop = height * 0.16;
      const spanY = height * 0.68;

      const projected: Array<{
        x: number;
        y: number;
        energy: number;
        isAnchor: boolean;
      }> = new Array(nodes.length);

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        // Perspective taper from back row (0) to foreground row (rows-1)
        const depth = 0.58 + n.zNorm * 0.42;
        const centeredX = (n.xNorm - 0.5) * spanX * (0.78 + n.zNorm * 0.26);
        const sx = width * 0.5 + centeredX;

        // Spectral eigenfunction elevation wave
        const waveA =
          Math.sin(n.xNorm * Math.PI * (2.6 + st.eigenMode * 0.7) + elapsed * 0.95) *
          Math.cos(n.zNorm * Math.PI * 1.6 - elapsed * 0.55);
        const waveB =
          Math.sin((n.xNorm + n.zNorm) * Math.PI * 3.2 - elapsed * 0.7) * 0.42;

        // Expanding GNN message-passing propagation ring
        const distPulse = Math.hypot(
          n.xNorm - st.pulseOriginX,
          (n.zNorm - st.pulseOriginY) * 0.75,
        );
        const waveFront = Math.max(0, 1 - Math.abs(distPulse - st.pulseAge * 0.85) * 6.5);
        const pulseDecay = Math.exp(-st.pulseAge * 1.15);
        const pulseLift = waveFront * pulseDecay;

        // Interactive pointer field excitation
        let pointerLift = 0;
        if (st.pointerActive) {
          const dPtr = Math.hypot(n.xNorm - st.pointerX, n.zNorm - st.pointerY);
          pointerLift = Math.max(0, 1 - dPtr * 3.6);
        }

        const amp = (height < 260 ? 18 : 26) * depth;
        const elevation = (waveA + waveB) * amp - pulseLift * 24 - pointerLift * 18;
        const sy = baseTop + n.zNorm * spanY + elevation;
        const energy = Math.min(
          1,
          Math.max(0, 0.25 + (waveA + 1) * 0.22 + pulseLift * 0.85 + pointerLift * 0.6),
        );

        projected[i] = { x: sx, y: sy, energy, isAnchor: n.isAnchor };
      }

      // Draw harmonic eigen-lattice edges (horizontal ridges + cross-community diagonals)
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const idx = r * cols + c;
          const p = projected[idx];

          if (c < cols - 1) {
            const right = projected[idx + 1];
            const e = (p.energy + right.energy) * 0.5;
            ctx.strokeStyle = `rgba(255, 255, 255, ${(0.06 + e * 0.28).toFixed(3)})`;
            ctx.lineWidth = 0.75 + e * 0.65;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(right.x, right.y);
            ctx.stroke();
          }

          if (r < rows - 1) {
            const down = projected[idx + cols];
            const e = (p.energy + down.energy) * 0.5;
            ctx.strokeStyle = `rgba(184, 206, 206, ${(0.04 + e * 0.16).toFixed(3)})`;
            ctx.lineWidth = 0.65;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(down.x, down.y);
            ctx.stroke();

            // Sparse topological diagonal shortcuts echoing graph sparsification
            if (c < cols - 1 && (c + r) % 4 === 0) {
              const diag = projected[idx + cols + 1];
              const ed = (p.energy + diag.energy) * 0.5;
              ctx.strokeStyle = `rgba(255, 255, 255, ${(0.03 + ed * 0.16).toFixed(3)})`;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(diag.x, diag.y);
              ctx.stroke();
            }
          }
        }
      }

      // Draw graph vertices with luminous hub halos
      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];
        const radius = p.isAnchor ? 2.8 + p.energy * 1.4 : 1.15 + p.energy * 0.85;

        if (p.isAnchor) {
          ctx.strokeStyle = `rgba(255, 255, 255, ${(0.18 + p.energy * 0.35).toFixed(3)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(p.x, p.y, radius + 4.5, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.fillStyle = `rgba(255, 255, 255, ${(0.22 + p.energy * 0.72).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!prefersReducedMotion) {
        rafId = window.requestAnimationFrame(renderFrame);
      }
    };

    renderFrame(performance.now());

    const handleResize = () => {
      resize();
      grid = buildGrid(width);
      if (prefersReducedMotion) renderFrame(performance.now());
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const activePillar = RESEARCH_PILLARS[activePillarIndex];

  return (
    <div
      data-testid="spectral-footer-visual"
      data-active-pillar={activePillar.id}
      data-pulse-count={pulseCount}
      className="relative overflow-hidden rounded-2xl border border-white/12 bg-[#000000]"
    >
      {/* Subtle tonal deep-spruce atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(70% 80% at 50% 45%, rgba(12, 21, 21, 0.96) 0%, rgba(10, 12, 12, 0.58) 58%, rgba(0, 0, 0, 1) 100%)',
        }}
      />

      {/* Interactive Eigen-Spectrum Canvas */}
      <div
        onPointerMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          stateRef.current.pointerX = (e.clientX - rect.left) / rect.width;
          stateRef.current.pointerY = (e.clientY - rect.top) / rect.height;
          stateRef.current.pointerActive = true;
        }}
        onPointerLeave={() => {
          stateRef.current.pointerActive = false;
        }}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          stateRef.current.pulseOriginX = (e.clientX - rect.left) / rect.width;
          stateRef.current.pulseOriginY = (e.clientY - rect.top) / rect.height;
          stateRef.current.pulseAge = 0;
          setPulseCount((c) => c + 1);
        }}
        className="relative z-10 cursor-crosshair"
      >
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="block h-[220px] w-full sm:h-[270px] lg:h-[310px]"
        />

        {/* Quiet Top-Left / Top-Right Scientific Coordinate Markers */}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex flex-wrap items-center justify-between gap-2 px-5 py-4 sm:px-7 sm:py-5">
          <span className="text-[11px] font-medium tracking-[0.14em] text-white/55">
            SPECTRAL GRAPH PROPAGATION
          </span>
          <span className="tabular-nums text-[11px] font-light text-white/50">
            λ = {activePillar.eigenMode.toFixed(2)} · Click lattice to propagate signal
          </span>
        </div>
      </div>

      {/* Interactive Research Pillar Selector Strip Integrated Into Footer Visual */}
      <div className="relative z-20 border-t border-white/10 bg-[#0a0c0c]/95 px-5 py-4 sm:px-7 sm:py-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-xs font-light leading-relaxed text-white/75 sm:text-sm">
            <span className="font-medium text-white">{activePillar.label}: </span>
            {activePillar.detail}
          </p>

          <div
            role="group"
            aria-label="Inspect spectral research eigenmodes"
            className="flex max-w-full shrink-0 items-center gap-1 overflow-x-auto rounded-lg border border-white/12 bg-[#000000] p-1"
          >
            {RESEARCH_PILLARS.map((pillar, idx) => {
              const isSelected = idx === activePillarIndex;
              return (
                <button
                  key={pillar.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => triggerPillar(idx)}
                  className={`min-h-[38px] shrink-0 whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-200 ${
                    isSelected
                      ? 'bg-white text-[#0a0c0c]'
                      : 'text-white/65 hover:text-white'
                  }`}
                >
                  {pillar.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

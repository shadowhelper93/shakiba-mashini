'use client';

import { useEffect, useRef } from 'react';
import { CareerTopologyPattern } from '../lib/portfolioData';

interface CareerTopologyStageProps {
  pattern: CareerTopologyPattern;
  caption: string;
  roleTitle: string;
  organization: string;
}

interface Vec3 {
  x: number;
  y: number;
  z: number;
  hub?: boolean;
  anomaly?: boolean;
}

interface EdgePair {
  a: number;
  b: number;
}

interface PatternSpec {
  nodes: Vec3[];
  edges: EdgePair[];
}

function buildPattern(pattern: CareerTopologyPattern, compact: boolean): PatternSpec {
  const nodes: Vec3[] = [];
  const edges: EdgePair[] = [];

  if (pattern === 'genomics') {
    const steps = compact ? 14 : 20;
    for (let i = 0; i < steps; i++) {
      const t = (i / (steps - 1)) * Math.PI * 3.2 - Math.PI * 1.6;
      const x = ((i / (steps - 1)) - 0.5) * 3.5;
      const r = 0.78;
      nodes.push({ x, y: Math.sin(t) * r, z: Math.cos(t) * r, hub: i % 4 === 0 });
      nodes.push({
        x,
        y: Math.sin(t + Math.PI) * r,
        z: Math.cos(t + Math.PI) * r,
        hub: i % 4 === 2,
      });
      const idxA = i * 2;
      const idxB = idxA + 1;
      edges.push({ a: idxA, b: idxB });
      if (i > 0) {
        edges.push({ a: idxA - 2, b: idxA });
        edges.push({ a: idxB - 2, b: idxB });
      }
    }
    return { nodes, edges };
  }

  if (pattern === 'graph-nn') {
    // 3-hop concentric community GNN with hub aggregation
    const clusters = [
      { cx: -1.15, cy: 0.48, cz: 0.2 },
      { cx: 1.15, cy: 0.35, cz: -0.25 },
      { cx: 0.0, cy: -0.95, cz: 0.35 },
    ];
    const perCluster = compact ? 7 : 10;
    clusters.forEach((c, ci) => {
      const hubIdx = nodes.length;
      nodes.push({ x: c.cx, y: c.cy, z: c.cz, hub: true });
      for (let i = 1; i < perCluster; i++) {
        const ang = (i / (perCluster - 1)) * Math.PI * 2 + ci * 0.7;
        const elev = ((i % 3) - 1) * 0.42;
        const rad = 0.58 + (i % 2) * 0.24;
        const idx = nodes.length;
        nodes.push({
          x: c.cx + Math.cos(ang) * rad,
          y: c.cy + Math.sin(ang) * rad * 0.82,
          z: c.cz + elev,
        });
        edges.push({ a: hubIdx, b: idx });
        if (i > 1) edges.push({ a: idx - 1, b: idx });
      }
      edges.push({ a: hubIdx + 1, b: nodes.length - 1 });
    });
    // Hub-to-hub structural bridges
    const h0 = 0;
    const h1 = perCluster;
    const h2 = perCluster * 2;
    edges.push({ a: h0, b: h1 }, { a: h1, b: h2 }, { a: h2, b: h0 });
    return { nodes, edges };
  }

  if (pattern === 'cloud-pipeline') {
    const layers = compact ? [3, 5, 5, 3] : [4, 6, 6, 4];
    const layerStarts: number[] = [];
    layers.forEach((count, li) => {
      layerStarts.push(nodes.length);
      const x = ((li / (layers.length - 1)) - 0.5) * 3.2;
      for (let j = 0; j < count; j++) {
        const y = ((j / Math.max(1, count - 1)) - 0.5) * 1.9;
        const z = Math.sin(li * 1.2 + j * 0.9) * 0.52;
        nodes.push({ x, y, z, hub: li === 1 || li === 2 ? j === 0 || j === count - 1 : true });
      }
    });
    for (let li = 0; li < layers.length - 1; li++) {
      const startA = layerStarts[li];
      const startB = layerStarts[li + 1];
      for (let i = 0; i < layers[li]; i++) {
        for (let j = 0; j < layers[li + 1]; j++) {
          if ((i + j) % 2 === 0 || Math.abs(i - j) <= 1) {
            edges.push({ a: startA + i, b: startB + j });
          }
        }
      }
    }
    return { nodes, edges };
  }

  if (pattern === 'statistics-lattice') {
    // 3D Gaussian probability density surface mesh
    const cols = compact ? 6 : 8;
    const rows = compact ? 5 : 6;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const u = (c / (cols - 1) - 0.5) * 3.1;
        const v = (r / (rows - 1) - 0.5) * 2.2;
        const bell = Math.exp(-(u * u * 0.65 + v * v * 0.9)) * 1.35 - 0.45;
        nodes.push({ x: u, y: bell, z: v, hub: bell > 0.55 });
        const idx = r * cols + c;
        if (c > 0) edges.push({ a: idx - 1, b: idx });
        if (r > 0) edges.push({ a: idx - cols, b: idx });
      }
    }
    return { nodes, edges };
  }

  if (pattern === 'clinical-pathway') {
    const layers = compact ? [4, 6, 4, 2] : [5, 7, 5, 3];
    const starts: number[] = [];
    layers.forEach((cnt, li) => {
      starts.push(nodes.length);
      const x = ((li / (layers.length - 1)) - 0.5) * 3.2;
      for (let i = 0; i < cnt; i++) {
        const y = ((i / Math.max(1, cnt - 1)) - 0.5) * 2.0;
        const z = Math.cos(i * 1.1 + li) * 0.48;
        nodes.push({ x, y, z, hub: li === layers.length - 1 || i === Math.floor(cnt / 2) });
      }
    });
    for (let li = 0; li < layers.length - 1; li++) {
      for (let i = 0; i < layers[li]; i++) {
        for (let j = 0; j < layers[li + 1]; j++) {
          if (Math.abs(i / layers[li] - j / layers[li + 1]) < 0.48) {
            edges.push({ a: starts[li] + i, b: starts[li + 1] + j });
          }
        }
      }
    }
    return { nodes, edges };
  }

  if (pattern === 'fraud-graph') {
    // Dense legitimate cluster + isolated anomaly nodes
    const coreCount = compact ? 16 : 24;
    for (let i = 0; i < coreCount; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / coreCount);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const rad = 0.88;
      nodes.push({
        x: -0.42 + rad * Math.sin(phi) * Math.cos(theta),
        y: rad * Math.sin(phi) * Math.sin(theta) * 0.85,
        z: rad * Math.cos(phi),
        hub: i < 3,
      });
    }
    for (let i = 0; i < coreCount; i++) {
      for (let j = i + 1; j < coreCount; j++) {
        const a = nodes[i];
        const b = nodes[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
        if (d < 0.92) edges.push({ a: i, b: j });
      }
    }
    // Isolated fraudulent listing outliers
    const outliers: Vec3[] = [
      { x: 1.45, y: 0.72, z: 0.25, hub: true, anomaly: true },
      { x: 1.65, y: -0.15, z: -0.32, hub: true, anomaly: true },
      { x: 1.32, y: -0.78, z: 0.35, hub: true, anomaly: true },
    ];
    outliers.forEach((o, oi) => {
      const idx = nodes.length;
      nodes.push(o);
      edges.push({ a: oi, b: idx });
    });
    return { nodes, edges };
  }

  // cohort-network (MSDA Ambassador): central mentorship core + twin orbital rings
  nodes.push({ x: 0, y: 0, z: 0, hub: true });
  const innerN = compact ? 7 : 10;
  const outerN = compact ? 10 : 14;
  for (let i = 0; i < innerN; i++) {
    const a = (i / innerN) * Math.PI * 2;
    const idx = nodes.length;
    nodes.push({ x: Math.cos(a) * 0.85, y: Math.sin(a) * 0.65, z: Math.sin(a * 2) * 0.35, hub: i % 3 === 0 });
    edges.push({ a: 0, b: idx });
    if (i > 0) edges.push({ a: idx - 1, b: idx });
  }
  edges.push({ a: 1, b: innerN });
  for (let i = 0; i < outerN; i++) {
    const a = (i / outerN) * Math.PI * 2 + 0.2;
    const idx = nodes.length;
    nodes.push({ x: Math.cos(a) * 1.55, y: Math.sin(a) * 1.05, z: Math.cos(a * 3) * 0.45 });
    const innerTarget = 1 + (i % innerN);
    edges.push({ a: innerTarget, b: idx });
  }
  return { nodes, edges };
}

export function CareerTopologyStage({
  pattern,
  caption,
  roleTitle,
  organization,
}: CareerTopologyStageProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const patternRef = useRef<CareerTopologyPattern>(pattern);

  useEffect(() => {
    patternRef.current = pattern;
  }, [pattern]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = canvas.clientWidth || 640;
    let height = canvas.clientHeight || 280;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      if (!canvas) return;
      width = canvas.clientWidth || 640;
      height = canvas.clientHeight || 280;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    let currentPattern = patternRef.current;
    let spec = buildPattern(currentPattern, width < 640);
    let elapsed = 0;
    let rafId = 0;
    let lastTs = performance.now();

    const draw = (now: number) => {
      const dt = Math.min(0.05, Math.max(0.001, (now - lastTs) / 1000));
      lastTs = now;
      if (!prefersReducedMotion) {
        elapsed += dt;
      }

      if (currentPattern !== patternRef.current) {
        currentPattern = patternRef.current;
        spec = buildPattern(currentPattern, width < 640);
      }

      const ptr = pointerRef.current;
      ptr.x += (ptr.tx - ptr.x) * Math.min(1, dt * 4);
      ptr.y += (ptr.ty - ptr.y) * Math.min(1, dt * 4);

      ctx.clearRect(0, 0, width, height);

      // Architectural coordinate reticle lines in subtle white opacity
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.045)';
      ctx.lineWidth = 1;
      const gridStep = 44;
      ctx.beginPath();
      for (let gx = (width % gridStep) * 0.5; gx < width; gx += gridStep) {
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, height);
      }
      for (let gy = (height % gridStep) * 0.5; gy < height; gy += gridStep) {
        ctx.moveTo(0, gy);
        ctx.lineTo(width, gy);
      }
      ctx.stroke();

      // Perspective 3D projection
      const yaw = elapsed * 0.32 + ptr.x * 0.55;
      const pitch = 0.24 + Math.sin(elapsed * 0.4) * 0.08 - ptr.y * 0.35;
      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);
      const cosX = Math.cos(pitch);
      const sinX = Math.sin(pitch);

      const cx = width * 0.5;
      const cy = height * 0.5;
      const scaleBase = Math.min(width * 0.23, height * 0.42);
      const camDist = 5.2;

      const projected = spec.nodes.map((n) => {
        const rx = n.x * cosY - n.z * sinY;
        const rz1 = n.x * sinY + n.z * cosY;
        const ry = n.y * cosX - rz1 * sinX;
        const rz = n.y * sinX + rz1 * cosX;
        const depth = camDist / Math.max(1.2, camDist - rz);
        return {
          sx: cx + rx * scaleBase * depth,
          sy: cy - ry * scaleBase * depth,
          depth,
          rz,
          hub: Boolean(n.hub),
          anomaly: Boolean(n.anomaly),
        };
      });

      // Draw edges with depth-weighted contrast
      for (let i = 0; i < spec.edges.length; i++) {
        const e = spec.edges[i];
        const a = projected[e.a];
        const b = projected[e.b];
        if (!a || !b) continue;
        const avgDepth = (a.depth + b.depth) * 0.5;
        const alpha = Math.max(0.08, Math.min(0.45, (avgDepth - 0.65) * 0.62));
        ctx.strokeStyle =
          a.anomaly || b.anomaly
            ? `rgba(255, 255, 255, ${alpha * 1.15})`
            : `rgba(218, 232, 232, ${alpha})`;
        ctx.lineWidth = a.hub && b.hub ? 1.3 : 0.85;
        ctx.beginPath();
        ctx.moveTo(a.sx, a.sy);
        ctx.lineTo(b.sx, b.sy);
        ctx.stroke();

        // Travelling data-science signal pulse along selected edges
        if (!prefersReducedMotion && i % 5 === 0) {
          const pulseT = (elapsed * 0.55 + i * 0.19) % 1;
          const px = a.sx + (b.sx - a.sx) * pulseT;
          const py = a.sy + (b.sy - a.sy) * pulseT;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.82)';
          ctx.beginPath();
          ctx.arc(px, py, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Draw vertices sorted back-to-front
      const sortedIdx = projected
        .map((p, idx) => ({ p, idx }))
        .sort((u, v) => u.p.rz - v.p.rz);

      for (const { p } of sortedIdx) {
        const r = (p.hub ? 4.2 : 2.3) * Math.max(0.75, Math.min(1.4, p.depth));
        if (p.anomaly) {
          // Concentric outlier ring for EMSCAD anomaly visualization
          const ringR = r + 4 + Math.sin(elapsed * 2.4) * 2;
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(p.sx, p.sy, ringR, 0, Math.PI * 2);
          ctx.stroke();
        } else if (p.hub) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(p.sx, p.sy, r + 3.2, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.fillStyle = p.hub
          ? 'rgba(255, 255, 255, 0.96)'
          : `rgba(195, 212, 212, ${Math.max(0.35, Math.min(0.88, p.depth * 0.72))})`;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!prefersReducedMotion) {
        rafId = window.requestAnimationFrame(draw);
      }
    };

    draw(performance.now());
    const handleResize = () => {
      resize();
      spec = buildPattern(patternRef.current, width < 640);
      if (prefersReducedMotion) draw(performance.now());
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
    };
  }, [pattern]);

  return (
    <div
      data-testid="career-topology-stage"
      data-pattern={pattern}
      onPointerMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        pointerRef.current.tx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        pointerRef.current.ty = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      }}
      onPointerLeave={() => {
        pointerRef.current.tx = 0;
        pointerRef.current.ty = 0;
      }}
      className="relative overflow-hidden rounded-2xl border border-white/12 bg-[#000000]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(65% 75% at 50% 48%, rgba(12, 21, 21, 0.95) 0%, rgba(10, 12, 12, 0.5) 60%, rgba(0, 0, 0, 1) 100%)',
        }}
      />

      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="relative z-10 block h-[220px] w-full sm:h-[260px] lg:h-[285px]"
      />

      {/* Top Overlay Header */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between gap-4 px-5 py-4">
        <span className="text-[11px] font-medium tracking-[0.12em] text-white/60">
          LIVE SCIENTIFIC TOPOLOGY
        </span>
        <span className="tabular-nums text-[11px] font-normal text-white/50">
          {roleTitle}
        </span>
      </div>

      {/* Bottom Caption Bar */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 bg-[#0a0c0c]/95 px-5 py-3 text-xs">
        <p className="font-light text-white/75">{caption}</p>
        <p className="font-medium text-white/55">{organization}</p>
      </div>
    </div>
  );
}

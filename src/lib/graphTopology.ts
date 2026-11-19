export type TopologyMode = 'full' | 'sparsified' | 'manifold';

export interface GraphNode {
  id: number;
  community: number;
  x: number;
  y: number;
  z: number;
  isHub: boolean;
  scale: number;
  phase: number;
}

export interface GraphEdge {
  source: number;
  target: number;
  isInterCommunity: boolean;
  weight: number;
  keepInSparsified: boolean;
  keepInManifold: boolean;
}

export interface CommunityGraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  communityCenters: Array<{ x: number; y: number; z: number }>;
}

/**
 * Deterministic mulberry32 PRNG so 3D graph topology is reproducible across
 * renders and unit tests.
 */
export function createSeededRng(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Generates a 3-community 3D graph structure representing Shakiba Mashini's
 * doctoral research in community-aware graph sparsification and Graph Neural
 * Networks.
 */
export function generateCommunityGraph(
  nodesPerCommunity = 22,
  seed = 202501,
): CommunityGraphData {
  const rng = createSeededRng(seed);
  const communityCenters = [
    { x: -1.85, y: 0.95, z: 0.35 },
    { x: 1.95, y: 0.55, z: -0.45 },
    { x: 0.1, y: -1.55, z: 0.65 },
  ];

  const nodes: GraphNode[] = [];
  let nodeId = 0;

  for (let c = 0; c < communityCenters.length; c++) {
    const center = communityCenters[c];
    for (let i = 0; i < nodesPerCommunity; i++) {
      const isHub = i < 3;
      const u = rng();
      const v = rng();
      const theta = u * Math.PI * 2;
      const phi = Math.acos(2 * v - 1);
      const radius = isHub ? 0.25 + rng() * 0.42 : 0.65 + rng() * 1.15;

      const x = center.x + radius * Math.sin(phi) * Math.cos(theta);
      const y = center.y + radius * Math.sin(phi) * Math.sin(theta) * 0.88;
      const z = center.z + radius * Math.cos(phi) * 0.92;

      nodes.push({
        id: nodeId++,
        community: c,
        x,
        y,
        z,
        isHub,
        scale: isHub ? 1.42 + rng() * 0.35 : 0.58 + rng() * 0.48,
        phase: rng() * Math.PI * 2,
      });
    }
  }

  const edges: GraphEdge[] = [];
  const intraThreshold = 1.48;
  const interThreshold = 3.05;

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i];
      const b = nodes[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const dz = a.z - b.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (a.community === b.community) {
        if (dist < intraThreshold) {
          const weight = Math.max(0.15, 1 - dist / intraThreshold);
          // Community-aware sparsification retains strong intra-community structure
          const keepInSparsified = a.isHub || b.isHub || weight > 0.32;
          // Manifold backbone retains hub-anchored high-affinity edges only
          const keepInManifold = (a.isHub || b.isHub) && weight > 0.28;
          edges.push({
            source: a.id,
            target: b.id,
            isInterCommunity: false,
            weight,
            keepInSparsified,
            keepInManifold,
          });
        }
      } else if (dist < interThreshold && rng() < 0.14) {
        const weight = Math.max(0.1, 1 - dist / interThreshold);
        // Prune noisy cross-community bridges to mitigate oversmoothing,
        // keeping only a minimal backbone of hub-to-hub bridges.
        const keepInSparsified = a.isHub && b.isHub && weight > 0.38;
        edges.push({
          source: a.id,
          target: b.id,
          isInterCommunity: true,
          weight,
          keepInSparsified,
          keepInManifold: false,
        });
      }
    }
  }

  return { nodes, edges, communityCenters };
}

export function getActiveEdgesForMode(
  edges: GraphEdge[],
  mode: TopologyMode,
): GraphEdge[] {
  if (mode === 'full') return edges;
  if (mode === 'sparsified') {
    return edges.filter((edge) => edge.keepInSparsified);
  }
  // Manifold mode highlights hub-anchored community backbone only
  return edges.filter((edge) => edge.keepInManifold);
}

export interface TopologyStats {
  nodeCount: number;
  totalEdgeCount: number;
  activeEdgeCount: number;
  interCommunityActiveCount: number;
  retentionPercent: number;
}

export function computeTopologyStats(
  graph: CommunityGraphData,
  mode: TopologyMode,
): TopologyStats {
  const active = getActiveEdgesForMode(graph.edges, mode);
  const interActive = active.filter((edge) => edge.isInterCommunity).length;
  const retentionPercent =
    graph.edges.length === 0
      ? 0
      : Math.round((active.length / graph.edges.length) * 100);

  return {
    nodeCount: graph.nodes.length,
    totalEdgeCount: graph.edges.length,
    activeEdgeCount: active.length,
    interCommunityActiveCount: interActive,
    retentionPercent,
  };
}

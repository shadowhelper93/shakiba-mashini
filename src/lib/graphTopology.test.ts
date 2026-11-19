import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeTopologyStats,
  generateCommunityGraph,
  getActiveEdgesForMode,
} from './graphTopology';

test('generateCommunityGraph produces deterministic 3-community topology', () => {
  const g1 = generateCommunityGraph(22, 202501);
  const g2 = generateCommunityGraph(22, 202501);

  assert.equal(g1.nodes.length, 66);
  assert.equal(g1.communityCenters.length, 3);
  assert.deepEqual(g1.nodes[0], g2.nodes[0]);
  assert.equal(g1.edges.length, g2.edges.length);
  assert.ok(g1.edges.length > 60, 'Expected rich graph connectivity');

  const communities = new Set(g1.nodes.map((n) => n.community));
  assert.deepEqual([...communities].sort(), [0, 1, 2]);
});

test('community-aware sparsification prunes inter-community bridges while keeping intra structure', () => {
  const graph = generateCommunityGraph(22, 202501);
  const fullStats = computeTopologyStats(graph, 'full');
  const sparsifiedStats = computeTopologyStats(graph, 'sparsified');
  const manifoldStats = computeTopologyStats(graph, 'manifold');

  assert.equal(fullStats.retentionPercent, 100);
  assert.ok(
    sparsifiedStats.activeEdgeCount < fullStats.activeEdgeCount,
    'Sparsified mode should prune edges compared to full graph',
  );
  assert.ok(
    sparsifiedStats.interCommunityActiveCount < fullStats.interCommunityActiveCount,
    'Sparsified mode should reduce noisy inter-community bridges',
  );
  assert.equal(
    manifoldStats.interCommunityActiveCount,
    0,
    'Manifold mode should isolate communities with zero cross-community edges',
  );
  assert.ok(
    manifoldStats.activeEdgeCount > 0 &&
      manifoldStats.activeEdgeCount < sparsifiedStats.activeEdgeCount,
    'Manifold mode must isolate a strictly sparser intra-community hub backbone',
  );
});

test('getActiveEdgesForMode returns subset of edges with valid node indices', () => {
  const graph = generateCommunityGraph(15, 42);
  const sparsified = getActiveEdgesForMode(graph.edges, 'sparsified');
  for (const edge of sparsified) {
    assert.ok(edge.source >= 0 && edge.source < graph.nodes.length);
    assert.ok(edge.target >= 0 && edge.target < graph.nodes.length);
    assert.equal(edge.keepInSparsified, true);
  }
});

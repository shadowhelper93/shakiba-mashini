'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  CommunityGraphData,
  TopologyMode,
} from '../lib/graphTopology';

interface GraphTopologyCanvasProps {
  graph: CommunityGraphData;
  mode: TopologyMode;
}

const _dummyPos = new THREE.Vector3();
const _dummyQuat = new THREE.Quaternion();
const _dummyScale = new THREE.Vector3();
const _dummyMat = new THREE.Matrix4();
const _euler = new THREE.Euler();

function detectSoftwareGl(): boolean {
  try {
    const probe = document.createElement('canvas');
    const gl = probe.getContext('webgl2') || probe.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) ?? '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

export function GraphTopologyCanvas({ graph, mode }: GraphTopologyCanvasProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const modeRef = useRef<TopologyMode>(mode);
  const requestRenderRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    modeRef.current = mode;
    requestRenderRef.current?.();
  }, [mode]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isSoftwareGl = detectSoftwareGl();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(
      isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2),
    );
    renderer.shadowMap.enabled = false;
    renderer.setClearColor(0x000000, 0);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    renderer.setSize(width, height);

    const canvas = renderer.domElement;
    canvas.setAttribute('data-testid', 'graph-canvas');
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    container.appendChild(canvas);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0c0c, 0.048);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTarget = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    const applyResponsiveCamera = (w: number, h: number) => {
      camera.aspect = w / h;
      if (w >= 1024) {
        camera.fov = 40;
        camera.position.set(0.1, 0.12, 8.2);
        rootGroup.position.set(1.75, 0.08, 0);
        rootGroup.scale.setScalar(1.06);
      } else if (w >= 640) {
        camera.fov = 44;
        camera.position.set(0, 0.15, 9.2);
        rootGroup.position.set(1.1, 0.1, 0);
        rootGroup.scale.setScalar(0.92);
      } else {
        // Mobile: pull back slightly & elevate so topology frames cleanly without cluttering headline text
        camera.fov = 48;
        camera.position.set(0, 0.25, 10.6);
        rootGroup.position.set(0.55, 0.45, -0.4);
        rootGroup.scale.setScalar(0.76);
      }
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
    };
    applyResponsiveCamera(width, height);

    // Balanced studio lighting rig with subtle warm/cool architectural contrast
    const hemiLight = new THREE.HemisphereLight(0xdbe8e8, 0x0c1515, 1.12);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.35);
    keyLight.position.set(6, 7, 8);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xc2d6d6, 1.45);
    rimLight.position.set(-7, -3, -5);
    scene.add(rimLight);

    const disposables: Array<{ dispose: () => void }> = [];

    // 1. Composite 3-part Community Core Sculptures (outer metallic ring, matte core, inner equatorial ring)
    const outerRingGeo = new THREE.TorusGeometry(0.68, 0.017, 14, 64);
    const innerRingGeo = new THREE.TorusGeometry(0.42, 0.011, 12, 48);
    const coreOctaGeo = new THREE.OctahedronGeometry(0.18, 0);
    disposables.push(outerRingGeo, innerRingGeo, coreOctaGeo);

    const outerRingMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.88,
      roughness: 0.2,
      transparent: true,
      opacity: 0.58,
    });
    const innerRingMat = new THREE.MeshStandardMaterial({
      color: 0xbacaca,
      metalness: 0.72,
      roughness: 0.34,
      transparent: true,
      opacity: 0.4,
    });
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x0c1515,
      metalness: 0.25,
      roughness: 0.76,
    });
    disposables.push(outerRingMat, innerRingMat, coreMat);

    const communityAssemblies: THREE.Group[] = [];
    graph.communityCenters.forEach((center, idx) => {
      const assembly = new THREE.Group();
      assembly.position.set(center.x, center.y, center.z);

      const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
      outerRing.rotation.set(0.75 + idx * 0.6, 0.45 * idx, 0.3);

      const innerRing = new THREE.Mesh(innerRingGeo, innerRingMat);
      innerRing.rotation.set(-0.6 + idx * 0.4, 1.1 + idx * 0.5, 0.2);

      const core = new THREE.Mesh(coreOctaGeo, coreMat);
      assembly.add(outerRing, innerRing, core);
      rootGroup.add(assembly);
      communityAssemblies.push(assembly);
    });

    // 2. Global Topological Manifold Dual Rings (accentuated in manifold mode)
    const manifoldGroup = new THREE.Group();
    const globalRingGeoA = new THREE.TorusGeometry(3.45, 0.01, 12, 96);
    const globalRingGeoB = new THREE.TorusGeometry(2.75, 0.0085, 12, 84);
    const manifoldRingMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.85,
      roughness: 0.22,
      transparent: true,
      opacity: 0.22,
    });
    disposables.push(globalRingGeoA, globalRingGeoB, manifoldRingMat);

    const globalRingA = new THREE.Mesh(globalRingGeoA, manifoldRingMat);
    globalRingA.rotation.set(Math.PI * 0.36, Math.PI * 0.12, 0);
    const globalRingB = new THREE.Mesh(globalRingGeoB, manifoldRingMat);
    globalRingB.rotation.set(-Math.PI * 0.28, Math.PI * 0.44, Math.PI * 0.18);
    manifoldGroup.add(globalRingA, globalRingB);
    rootGroup.add(manifoldGroup);

    // 3. Instanced Hub & Satellite Nodes (zero single-primitive monotony, varied PBR roughness)
    const hubNodes = graph.nodes.filter((n) => n.isHub);
    const satNodes = graph.nodes.filter((n) => !n.isHub);

    const hubGeo = new THREE.IcosahedronGeometry(0.09, 0);
    const hubMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.9,
      roughness: 0.16,
    });
    const hubInstanced = new THREE.InstancedMesh(hubGeo, hubMat, hubNodes.length);
    hubInstanced.frustumCulled = false;

    const satGeo = new THREE.OctahedronGeometry(0.056, 0);
    const satMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.28,
      roughness: 0.64,
    });
    const satInstanced = new THREE.InstancedMesh(satGeo, satMat, satNodes.length);
    satInstanced.frustumCulled = false;
    disposables.push(hubGeo, hubMat, satGeo, satMat);

    const satTintPalette = [
      new THREE.Color(0xffffff),
      new THREE.Color(0xa6baba),
      new THREE.Color(0x587272),
    ];

    hubNodes.forEach((node, i) => {
      _dummyPos.set(node.x, node.y, node.z);
      _euler.set(node.phase, node.phase * 0.7, 0);
      _dummyQuat.setFromEuler(_euler);
      _dummyScale.setScalar(node.scale);
      _dummyMat.compose(_dummyPos, _dummyQuat, _dummyScale);
      hubInstanced.setMatrixAt(i, _dummyMat);
    });
    hubInstanced.instanceMatrix.needsUpdate = true;

    satNodes.forEach((node, i) => {
      _dummyPos.set(node.x, node.y, node.z);
      _euler.set(node.phase * 0.5, node.phase, 0);
      _dummyQuat.setFromEuler(_euler);
      _dummyScale.setScalar(node.scale);
      _dummyMat.compose(_dummyPos, _dummyQuat, _dummyScale);
      satInstanced.setMatrixAt(i, _dummyMat);
      satInstanced.setColorAt(i, satTintPalette[node.community % satTintPalette.length]);
    });
    satInstanced.instanceMatrix.needsUpdate = true;
    if (satInstanced.instanceColor) {
      satInstanced.instanceColor.needsUpdate = true;
    }

    rootGroup.add(hubInstanced, satInstanced);

    // 4. Five Edge Layers for Distinct Full -> Sparsified -> Manifold Transitions
    const buildLineSegments = (
      edgeList: typeof graph.edges,
      color: number,
      initialOpacity: number,
    ) => {
      const positions = new Float32Array(edgeList.length * 6);
      edgeList.forEach((edge, i) => {
        const a = graph.nodes[edge.source];
        const b = graph.nodes[edge.target];
        const offset = i * 6;
        positions[offset] = a.x;
        positions[offset + 1] = a.y;
        positions[offset + 2] = a.z;
        positions[offset + 3] = b.x;
        positions[offset + 4] = b.y;
        positions[offset + 5] = b.z;
      });
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const mat = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: initialOpacity,
        depthWrite: false,
      });
      disposables.push(geo, mat);
      return { lines: new THREE.LineSegments(geo, mat), mat };
    };

    const intraManifoldEdges = graph.edges.filter((e) => e.keepInManifold);
    const intraSparsifiedOnlyEdges = graph.edges.filter(
      (e) => !e.isInterCommunity && e.keepInSparsified && !e.keepInManifold,
    );
    const intraPrunedEdges = graph.edges.filter(
      (e) => !e.isInterCommunity && !e.keepInSparsified,
    );
    const interKeptEdges = graph.edges.filter(
      (e) => e.isInterCommunity && e.keepInSparsified,
    );
    const interPrunedEdges = graph.edges.filter(
      (e) => e.isInterCommunity && !e.keepInSparsified,
    );

    const intraManifold = buildLineSegments(intraManifoldEdges, 0xffffff, 0.5);
    const intraSparsified = buildLineSegments(intraSparsifiedOnlyEdges, 0xd4e2e2, 0.32);
    const intraPruned = buildLineSegments(intraPrunedEdges, 0x8ea3a3, 0.16);
    const interKept = buildLineSegments(interKeptEdges, 0xd9e6e6, 0.28);
    const interPruned = buildLineSegments(interPrunedEdges, 0x566c6c, 0.16);

    rootGroup.add(
      intraManifold.lines,
      intraSparsified.lines,
      intraPruned.lines,
      interKept.lines,
      interPruned.lines,
    );

    // Subtle atmospheric coordinate starfield points (lighter on narrow viewports)
    const dustCount = width < 768 ? 64 : 120;
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      const t = (i / dustCount) * Math.PI * 2;
      const r = 3.8 + ((i * 37) % 100) * 0.036;
      const y = (((i * 53) % 100) / 100 - 0.5) * 6.4;
      dustPositions[i * 3] = Math.cos(t * 7) * r;
      dustPositions[i * 3 + 1] = y;
      dustPositions[i * 3 + 2] = Math.sin(t * 7) * r - 1.2;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.025,
      transparent: true,
      opacity: 0.26,
      depthWrite: false,
    });
    disposables.push(dustGeo, dustMat);
    const dustPoints = new THREE.Points(dustGeo, dustMat);
    rootGroup.add(dustPoints);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Pointer parallax & scroll choreography refs
    const pointer = { targetX: 0, targetY: 0, currentX: 0, currentY: 0 };
    let scrollFactor = 0;

    const handlePointerMove = (e: PointerEvent) => {
      pointer.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
      if (prefersReducedMotion) requestRender();
    };

    const handleScroll = () => {
      const heroH = Math.max(window.innerHeight, 600);
      scrollFactor = Math.min(1, Math.max(0, window.scrollY / heroH));
      if (prefersReducedMotion) requestRender();
    };

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      applyResponsiveCamera(w, h);
      renderer.setSize(w, h);
      if (prefersReducedMotion) requestRender();
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    // Frame scheduling with software WebGL fenceSync pacing
    let frameId = 0;
    let disposed = false;
    let lastTime = performance.now();
    let elapsed = 0;
    let renderBusy = false;
    let renderDirty = false;

    const applyModeTargets = (delta: number, snap = false) => {
      const m = modeRef.current;
      const targetIntraManifold = m === 'manifold' ? 0.68 : m === 'sparsified' ? 0.48 : 0.34;
      const targetIntraSparsified = m === 'manifold' ? 0.0 : m === 'sparsified' ? 0.36 : 0.26;
      const targetIntraPruned = m === 'full' ? 0.18 : 0.0;
      const targetInterKept = m === 'full' ? 0.28 : m === 'sparsified' ? 0.32 : 0.0;
      const targetInterPruned = m === 'full' ? 0.18 : 0.0;
      const targetManifold = m === 'manifold' ? 0.6 : m === 'sparsified' ? 0.28 : 0.14;
      const targetOuterRing = m === 'manifold' ? 0.78 : m === 'sparsified' ? 0.56 : 0.34;

      if (snap) {
        intraManifold.mat.opacity = targetIntraManifold;
        intraSparsified.mat.opacity = targetIntraSparsified;
        intraPruned.mat.opacity = targetIntraPruned;
        interKept.mat.opacity = targetInterKept;
        interPruned.mat.opacity = targetInterPruned;
        manifoldRingMat.opacity = targetManifold;
        outerRingMat.opacity = targetOuterRing;
      } else {
        const lambda = 5.5;
        intraManifold.mat.opacity = THREE.MathUtils.damp(intraManifold.mat.opacity, targetIntraManifold, lambda, delta);
        intraSparsified.mat.opacity = THREE.MathUtils.damp(intraSparsified.mat.opacity, targetIntraSparsified, lambda, delta);
        intraPruned.mat.opacity = THREE.MathUtils.damp(intraPruned.mat.opacity, targetIntraPruned, lambda, delta);
        interKept.mat.opacity = THREE.MathUtils.damp(interKept.mat.opacity, targetInterKept, lambda, delta);
        interPruned.mat.opacity = THREE.MathUtils.damp(interPruned.mat.opacity, targetInterPruned, lambda, delta);
        manifoldRingMat.opacity = THREE.MathUtils.damp(manifoldRingMat.opacity, targetManifold, lambda, delta);
        outerRingMat.opacity = THREE.MathUtils.damp(outerRingMat.opacity, targetOuterRing, lambda, delta);
      }

      intraSparsified.lines.visible = intraSparsified.mat.opacity > 0.008;
      intraPruned.lines.visible = intraPruned.mat.opacity > 0.008;
      interKept.lines.visible = interKept.mat.opacity > 0.008;
      interPruned.lines.visible = interPruned.mat.opacity > 0.008;
    };

    const updateScene = (delta: number, snap = false) => {
      if (!snap) {
        elapsed += delta;
      }
      applyModeTargets(delta, snap);

      pointer.currentX = THREE.MathUtils.damp(pointer.currentX, pointer.targetX, 3.2, delta);
      pointer.currentY = THREE.MathUtils.damp(pointer.currentY, pointer.targetY, 3.2, delta);

      const baseYaw = elapsed * 0.12;
      rootGroup.rotation.y = baseYaw + pointer.currentX * 0.28;
      rootGroup.rotation.x = Math.sin(elapsed * 0.18) * 0.07 - pointer.currentY * 0.16 + scrollFactor * 0.22;

      communityAssemblies.forEach((assembly, idx) => {
        const dir = idx % 2 === 0 ? 1 : -1;
        assembly.children[0].rotation.z += delta * 0.16 * dir;
        assembly.children[1].rotation.x -= delta * 0.22 * dir;
        assembly.children[2].rotation.y += delta * 0.35;
      });

      manifoldGroup.rotation.y = -elapsed * 0.06;
      manifoldGroup.rotation.z = elapsed * 0.04;

      // Subtle breathing motion on hub nodes
      for (let i = 0; i < hubNodes.length; i++) {
        const node = hubNodes[i];
        const pulse = 1 + Math.sin(elapsed * 1.1 + node.phase) * 0.08;
        _dummyPos.set(node.x, node.y, node.z);
        _euler.set(node.phase + elapsed * 0.22, node.phase * 0.7 + elapsed * 0.18, 0);
        _dummyQuat.setFromEuler(_euler);
        _dummyScale.setScalar(node.scale * pulse);
        _dummyMat.compose(_dummyPos, _dummyQuat, _dummyScale);
        hubInstanced.setMatrixAt(i, _dummyMat);
      }
      hubInstanced.instanceMatrix.needsUpdate = true;
    };

    const afterDraw = (cb: () => void) => {
      if (disposed) return;
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (typeof gl.fenceSync === 'function') {
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
        const poll = () => {
          if (disposed) {
            if (sync) gl.deleteSync(sync);
            return;
          }
          const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
          if (state === gl.UNSIGNALED) {
            frameId = window.setTimeout(poll, 5);
          } else {
            if (sync) gl.deleteSync(sync);
            frameId = window.setTimeout(cb, 80);
          }
        };
        frameId = window.setTimeout(poll, 5);
      } else {
        frameId = window.setTimeout(cb, 90);
      }
    };

    const requestRender = () => {
      if (disposed) return;
      if (renderBusy) {
        renderDirty = true;
        return;
      }
      renderBusy = true;
      frameId = window.requestAnimationFrame(() => {
        if (disposed) return;
        renderDirty = false;
        updateScene(0.016, true);
        renderer.render(scene, camera);
        const done = () => {
          renderBusy = false;
          if (renderDirty && !disposed) requestRender();
        };
        if (isSoftwareGl) afterDraw(done);
        else done();
      });
    };
    requestRenderRef.current = requestRender;

    const tick = () => {
      if (disposed) return;
      const now = performance.now();
      const delta = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;

      updateScene(delta, false);
      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = window.requestAnimationFrame(tick);
      }
    };

    // Initial render
    if (prefersReducedMotion) {
      requestRender();
    } else {
      tick();
    }

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(frameId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      requestRenderRef.current = null;

      disposables.forEach((d) => d.dispose());
      envTarget.dispose();
      renderer.dispose();
      if (canvas.parentElement === container) {
        container.removeChild(canvas);
      }
    };
  }, [graph]);

  return (
    <div
      ref={mountRef}
      data-topology-mode={mode}
      className="pointer-events-none absolute inset-0 h-full w-full overflow-hidden"
    />
  );
}

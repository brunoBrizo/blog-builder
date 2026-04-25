'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const RNG_SEED = 0x9e3779b9;

function buildSeededRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

const MAX_LINE_VERTICES = 12_000;

export function HomeHeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const canvasEl = canvas;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasEl,
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const parallaxGroup = new THREE.Group();
    const planetGroup = new THREE.Group();
    parallaxGroup.add(planetGroup);
    scene.add(parallaxGroup);

    const disposers: Array<() => void> = [];

    function updateSize() {
      const parent = canvasEl.parentElement;
      if (!parent) return;
      const width = parent.clientWidth;
      const height = parent.clientHeight;
      if (width < 2 || height < 2) return;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      if (width < 768) {
        camera.position.z = 22;
        parallaxGroup.position.set(4.5, -2.5, 0);
      } else if (width < 1024) {
        camera.position.z = 14;
        parallaxGroup.position.set(6, 0.5, 0);
      } else {
        camera.position.z = 14;
        parallaxGroup.position.set(6.8, 0.5, 0);
      }
    }

    const onResize = () => updateSize();
    window.addEventListener('resize', onResize);
    disposers.push(() => window.removeEventListener('resize', onResize));
    updateSize();

    const rng = buildSeededRng(RNG_SEED);
    const radius = 6.5;
    const nodeCount = window.innerWidth > 768 ? 400 : 200;

    const coreGeometry = new THREE.SphereGeometry(radius * 0.97, 32, 32);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: 0xf8fafc,
      transparent: true,
      opacity: 0.6,
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    planetGroup.add(core);

    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0xc7d2fe,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });
    const wireframe = new THREE.Mesh(coreGeometry, wireframeMaterial);
    planetGroup.add(wireframe);

    const nodeGeometry = new THREE.BufferGeometry();
    const nodePositions = new Float32Array(nodeCount * 3);

    for (let i = 0; i < nodeCount; i++) {
      const u = rng();
      const v = rng();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);

      nodePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      nodePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      nodePositions[i * 3 + 2] = radius * Math.cos(phi);
    }

    nodeGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(nodePositions, 3),
    );

    const nodeMaterial = new THREE.PointsMaterial({
      color: 0x6366f1,
      size: 0.12,
      transparent: true,
      opacity: 0.9,
    });

    const nodes = new THREE.Points(nodeGeometry, nodeMaterial);
    planetGroup.add(nodes);

    const linePositions: number[] = [];
    const thresholdSq = 4.5;
    outer: for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        if (linePositions.length >= MAX_LINE_VERTICES) break outer;
        const i3 = i * 3;
        const j3 = j * 3;
        const dx = Number(nodePositions[i3]) - Number(nodePositions[j3]);
        const dy =
          Number(nodePositions[i3 + 1]) - Number(nodePositions[j3 + 1]);
        const dz =
          Number(nodePositions[i3 + 2]) - Number(nodePositions[j3 + 2]);
        const distSq = dx * dx + dy * dy + dz * dz;
        if (distSq < thresholdSq) {
          linePositions.push(
            Number(nodePositions[i3]),
            Number(nodePositions[i3 + 1]),
            Number(nodePositions[i3 + 2]),
            Number(nodePositions[j3]),
            Number(nodePositions[j3 + 1]),
            Number(nodePositions[j3 + 2]),
          );
        }
      }
    }

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(linePositions, 3),
    );
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x818cf8,
      transparent: true,
      opacity: 0.2,
    });
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    planetGroup.add(lines);

    disposers.push(() => {
      coreGeometry.dispose();
      coreMaterial.dispose();
      wireframeMaterial.dispose();
      nodeGeometry.dispose();
      nodeMaterial.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      renderer.dispose();
    });

    let targetRotationX = 0;
    let targetRotationY = 0;
    const onMove = (event: MouseEvent) => {
      if (prefersReduced) return;
      const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
      targetRotationY = mouseX * 0.3;
      targetRotationX = -mouseY * 0.3;
    };
    if (!prefersReduced) {
      document.addEventListener('mousemove', onMove);
      disposers.push(() => document.removeEventListener('mousemove', onMove));
    }

    let pageVisible = !document.hidden;
    const onPageVis = () => {
      pageVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', onPageVis);
    disposers.push(() =>
      document.removeEventListener('visibilitychange', onPageVis),
    );

    let inViewport = true;
    if (typeof IntersectionObserver !== 'undefined') {
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            inViewport = e.isIntersecting;
          }
        },
        { root: null, threshold: 0.05 },
      );
      io.observe(canvasEl);
      disposers.push(() => io.disconnect());
    }

    const render = () => {
      renderer.render(scene, camera);
    };

    if (prefersReduced) {
      render();
      return () => {
        for (const d of disposers) d();
      };
    }

    const rotY = 0.0015;
    const rotX = 0.0005;
    let rafId = 0;

    const tick = () => {
      rafId = requestAnimationFrame(tick);
      if (pageVisible && inViewport) {
        planetGroup.rotation.y += rotY;
        planetGroup.rotation.x += rotX;
        parallaxGroup.rotation.x +=
          (targetRotationX - parallaxGroup.rotation.x) * 0.05;
        parallaxGroup.rotation.y +=
          (targetRotationY - parallaxGroup.rotation.y) * 0.05;
        render();
      }
    };
    render();
    rafId = requestAnimationFrame(tick);

    disposers.push(() => cancelAnimationFrame(rafId));

    return () => {
      for (const d of disposers) d();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="home-hero-canvas"
      aria-hidden
      data-engine="three.js"
    />
  );
}

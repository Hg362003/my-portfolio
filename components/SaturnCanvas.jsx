// components/SaturnCanvas.jsx
'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function ParticleSystem({ baseCount = 20000 }) {
  const pointsRef = useRef();

  // Reduce particles on small screens/devices
  const particleCount = useMemo(() => {
    try {
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 900;
      return isMobile ? Math.min(9000, baseCount) : baseCount;
    } catch {
      return baseCount;
    }
  }, [baseCount]);

  // Build attributes and geometry once
  const { targetPositions, randomPositions, geometry } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const targetPositions = new Float32Array(particleCount * 3);
    const randomPositions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colBody = new THREE.Color(0xe3cc9c);
    const colRingLight = new THREE.Color(0xcdbba7);
    const colRingDark = new THREE.Color(0x8a7b63);

    const PLANET_RADIUS = 5;
    const RING_INNER = 7;
    const RING_OUTER = 14;
    const tiltQuaternion = new THREE.Quaternion();
    tiltQuaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 1).normalize(), 0.5);
    const tmp = new THREE.Vector3();

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      let x = 0, y = 0, z = 0;
      const c = new THREE.Color();

      if (i < particleCount * 0.35) {
        const phi = Math.acos(1 - 2 * (i / (particleCount * 0.35)));
        const theta = Math.PI * (1 + Math.sqrt(5)) * i;
        const r = PLANET_RADIUS + (Math.random() * 0.12);

        x = r * Math.sin(phi) * Math.cos(theta);
        y = r * Math.sin(phi) * Math.sin(theta);
        z = r * Math.cos(phi);

        c.copy(colBody);
        c.multiplyScalar(0.8 + (y / PLANET_RADIUS) * 0.2);
      } else {
        const angle = Math.random() * Math.PI * 2;
        let r = RING_INNER + Math.random() * (RING_OUTER - RING_INNER);
        if (r > 10.5 && r < 11.2) r = (Math.random() < 0.5) ? 10.5 : 11.2;

        x = Math.cos(angle) * r;
        z = Math.sin(angle) * r;
        y = (Math.random() - 0.5) * 0.15;

        if (r < 9 || (r > 11.5 && r < 12.5)) c.copy(colRingDark);
        else c.copy(colRingLight);
      }

      tmp.set(x, y, z).applyQuaternion(tiltQuaternion);

      targetPositions[i3] = tmp.x;
      targetPositions[i3 + 1] = tmp.y;
      targetPositions[i3 + 2] = tmp.z;

      // initial positions = target (assembled state)
      positions[i3] = tmp.x;
      positions[i3 + 1] = tmp.y;
      positions[i3 + 2] = tmp.z;

      // random far-away positions for scatter
      const rR = 40 + Math.random() * 40;
      const rTheta = Math.random() * Math.PI * 2;
      const rPhi = Math.acos((Math.random() * 2) - 1);

      randomPositions[i3] = rR * Math.sin(rPhi) * Math.cos(rTheta);
      randomPositions[i3 + 1] = rR * Math.sin(rPhi) * Math.sin(rTheta);
      randomPositions[i3 + 2] = rR * Math.cos(rPhi);

      colors[i3] = c.r;
      colors[i3 + 1] = c.g;
      colors[i3 + 2] = c.b;
    }

    // Create geometry with attributes using Three.js directly
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    return { targetPositions, randomPositions, geometry };
  }, [particleCount]);

  // Preload sprite texture once
  const sprite = useMemo(() => new THREE.TextureLoader().load('https://threejs.org/examples/textures/sprites/disc.png'), []);

  // Material (memoized)
  const material = useMemo(() => {
    return new THREE.PointsMaterial({
      size: 0.12,
      map: sprite,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      opacity: 0.95,
    });
  }, [sprite]);

  // Animate: interpolate positions based on scrollPercent (derived from window)
  useEffect(() => {
    // noop: just make sure listener added in frame is safe
  }, []);

  useFrame(() => {
    if (!pointsRef.current || !geometry) return;
    const pos = geometry.attributes.position;
    if (!pos) return;
    
    const posArray = pos.array;

    // compute scroll percent
    const scrollTop = (typeof window !== 'undefined') ? (window.scrollY || window.pageYOffset) : 0;
    const docHeight = (typeof document !== 'undefined') ? (document.body.scrollHeight - window.innerHeight) : 1;
    const rawPct = Math.min(Math.max(scrollTop / Math.max(docHeight, 1), 0), 1);
    const eased = 1 - Math.pow(1 - rawPct, 3); // easeOutCubic

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const tx = targetPositions[i3], ty = targetPositions[i3 + 1], tz = targetPositions[i3 + 2];
      const rx = randomPositions[i3], ry = randomPositions[i3 + 1], rz = randomPositions[i3 + 2];

      posArray[i3] = tx + (rx - tx) * eased;
      posArray[i3 + 1] = ty + (ry - ty) * eased;
      posArray[i3 + 2] = tz + (rz - tz) * eased;
    }

    pos.needsUpdate = true;

    // rotate for subtle motion
    pointsRef.current.rotation.y += 0.001 + (rawPct * 0.006);

    // fade material as it scatters
    const fade = Math.max(0, 1 - (rawPct * 1.35));
    material.opacity = fade;
    material.size = 0.12 + (0.08 * fade);
    material.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} geometry={geometry} material={material} />
  );
}

export default function SaturnCanvasWrapper() {
  // Camera position can be tuned; we keep it slightly pulled back for effect
  return (
    <Canvas
      camera={{ position: [0, 0, 28], fov: 60 }}
      style={{ width: '100vw', height: '100vh', display: 'block' }}
    >
      {/* subtle background color */}
      <color attach="background" args={['#000000']} />

      {/* Lights */}
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 4, 4]} intensity={0.6} />
      
      {/* Fog — gives depth */}
      <fog attach="fog" args={['#000000', 0.02, 120]} />

      {/* Particle system */}
      <React.Suspense fallback={null}>
        <ParticleSystem baseCount={20000} />
      </React.Suspense>
    </Canvas>
  );
}

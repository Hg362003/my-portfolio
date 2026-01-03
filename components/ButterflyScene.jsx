'use client';

import { useEffect, useRef } from "react";
import * as THREE from "three";

let butterflyInitialized = false;

export default function ButterflyScene() {
  const frame = useRef(null);

  useEffect(() => {
    // 🔒 GLOBAL GUARD — prevents re-creation
    if (butterflyInitialized) return;
    butterflyInitialized = true;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });

    renderer.setSize(360, 360);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const canvas = renderer.domElement;
    canvas.id = "butterfly-canvas";
    canvas.style.position = "fixed";
    canvas.style.right = "6%";
    canvas.style.top = "50%";
    canvas.style.transform = "translateY(-50%)";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "2";

    // Hide on mobile
    const updateVisibility = () => {
      if (window.innerWidth < 900) {
        canvas.style.display = "none";
      } else {
        canvas.style.display = "block";
      }
    };
    
    updateVisibility();
    window.addEventListener('resize', updateVisibility);

    // 🔥 APPEND ONCE
    document.body.appendChild(canvas);

    const geometry = new THREE.PlaneGeometry(3.5, 3.5, 64, 64);
    const texture = new THREE.TextureLoader().load("/butterfly.png");

    const material = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uTexture: { value: texture },
      },
      vertexShader: `
        uniform float uTime;
        varying vec2 vUv;

        void main() {
          vUv = uv;
          vec3 pos = position;

          float center = abs(uv.x - 0.5);
          float wing = smoothstep(0.15, 0.5, center);
          float dir = uv.x < 0.5 ? -1.0 : 1.0;

          pos.z += sin(uTime * 3.0) * wing * dir * 1.6;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos,1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        varying vec2 vUv;

        void main() {
          vec4 c = texture2D(uTexture, vUv);
          if (c.a < 0.05) discard;
          gl_FragColor = c;
        }
      `,
      depthWrite: false,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -0.25;
    scene.add(mesh);

    const clock = new THREE.Clock();

    const animate = () => {
      material.uniforms.uTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
      frame.current = requestAnimationFrame(animate);
    };

    animate();

    // ❌ DO NOT CLEAN UP (INTENTIONAL)
    return () => {};
  }, []);

  return null;
}
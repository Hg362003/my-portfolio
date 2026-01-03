'use client';

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ButterflyTest() {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(300, 300);
    renderer.setClearColor(0x000000, 0);
    ref.current.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneGeometry(3, 3, 64, 64);
    const texture = new THREE.TextureLoader().load("/butterfly.png");

    const material = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uTexture: { value: texture }
      },
      vertexShader: `
        uniform float uTime;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 pos = position;
          pos.z += sin(uTime * 3.0) * 0.5;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos,1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        varying vec2 vUv;
        void main() {
          gl_FragColor = texture2D(uTexture, vUv);
        }
      `
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const clock = new THREE.Clock();
    let frameId;

    function animate() {
      material.uniforms.uTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      renderer.dispose();
      material.dispose();
      geometry.dispose();
      texture.dispose();
      if (ref.current && renderer.domElement.parentNode === ref.current) {
        ref.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={ref} style={{ width: 300, height: 300, border: '1px solid red' }} />;
}





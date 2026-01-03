"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export default function Butterfly() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    let animationId: number | null = null;
    let mixer: THREE.AnimationMixer | null = null;
    let butterfly: THREE.Group | null = null;
    let clock: THREE.Clock | null = null;

    // Scene
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(
      60,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1.5, 6);

    // Renderer
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Light
    const light = new THREE.DirectionalLight(0xffffff, 1.2);
    light.position.set(5, 10, 7);
    scene.add(light);

    // Loader
    const loader = new GLTFLoader();

    loader.load(
      "/models/butterfly.glb",
      (gltf) => {
        butterfly = gltf.scene;

        // ✅ SCALE DOWN (ONLY THIS)
        butterfly.scale.set(1.3, 1.3, 1.3);

        // ✅ FIX ORIENTATION (DO NOT CHANGE AXES RANDOMLY)
        butterfly.rotation.y = Math.PI; // turn sideways
        butterfly.rotation.x = 0;        // keep original pitch
        butterfly.rotation.z = 0;        // keep original roll

        // ✅ POSITION (RIGHT SIDE, EMPTY SPACE)
        butterfly.position.set(2.5, 0.2, 0);

        if (scene) {
          scene.add(butterfly);
        }

        // Animation
        mixer = new THREE.AnimationMixer(butterfly);
        gltf.animations.forEach((clip) => {
          mixer!.clipAction(clip).play();
        });
      },
      undefined,
      (error) => {
        console.error("Error loading butterfly model:", error);
      }
    );

    // Animation loop
    clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      if (mixer && clock) mixer.update(clock.getDelta());

      if (renderer && scene && camera) {
        renderer.render(scene, camera);
      }
    };

    animate();

    // Resize
    const handleResize = () => {
      if (!mountRef.current || !camera || !renderer) return;
      camera.aspect =
        mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(
        mountRef.current.clientWidth,
        mountRef.current.clientHeight
      );
    };

    window.addEventListener("resize", handleResize);

    // ✅ CLEANUP (THIS IS THE FIX)
    return () => {
      // Cancel animation frame
      if (animationId !== null) {
        cancelAnimationFrame(animationId);
      }

      // Remove resize listener
      window.removeEventListener("resize", handleResize);

      // Clean up mixer
      if (mixer) {
        mixer.uncacheRoot(mixer.getRoot());
        mixer = null;
      }

      // Remove butterfly from scene
      if (butterfly && scene) {
        scene.remove(butterfly);
        butterfly.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            if (Array.isArray(child.material)) {
              child.material.forEach((mat) => mat.dispose());
            } else {
              child.material.dispose();
            }
          }
        });
        butterfly = null;
      }

      // Remove renderer DOM element
      if (renderer && mountRef.current && renderer.domElement.parentNode === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }

      // Dispose renderer
      if (renderer) {
        renderer.dispose();
        renderer.forceContextLoss();
        renderer = null;
      }

      // Clear scene
      if (scene) {
        scene.clear();
        scene = null;
      }

      camera = null;
      clock = null;
    };
  }, []);

  return (
    <div
      id="butterfly-container"
      ref={mountRef}
      style={{
        width: "100%",
        height: "100%",
      }}
    />
  );
}

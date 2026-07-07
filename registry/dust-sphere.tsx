"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { cn } from "@/lib/utils";

export interface DustSphereProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Header title displayed on the glass card. Default: "Dust Particle Sphere 3D"
   */
  title?: string;

  /**
   * Description text displayed below the title. Default: "Three.js Scattered Point Cloud Assistant Display"
   */
  description?: string;

  /**
   * Particle color in hex string. Default: "#ffffff"
   */
  color?: string;

  /**
   * Sphere baseline noise morphing intensity (0.0 to 1.5+). Default: 0.0
   */
  noiseIntensity?: number;

  /**
   * Wave morphing animation speed. Default: 0.4
   */
  morphSpeed?: number;

  /**
   * Enable real-time microphone volume reactivity. Default: false
   */
  voiceReact?: boolean;

  /**
   * Outer card glass frame background color. Default: "rgba(10, 20, 32, 0.55)"
   */
  componentColor?: string;
}

export function DustSphere({
  title = "Dust Particle Sphere 3D",
  description = "Three.js Scattered Point Cloud Assistant Display",
  color = "#ffffff",
  noiseIntensity = 0.0,
  morphSpeed = 0.4,
  voiceReact = false,
  componentColor = "rgba(10, 20, 32, 0.55)",
  className,
  ...props
}: DustSphereProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  
  // Audio state refs to prevent re-initializing contexts
  const micActiveRef = useRef(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Dynamic values synchronized to canvas loop via refs
  const propsRef = useRef({ color, noiseIntensity, morphSpeed, voiceReact });

  useEffect(() => {
    propsRef.current = { color, noiseIntensity, morphSpeed, voiceReact };
  }, [color, noiseIntensity, morphSpeed, voiceReact]);

  // Clean up mic context and stream on toggle off or unmount
  const stopMicrophone = () => {
    micActiveRef.current = false;
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (sourceNodeRef.current) {
      sourceNodeRef.current.disconnect();
      sourceNodeRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    dataArrayRef.current = null;
  };

  // Click handler to request mic access if voiceReact is enabled
  const handleMicRequest = async () => {
    if (voiceReact && !micActiveRef.current) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        streamRef.current = stream;

        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const audioContext = new AudioContextClass();
        audioContextRef.current = audioContext;

        const analyser = audioContext.createAnalyser();
        analyser.smoothingTimeConstant = 0.4;
        analyser.fftSize = 256;
        analyserRef.current = analyser;

        const sourceNode = audioContext.createMediaStreamSource(stream);
        sourceNodeRef.current = sourceNode;
        sourceNode.connect(analyser);

        dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
        micActiveRef.current = true;
      } catch (err) {
        console.warn("Microphone access denied or unavailable: ", err);
      }
    }
  };

  useEffect(() => {
    if (!voiceReact) {
      stopMicrophone();
    } else {
      handleMicRequest();
    }
  }, [voiceReact]);

  // Clean up mic on unmount
  useEffect(() => {
    return () => {
      stopMicrophone();
    };
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let particleSystem: THREE.Points;
    let baseParticleGeometry: THREE.BufferGeometry;
    let animationId: number;

    const particlePositions: Array<{
      x: number;
      y: number;
      z: number;
      phi: number;
      theta: number;
      r: number;
    }> = [];

    // Track dragging rotations
    let targetRotationX = 0;
    let targetRotationY = 0;
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    // Initialize Three.js Scene
    const initThree = () => {
      scene = new THREE.Scene();
      
      // Determine dynamic fog color from card background or container fallback
      const parentCard = container.closest(".backdrop-blur-3xl") || container;
      const bgStyle = window.getComputedStyle(parentCard).backgroundColor;
      const fogColor = new THREE.Color(bgStyle && bgStyle !== "rgba(0, 0, 0, 0)" ? bgStyle : "#0c111a");
      scene.fog = new THREE.FogExp2(fogColor, 0.0015);

      camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 1, 1000);
      camera.position.z = 130;

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(renderer.domElement);

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
      scene.add(ambientLight);

      // Build Scattered Dust Particle Sphere
      const pointCount = 3500;
      baseParticleGeometry = new THREE.BufferGeometry();
      const positions = new Float32Array(pointCount * 3);
      const radius = 60;

      for (let i = 0; i < pointCount; i++) {
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        const r = radius + (Math.random() - 0.5) * 6;

        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        particlePositions.push({ x, y, z, phi, theta, r });
      }

      baseParticleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

      // Resolve CSS custom properties to actual RGB color on container color style
      const computedColor = window.getComputedStyle(container).color || "#ffffff";
      const pMaterial = new THREE.PointsMaterial({
        color: new THREE.Color(computedColor),
        size: 1.2,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      particleSystem = new THREE.Points(baseParticleGeometry, pMaterial);
      scene.add(particleSystem);
    };

    // Animation Loop
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      const { color: colorHex, noiseIntensity: noiseInt, morphSpeed: speed, voiceReact: vReact } = propsRef.current;

      // Update particle colors dynamically by checking computed container text color
      if (particleSystem) {
        const matColor = particleSystem.material as THREE.PointsMaterial;
        const resolvedColor = window.getComputedStyle(container).color || "#ffffff";
        const tempThreeColor = new THREE.Color(resolvedColor);
        if (matColor.color.getHex() !== tempThreeColor.getHex()) {
          matColor.color.copy(tempThreeColor);
          matColor.needsUpdate = true;
        }
      }

      // Update fog color dynamically if theme background shifts
      if (scene && scene.fog) {
        const parentCard = container.closest(".backdrop-blur-3xl") || container;
        const bgStyle = window.getComputedStyle(parentCard).backgroundColor;
        const targetFogColor = new THREE.Color(bgStyle && bgStyle !== "rgba(0, 0, 0, 0)" ? bgStyle : "#0c111a");
        const currentFog = scene.fog as THREE.FogExp2;
        if (currentFog.color.getHex() !== targetFogColor.getHex()) {
          currentFog.color.copy(targetFogColor);
        }
      }

      // Calculate voice volume averages
      let micVolume = 0;
      if (vReact && micActiveRef.current && analyserRef.current && dataArrayRef.current) {
        analyserRef.current.getByteFrequencyData(dataArrayRef.current as any);
        let sum = 0;
        for (let i = 0; i < dataArrayRef.current.length; i++) {
          sum += dataArrayRef.current[i];
        }
        micVolume = sum / dataArrayRef.current.length / 255;
      }

      const time = Date.now() * 0.002 * speed;
      const currentIntensity = noiseInt + (vReact ? micVolume * 2.0 : 0);
      const targetScale = 1.0 + (vReact ? micVolume * 0.35 : 0.0);

      if (particleSystem) {
        particleSystem.scale.set(targetScale, targetScale, targetScale);
        
        // Settle rotations
        particleSystem.rotation.y += (targetRotationY - particleSystem.rotation.y) * 0.08;
        particleSystem.rotation.x += (targetRotationX - particleSystem.rotation.x) * 0.08;
        
        if (!isDragging) {
          targetRotationY += 0.0015;
        }
      }

      // Deform positions procedurally
      if (baseParticleGeometry) {
        const positions = baseParticleGeometry.attributes.position.array as Float32Array;

        for (let i = 0; i < particlePositions.length; i++) {
          const pt = particlePositions[i];
          const noiseX = Math.sin(pt.x * 0.08 + time) * Math.cos(pt.y * 0.08 + time);
          const noiseY = Math.cos(pt.y * 0.08 + time) * Math.sin(pt.z * 0.08 + time);
          const multiplier = 1 + (noiseX + noiseY) * 0.2 * currentIntensity;

          positions[i * 3] = pt.x * multiplier;
          positions[i * 3 + 1] = pt.y * multiplier;
          positions[i * 3 + 2] = pt.z * multiplier;
        }

        baseParticleGeometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    // Event handlers
    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaMove = {
        x: e.clientX - previousMousePosition.x,
        y: e.clientY - previousMousePosition.y,
      };
      targetRotationY += deltaMove.x * 0.005;
      targetRotationX += deltaMove.y * 0.005;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaMove = {
        x: e.touches[0].clientX - previousMousePosition.x,
        y: e.touches[0].clientY - previousMousePosition.y,
      };
      targetRotationY += deltaMove.x * 0.008;
      targetRotationX += deltaMove.y * 0.008;
      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    initThree();
    animate();

    container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mousemove", onMouseMove);
    container.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animationId);
      container.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("resize", onResize);

      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative select-none">
      {/* Outer Glass Card Container */}
      <div
        style={{ background: componentColor }}
        onClick={handleMicRequest}
        className={cn(
          "relative w-[420px] h-[410px] rounded-[36px] overflow-hidden border border-white/10 backdrop-blur-3xl shadow-[0_30px_60px_rgba(0,0,0,0.25)]",
          className
        )}
        {...props}
      >
        {/* WebGL Canvas Viewport wrapper */}
        <div
          ref={mountRef}
          style={{ color }}
          className="w-full h-full bg-black/10"
        />
      </div>
    </div>
  );
}

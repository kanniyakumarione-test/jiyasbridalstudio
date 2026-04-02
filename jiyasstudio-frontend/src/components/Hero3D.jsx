import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars, Environment, Sparkles, useTexture } from '@react-three/drei';
import * as THREE from 'three';

const LogoStack = () => {
  const groupRef = useRef();
  const scrollProgressRef = useRef(0);
  const baseTexture = useTexture('/logo.png');
  const logoTexture = useMemo(() => {
    const texture = baseTexture.clone();
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.needsUpdate = true;
    return texture;
  }, [baseTexture]);

  const logoSize = useMemo(() => {
    const image = logoTexture.image;

    if (!image?.width || !image?.height) {
      return [4.8, 4.8];
    }

    const aspect = image.width / image.height;
    const baseWidth = 5;

    return [baseWidth, baseWidth / aspect];
  }, [logoTexture]);

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollableHeight = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      scrollProgressRef.current = window.scrollY / scrollableHeight;
    };

    updateScrollProgress();
    window.addEventListener('scroll', updateScrollProgress, { passive: true });

    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, []);

  useEffect(() => () => logoTexture.dispose(), [logoTexture]);

  useFrame((state) => {
    if (!groupRef.current) {
      return;
    }

    const t = state.clock.getElapsedTime();
    const scroll = scrollProgressRef.current;

    groupRef.current.rotation.y = Math.sin(t * 0.45) * 0.18 - scroll * 0.85;
    groupRef.current.rotation.x = Math.cos(t * 0.3) * 0.06 + scroll * 0.2;
    groupRef.current.rotation.z = Math.sin(t * 0.2) * 0.05 + scroll * 0.12;
    groupRef.current.position.y = Math.sin(t * 0.9) * 0.16 - scroll * 1.8;
    groupRef.current.position.x = 1.7 - scroll * 1.2;
  });

  return (
    <Float speed={1.6} rotationIntensity={0.18} floatIntensity={0.65}>
      <group ref={groupRef}>
        {[-0.32, -0.18, -0.08].map((zOffset, index) => (
          <mesh
            key={zOffset}
            position={[0, 0, zOffset]}
            scale={1 - index * 0.03}
          >
            <planeGeometry args={logoSize} />
            <meshPhysicalMaterial
              map={logoTexture}
              transparent
              alphaTest={0.08}
              color={index === 0 ? '#8a641c' : '#d4af37'}
              emissive="#9b6a13"
              emissiveIntensity={0.2 + index * 0.08}
              metalness={0.95}
              roughness={0.22}
              clearcoat={1}
              clearcoatRoughness={0.12}
              envMapIntensity={2.6}
              opacity={0.78 - index * 0.12}
            />
          </mesh>
        ))}

        <mesh position={[0, 0, 0.14]}>
          <planeGeometry args={logoSize} />
          <meshPhysicalMaterial
            map={logoTexture}
            transparent
            alphaTest={0.08}
            color="#fff7d6"
            emissive="#d4af37"
            emissiveIntensity={0.4}
            metalness={0.35}
            roughness={0.05}
            transmission={0.08}
            thickness={0.8}
            clearcoat={1}
            clearcoatRoughness={0.05}
            envMapIntensity={3}
          />
        </mesh>

        <mesh position={[0, 0, -0.45]} rotation={[0.18, -0.3, 0]}>
          <torusGeometry args={[3.35, 0.08, 32, 180]} />
          <meshStandardMaterial
            color="#f2d48a"
            emissive="#c8952d"
            emissiveIntensity={0.55}
            metalness={0.9}
            roughness={0.24}
          />
        </mesh>

        <mesh position={[0, -0.05, -0.7]} scale={[4.7, 2.6, 1]}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial color="#d4af37" transparent opacity={0.1} />
        </mesh>
      </group>
    </Float>
  );
};

const Hero3D = ({ theme = 'dark' }) => {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointerQuery = window.matchMedia('(pointer: coarse)');
    const isSmallTouchViewport = pointerQuery.matches && window.innerWidth < 1024;

    if (mediaQuery.matches || isSmallTouchViewport) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setShouldRender(true);
    }, 120);

    return () => window.clearTimeout(timer);
  }, []);

  if (!shouldRender) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      style={{
        width: '100%',
        height: '100vh',
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        opacity: theme === 'light' ? 0.18 : 0.34,
        transition: 'opacity 0.35s ease',
      }}
    >
      <Canvas camera={{ position: [0, 0, 8.5], fov: 42 }} dpr={[1, 1.25]} gl={{ antialias: false, powerPreference: 'high-performance' }}>
        <ambientLight intensity={theme === 'light' ? 0.4 : 0.28} />
        <directionalLight position={[8, 6, 6]} intensity={theme === 'light' ? 1.8 : 2.1} color="#ffffff" />
        <pointLight position={[-6, -4, 4]} intensity={theme === 'light' ? 0.8 : 1.1} color="#f2e2c6" />
        <pointLight position={[0, 2, 6]} intensity={theme === 'light' ? 1 : 1.4} color="#ffd36b" />
        
        <Stars radius={70} depth={32} count={theme === 'light' ? 520 : 900} factor={3} saturation={0} fade speed={0.5} />
        <Sparkles count={theme === 'light' ? 20 : 36} scale={12} size={3} speed={0.18} opacity={theme === 'light' ? 0.16 : 0.24} color="#D4AF37" />
        
        <LogoStack />
        
        <Environment preset="sunset" />
      </Canvas>
    </div>
  );
};

export default Hero3D;

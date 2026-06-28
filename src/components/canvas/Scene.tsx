'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, Stars, useTexture, Billboard } from '@react-three/drei';
import * as THREE from 'three';

function WorldCupTrophyImage() {
  const groupRef = useRef<THREE.Group>(null);
  
  // Load the image texture. We assume the user saved it as 'trophy.png' in public directory.
  const texture = useTexture('/Images/i-2-90900493-fifa-world-cup-logo-813x457.jpg');

  useFrame((state) => {
    if (!groupRef.current) return;
    // Mouse interaction for parallax swaying (since it's a billboard, we just sway the group)
    const targetX = (state.pointer.x * Math.PI) / 8;
    const targetY = (state.pointer.y * Math.PI) / 8;
    groupRef.current.rotation.y += 0.05 * (targetX - groupRef.current.rotation.y);
    groupRef.current.rotation.x += 0.05 * (targetY - groupRef.current.rotation.x);
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={1.5}>
      <group ref={groupRef} position={[0, -1, 0]}>
        <Billboard
          follow={true}
          lockX={false}
          lockY={false}
          lockZ={false}
        >
          {/* Made the plane wider and shorter per user request */}
          <mesh>
            <planeGeometry args={[8, 5]} />
            <meshStandardMaterial 
              map={texture} 
              transparent={false}
              depthWrite={true}
              roughness={0.2}
              metalness={0.5}
            />
          </mesh>
        </Billboard>
      </group>
    </Float>
  );
}

export default function Scene() {
  return (
    <div className="fixed inset-0 w-full h-full -z-10 bg-gradient-to-br from-black via-gray-900 to-black pointer-events-none">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={0.5} />
        
        {/* Yellow, Red, White Theme */}
        <directionalLight position={[5, 10, 5]} intensity={2.5} color="#FFFF00" /> {/* Yellow */}
        <directionalLight position={[-5, -10, -5]} intensity={2.5} color="#FF0000" /> {/* Red */}
        <pointLight position={[0, 3, 5]} intensity={3} color="#FFFFFF" /> {/* White */}
        
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={1} fade speed={1.5} />
        
        <WorldCupTrophyImage />
        
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}

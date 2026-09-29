
"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, Sphere, Cylinder, Text } from "@react-three/drei";
import * as THREE from "three";

const FloatingLedger = () => {
  const ref = useRef<THREE.Group>(null);

  useFrame((_state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.2;
      ref.current.rotation.x = Math.sin(Date.now() * 0.0005) * 0.1;
    }
  });

  return (
    <group ref={ref}>
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
        {/* Coin-like spheres */}
        {[...Array(5)].map((_, i) => (
          <group key={i} position={[0, -i * 0.6, 0]}>
            <Sphere args={[0.8, 32, 32]}>
              <meshStandardMaterial
                color={i % 2 === 0 ? "#FF5722" : "#FFA785"}
                roughness={0.3}
                metalness={0.1}
              />
            </Sphere>
            <Sphere args={[0.75, 32, 32]} position={[0, 0.05, 0]}>
              <meshStandardMaterial
                color={i % 2 === 0 ? "#E64A19" : "#FF8A65"}
                roughness={0.4}
              />
            </Sphere>
          </group>
        ))}

        {/* Simple decorative cylinders */}
        {[...Array(3)].map((_, i) => (
          <Cylinder
            key={i}
            args={[0.1, 0.1, 3, 16]}
            position={[Math.cos(i * (Math.PI * 2 / 3)) * 1.5, -1.5, Math.sin(i * (Math.PI * 2 / 3)) * 1.5]}
            rotation={[Math.PI / 2, 0, i * (Math.PI * 2 / 3)]}
          >
            <meshStandardMaterial color="#10B981" roughness={0.5} />
          </Cylinder>
        ))}
      </Float>
    </group>
  );
};

export const Hero3D = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="w-full h-[400px] md:h-[500px] lg:h-[600px] relative">
      {isVisible && (
        <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <pointLight position={[-10, -10, -10]} />
          <FloatingLedger />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
          />
        </Canvas>
      )}
    </div>
  );
};


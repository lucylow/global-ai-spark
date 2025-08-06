import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Box, Sphere, Plane } from '@react-three/drei';
import * as THREE from 'three';

interface PropertyMapProps {
  riskData?: {
    flood?: number;
    fire?: number;
    coastalErosion?: number;
    subsidence?: number;
  };
  activeLayers?: {
    flood: boolean;
    fire: boolean;
    erosion: boolean;
  };
}

function Building({ position, riskLevel = 0 }: { position: [number, number, number], riskLevel?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
    }
  });

  const color = new THREE.Color(
    1 - riskLevel,
    1 - (riskLevel * 0.5),
    0.5
  );

  return (
    <Box
      ref={meshRef}
      position={position}
      scale={[1, 1 + Math.random() * 2, 1]}
      castShadow
      receiveShadow
    >
      <meshPhongMaterial color={color} />
    </Box>
  );
}

function RiskOverlays({ riskData, activeLayers }: { riskData?: any, activeLayers: any }) {
  if (!riskData) return null;

  return (
    <group>
      {/* Flood overlay */}
      {activeLayers.flood && riskData.flood && riskData.flood > 0.2 && (
        <Plane
          args={[8, 4]}
          position={[0, 0.1, 2]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <meshBasicMaterial
            color="#0066cc"
            transparent
            opacity={0.4}
            side={THREE.DoubleSide}
          />
        </Plane>
      )}

      {/* Fire risk indicators */}
      {activeLayers.fire && riskData.fire && riskData.fire > 0.3 && (
        <group>
          {Array.from({ length: 5 }).map((_, i) => (
            <Sphere
              key={i}
              args={[0.3, 8, 8]}
              position={[
                Math.random() * 4 - 2,
                1 + Math.random() * 2,
                Math.random() * 3 - 1
              ]}
            >
              <meshBasicMaterial
                color="#ff5500"
                transparent
                opacity={0.7}
              />
            </Sphere>
          ))}
        </group>
      )}
    </group>
  );
}

function CityScene({ riskData, activeLayers }: { riskData?: any, activeLayers: any }) {
  const buildings = Array.from({ length: 12 }, (_, i) => ({
    position: [
      (i % 4) * 2 - 3,
      0,
      Math.floor(i / 4) * 2 - 2
    ] as [number, number, number],
    risk: riskData?.flood || Math.random() * 0.8
  }));

  return (
    <>
      {/* Ground plane */}
      <Plane
        args={[20, 20]}
        position={[0, -0.5, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <meshLambertMaterial color="#90EE90" />
      </Plane>

      {/* Grid */}
      <gridHelper args={[20, 20, 0x444444, 0x222222]} />

      {/* Buildings */}
      {buildings.map((building, index) => (
        <Building
          key={index}
          position={building.position}
          riskLevel={building.risk}
        />
      ))}

      {/* Risk overlays */}
      <RiskOverlays riskData={riskData} activeLayers={activeLayers} />

      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[10, 20, 15]}
        intensity={0.8}
        castShadow
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
    </>
  );
}

export default function PropertyMap({ riskData, activeLayers = {
  flood: true,
  fire: true,
  erosion: false
} }: PropertyMapProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center bg-gray-100 rounded-xl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading 3D property visualization...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[500px] relative bg-gradient-to-b from-sky-100 to-blue-50 rounded-xl overflow-hidden">
      <Canvas
        shadows
        camera={{ position: [0, 8, 15], fov: 60 }}
        style={{ background: 'linear-gradient(to bottom, #f0f9ff, #e0f2fe)' }}
      >
        <CityScene riskData={riskData} activeLayers={activeLayers} />
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={5}
          maxDistance={30}
        />
      </Canvas>
      
      <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white p-2 rounded text-sm">
        {riskData ? '3D Property Risk Visualization' : 'Interactive Property Map'}
      </div>
      
      <div className="absolute top-4 right-4 bg-white bg-opacity-90 p-3 rounded-lg text-xs">
        <div className="font-medium mb-2">Risk Indicators</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>High Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span>Medium Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Low Risk</span>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment, OrbitControls } from "@react-three/drei"; 

function buildRoomLayout(bhk, width, depth) {
  const roomCount = Math.max(1, Math.min(10, bhk));
  const cols = Math.ceil(Math.sqrt(roomCount));
  const rows = Math.ceil(roomCount / cols);
  const roomW = width / cols;
  const roomD = depth / rows;
  const rooms = [];

  for (let i = 0; i < roomCount; i += 1) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    rooms.push({
      x: -width / 2 + roomW * (col + 0.5),
      z: -depth / 2 + roomD * (row + 0.5),
      w: roomW,
      d: roomD,
      label: `Room ${i + 1}`,
    });
  }
  return rooms;
}

function HouseModel({ width, depth, floors, bhk, viewMode }) {
  const wallHeight = 1.2 + floors * 0.2;
  const rooms = useMemo(() => buildRoomLayout(bhk, width, depth), [bhk, width, depth]);

  if (viewMode === "2d") {
    return (
      <group rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.6, 0]}>
        <mesh receiveShadow>
          <planeGeometry args={[width, depth]} />
          <meshStandardMaterial color="#0b172a" metalness={0.1} roughness={0.65} />
        </mesh>
        {rooms.map((room) => (
          <line key={room.label} position={[room.x, 0.01, room.z]}>
            <bufferGeometry>
              <float32BufferAttribute
                attach="attributes-position"
                args={[
                  new Float32Array([
                    -room.w / 2,
                    0,
                    -room.d / 2,
                    room.w / 2,
                    0,
                    -room.d / 2,
                    room.w / 2,
                    0,
                    room.d / 2,
                    -room.w / 2,
                    0,
                    room.d / 2,
                    -room.w / 2,
                    0,
                    -room.d / 2,
                  ]),
                  3,
                ]}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#22d3ee" />
          </line>
        ))}
      </group>
    );
  }

  return (
    <group>
      <mesh receiveShadow>
        <boxGeometry args={[width, 0.2, depth]} />
        <meshStandardMaterial color="#111827" roughness={0.9} />
      </mesh>
      <mesh position={[0, wallHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, wallHeight, depth]} />
        <meshStandardMaterial
          color="#0f172a"
          transparent
          opacity={0.32}
          metalness={0.25}
          roughness={0.4}
        />
      </mesh>
      {rooms.map((room) => (
        <mesh
          key={room.label}
          position={[room.x, wallHeight / 2 + 0.01, room.z]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[Math.max(room.w - 0.12, 0.35), wallHeight * 0.95, 0.06]} />
          <meshStandardMaterial color="#22d3ee" emissive="#0f172a" roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

export default function FloorViewer({ formData, onViewModeChange }) {
  const [viewMode, setViewMode] = useState("3d");

  const width = useMemo(
    () => Math.max(3.5, Math.sqrt(Number(formData.builtup_area_sqft || 900)) * 0.16),
    [formData.builtup_area_sqft]
  );
  const depth = useMemo(() => Math.max(3.2, width * 0.72), [width]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      className="rounded-2xl border border-slate-700/70 bg-slate-900/75 p-4 shadow-glow backdrop-blur"
    >
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-100">Live Spatial Preview</h2>
        <Link 
          to="/floorplanner" 
          className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-semibold rounded-md shadow-lg hover:shadow-xl transition-all"
        >
          Open Full CAD Editor →
        </Link>
      </div> 
      <div className="h-[min(360px,calc(100vh-20rem))] overflow-hidden rounded-xl border border-slate-700/50 sm:h-[min(400px,calc(100vh-18rem))] lg:h-[min(480px,calc(100vh-14rem))] xl:h-[min(540px,calc(100vh-12rem))]">
        <Canvas shadows camera={{ position: [7.5, 6.8, 8], fov: 45 }}>
          <ambientLight intensity={0.45} />
          <directionalLight
            position={[8, 12, 5]}
            intensity={1.15}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <Environment preset="city" />
          <HouseModel
            width={width}
            depth={depth}
            floors={Number(formData.floors)}
            bhk={Number(formData.bhk)}
            viewMode={viewMode}
          />
          <ContactShadows position={[0, -0.7, 0]} opacity={0.45} scale={10} blur={2.2} />
          <OrbitControls
            makeDefault
            enablePan={false}
            minDistance={6}
            maxDistance={16}
            maxPolarAngle={Math.PI / 2.1}
          />
        </Canvas>
      </div>
      <p className="mt-3 text-xs text-slate-400">
        Geometry updates in real-time from Area + BHK inputs for instant space feedback.
      </p>
    </motion.div>
  );
}

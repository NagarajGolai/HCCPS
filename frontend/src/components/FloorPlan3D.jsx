// FloorPlan3D.jsx
import React, { useMemo, useRef, useEffect, Suspense } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, ContactShadows, Text, Float, Environment, Stars, Sky, MeshReflectorMaterial } from '@react-three/drei';
import { Sun, Moon, Sparkles } from 'lucide-react';
import * as THREE from 'three';

const PX_TO_FT = 0.25; 
const WALL_HEIGHT = 10;
const WALL_THICKNESS = 0.5;

const ROOM_PALETTE = [
  "#fbbf24", "#38bdf8", "#818cf8", "#f472b6", "#34d399", "#f87171", "#a78bfa", "#fb7185", "#2dd4bf"
];

function RealisticModel({ type, color, args, lightingMode }) {
  const [w, h, d] = args;
  
  const materialProps = useMemo(() => {
    if (lightingMode === 'punk') {
      return {
        color: color,
        roughness: 0.3,
        metalness: 0.4,
        emissive: color,
        emissiveIntensity: 0.4,
      };
    }
    if (lightingMode === 'night') {
      return { color: color, roughness: 0.4, metalness: 0.5, emissive: "#000000", emissiveIntensity: 0 };
    }
    return { color: color, roughness: 0.3, metalness: 0.05, emissive: "#000000", emissiveIntensity: 0 };
  }, [color, lightingMode]);

  const groupProps = { castShadow: true, receiveShadow: true };

  if (type === 'bed') {
    return (
      <group {...groupProps}>
        <mesh position={[0, 0.4, 0]} castShadow receiveShadow><boxGeometry args={[w, 0.8, d]} /><meshStandardMaterial color="#1e293b" /></mesh>
        <mesh position={[0, 1.2, 0]} castShadow receiveShadow><boxGeometry args={[w * 0.95, 0.8, d * 0.95]} /><meshStandardMaterial {...materialProps} /></mesh>
        <mesh position={[w * 0.35, 1.7, 0]} castShadow receiveShadow><boxGeometry args={[w * 0.2, 0.3, d * 0.7]} /><meshStandardMaterial color="#ffffff" /></mesh>
      </group>
    );
  }
  if (type === 'sofa') {
    return (
      <group {...groupProps}>
        <mesh position={[0, 0.5, 0]} castShadow receiveShadow><boxGeometry args={[w, 1, d]} /><meshStandardMaterial {...materialProps} /></mesh>
        <mesh position={[-w * 0.4, 1.5, 0]} castShadow receiveShadow><boxGeometry args={[w * 0.2, 2, d]} /><meshStandardMaterial {...materialProps} /></mesh>
        <mesh position={[0, 1.2, d * 0.45]} castShadow receiveShadow><boxGeometry args={[w, 1.5, d * 0.1]} /><meshStandardMaterial {...materialProps} /></mesh>
        <mesh position={[0, 1.2, -d * 0.45]} castShadow receiveShadow><boxGeometry args={[w, 1.5, d * 0.1]} /><meshStandardMaterial {...materialProps} /></mesh>
      </group>
    );
  }
  return <mesh position={[0, h/2, 0]} castShadow receiveShadow><boxGeometry args={[w, h, d]} /><meshStandardMaterial {...materialProps} /></mesh>;
}

function ArchitecturalElement({ element, index, lightingMode }) {
  const { id, type, x, y, width, height, points, name, rotation = 0, color: customColor } = element;
  
  const data = useMemo(() => {
    try {
      const scale = PX_TO_FT;
      const rad = (rotation * Math.PI) / 180;
      if (type === 'wall' && points && points.length >= 4) {
        const dx = points[2], dy = points[3];
        const length = Math.hypot(dx, dy) * scale;
        const angle = Math.atan2(dy, dx);
        const midX = (x + dx / 2) * scale, midZ = (y + dy / 2) * scale;
        return { pos: [midX, 0, midZ], rot: [0, -angle, 0], args: [length, WALL_HEIGHT, WALL_THICKNESS], color: customColor || "#ffffff", label: name || "WALL" };
      } 
      const w = Math.max(0.1, width * scale), d = Math.max(0.1, height * scale);
      const midX = (x + width / 2) * scale, midZ = (y + height / 2) * scale;
      let color = customColor;
      let h = 2;
      if (!color) {
        if (type === 'room') {
          const colorIdx = (id.length + (name?.length || 0) + (index || 0)) % ROOM_PALETTE.length;
          color = ROOM_PALETTE[colorIdx];
        }
        else color = "#ffffff";
      }
      return { pos: [midX, type === 'room' ? 0.3 : 0.6, midZ], rot: [0, -rad, 0], args: [w, type === 'room' ? 0.2 : h, d], color, label: name || type.toUpperCase() };
    } catch (e) { return null; }
  }, [type, x, y, width, height, points, rotation, customColor, name, id, index]);

  if (!data) return null;

  return (
    <group position={data.pos} rotation={data.rot} castShadow receiveShadow>
      {type === 'room' ? (
        <mesh position={[0, 0, 0]} receiveShadow castShadow>
          <boxGeometry args={data.args} />
          <meshStandardMaterial 
            color={data.color} 
            emissive={lightingMode === 'punk' ? data.color : "#000000"} 
            emissiveIntensity={lightingMode === 'punk' ? 0.4 : 0} 
            roughness={0.4} metalness={0.2} 
          />
        </mesh>
      ) : (
        <RealisticModel type={type} color={data.color} args={data.args} lightingMode={lightingMode} />
      )}
      <Float speed={4} rotationIntensity={0.2} floatIntensity={0.5}>
        <Text position={[0, (data.args[1] || 2) + 8, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={2} color={lightingMode === 'punk' ? "#00ffff" : "#ffffff"} fontStyle="bold" anchorX="center" anchorY="middle" textAlign="center">{data.label}</Text>
      </Float>
    </group>
  );
}

function SceneContent({ elements, showGrid, lightingMode }) {
  const { camera, scene } = useThree();
  const controlsRef = useRef();
  const keys = useRef({});
  
  const isDay = lightingMode === 'day';
  const isPunk = lightingMode === 'punk';
  const isNight = lightingMode === 'night';

  const bounds = useMemo(() => {
    if (!elements || elements.length === 0) return { center: [0, 0, 0], size: 50 };
    let minX = Infinity, minZ = Infinity, maxX = -Infinity, maxZ = -Infinity;
    elements.forEach(el => {
      const ex = (el.x || 0) * PX_TO_FT, ez = (el.y || 0) * PX_TO_FT;
      const ew = (el.width || 0) * PX_TO_FT, eh = (el.height || 0) * PX_TO_FT;
      minX = Math.min(minX, ex); minZ = Math.min(minZ, ez);
      maxX = Math.max(maxX, ex + ew); maxZ = Math.max(maxZ, ez + eh);
    });
    return {
      center: [(minX + maxX) / 2, 0, (minZ + maxZ) / 2],
      size: Math.max(maxX - minX, maxZ - minZ, 120)
    };
  }, [elements]);

  useEffect(() => {
    const down = (e) => { keys.current[e.key] = true; };
    const up = (e) => { keys.current[e.key] = false; };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, []);

  useFrame((state, delta) => {
    if (!controlsRef.current) return;
    const speed = 150 * delta;
    const target = controlsRef.current.target;
    if (keys.current['ArrowUp']) { target.z -= speed; camera.position.z -= speed; }
    if (keys.current['ArrowDown']) { target.z += speed; camera.position.z += speed; }
    if (keys.current['ArrowLeft']) { target.x -= speed; camera.position.x -= speed; }
    if (keys.current['ArrowRight']) { target.x += speed; camera.position.x += speed; }
    if (Object.values(keys.current).some(v => v)) controlsRef.current.update();
  });

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.target.set(...bounds.center);
      camera.position.set(bounds.center[0] + 150, 150, bounds.center[2] + 150);
      controlsRef.current.update();
    }
  }, [bounds, camera]);

  // ISOLATED BACKGROUNDS
  useEffect(() => {
    if (isPunk) {
      scene.background = new THREE.Color('#050a10');
      scene.fog = new THREE.FogExp2('#050a10', 0.002);
    } else if (isNight) {
      scene.background = new THREE.Color('#010409');
      scene.fog = null;
    } else {
      scene.background = null;
      scene.fog = null;
    }
  }, [isPunk, isNight, scene]);

  return (
    <>
      <PerspectiveCamera makeDefault fov={30} far={20000} />
      <OrbitControls ref={controlsRef} makeDefault screenSpacePanning={true} enableDamping dampingFactor={0.15} maxPolarAngle={Math.PI / 2.1} minDistance={1} maxDistance={10000} />
      
      {isDay && (
        <>
          <Sky sunPosition={[-50, 10, 100]} turbidity={0.01} rayleigh={2} />
          <Environment preset="park" intensity={0.8} />
          <ambientLight intensity={1.2} />
          <directionalLight position={[-100, 50, 150]} intensity={3.5} castShadow color="#fff7ed" />
        </>
      )}

      {isNight && (
        <>
          <Stars radius={500} depth={50} count={18000} factor={6} saturation={0} fade speed={2} />
          <Environment preset="night" intensity={0.7} />
          <ambientLight intensity={0.6} />
          <spotLight position={[bounds.center[0], 250, bounds.center[2]]} intensity={100} color="#ffffff" castShadow angle={0.4} />
        </>
      )}

      {isPunk && (
        <group>
          {/* REFERENCE MATCH: SPLIT GLOW (Pink & Cyan) */}
          <ambientLight intensity={0.2} />
          <spotLight position={[bounds.center[0] - 100, 150, bounds.center[2] + 100]} intensity={8000} color="#ff00ff" castShadow distance={1000} angle={0.8} penumbra={1} />
          <spotLight position={[bounds.center[0] + 100, 150, bounds.center[2] - 100]} intensity={8000} color="#00ffff" castShadow distance={1000} angle={0.8} penumbra={1} />
          <pointLight position={[bounds.center[0], 50, bounds.center[2]]} intensity={1500} color="#00ffff" distance={300} />
          <hemisphereLight intensity={2} color="#ff00ff" groundColor="#00ffff" />
        </group>
      )}

      <group>
        {isPunk ? (
          <mesh name="base-floor" rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]} receiveShadow>
            <planeGeometry args={[20000, 20000]} />
            <MeshReflectorMaterial
              blur={[1000, 400]} resolution={2048} mixBlur={1} mixStrength={100} roughness={1} depthScale={2}
              minDepthThreshold={0.4} maxDepthThreshold={1.4} color="#050a10" metalness={0.5} mirror={0.5}
            />
          </mesh>
        ) : (
          <mesh name="base-floor" rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]} receiveShadow>
            <planeGeometry args={[20000, 20000]} />
            <meshStandardMaterial color={isDay ? "#1e293b" : "#020617"} roughness={isDay ? 0.6 : 0.2} metalness={isDay ? 0 : 0.8} />
          </mesh>
        )}
        
        {showGrid && (
          <gridHelper 
            args={[10000, 100, 
              isDay ? "#334155" : (isPunk ? "#00ffff" : "#ffffff"), 
              isDay ? "#475569" : (isPunk ? "#ff00ff" : "#fbbf24")
            ]} 
            position={[0, 0.05, 0]} 
          />
        )}
        
        {elements.map((el, idx) => (<ArchitecturalElement key={el.id} element={el} index={idx} lightingMode={lightingMode} />))}
      </group>
      <ContactShadows resolution={4096} scale={4000} blur={0.5} opacity={isDay ? 0.4 : 1.0} far={200} color="#000000" />
    </>
  );
}

export default function FloorPlan3D({ elements = [], lightingMode = 'day', setLightingMode, viewMode = '3d', showGrid = true }) {
  return (
    <div className="w-full h-full bg-[#000000] relative">
      <div className="absolute top-8 left-8 z-10 pointer-events-none flex flex-col gap-1">
        <span className="text-[12px] font-black tracking-[0.5em] text-[#fbbf24] uppercase">PROVERSE BIM v42.0</span>
        {viewMode === '3d' && (
          <button onClick={() => {
            if (lightingMode === 'day') setLightingMode('night');
            else if (lightingMode === 'night') setLightingMode('punk');
            else setLightingMode('day');
          }} className="flex items-center gap-2 px-3 py-1.5 bg-black/60 border border-white/10 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-[#fbbf24] hover:text-slate-950 transition-all pointer-events-auto mt-2">
            {lightingMode === 'day' && <Sun size={14} className="text-yellow-400" />}
            {lightingMode === 'night' && <Moon size={14} className="text-blue-400" />}
            {lightingMode === 'punk' && <Sparkles size={14} className="text-pink-500" />}
            {lightingMode === 'day' ? 'GOLDEN HOUR' : (lightingMode === 'night' ? 'NIGHT' : 'NEON STALL (BETA)')}
          </button>
        )}
        <div className="px-4 py-2 bg-black/60 border border-white/10 rounded-xl mt-1 backdrop-blur-md text-[10px] font-black text-white uppercase tracking-widest">Neon-Stall Beta v1.0</div>
      </div>
      <Canvas shadows={true} dpr={[1, 2]} gl={{ antialias: true }}><Suspense fallback={null}><SceneContent elements={elements} showGrid={showGrid} lightingMode={lightingMode} /></Suspense></Canvas>
    </div>
  );
}
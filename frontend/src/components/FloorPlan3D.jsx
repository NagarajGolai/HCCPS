// FloorPlan3D.jsx
import React, { useMemo, useRef, useEffect, Suspense } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, ContactShadows, Text, Float, Environment, Stars, Sky, MeshReflectorMaterial, Html, PointerLockControls } from '@react-three/drei';
import { Sun, Moon, Sparkles, Hexagon } from 'lucide-react';
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
    if (lightingMode === 'glass') {
      return {
        color: color,
        roughness: 0.1,
        metalness: 0.8,
        emissive: "#000000",
        emissiveIntensity: 0,
        clearcoat: 1,
        clearcoatRoughness: 0.1
      };
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

function FurnitureModel({ type, color, args, lightingMode }) {
  const [texture, setTexture] = React.useState(null);
  
  useEffect(() => {
    if (['room', 'wall', 'door', 'window'].includes(type)) return;
    const loader = new THREE.TextureLoader();
    loader.load(`/${type}.png`, 
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        setTexture(tex);
      },
      undefined,
      (err) => { /* Silently fail and use fallback RealisticModel */ }
    );
  }, [type]);

  if (texture) {
    return (
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.2, 0]} castShadow receiveShadow>
        <planeGeometry args={[args[0] * 1.5, args[2] * 1.5]} />
        <meshStandardMaterial map={texture} transparent={true} alphaTest={0.5} side={THREE.DoubleSide} />
      </mesh>
    );
  }

  return <RealisticModel type={type} color={color} args={args} lightingMode={lightingMode} />;
}

function ArchitecturalElement({ element, index, lightingMode, showMeasurements, showFurniture }) {
  const { id, type, x, y, width, height, points, name, rotation = 0, color: customColor } = element;
  const groupRef = useRef();
  const isAnimated = useRef(false);
  const animTime = useRef(0);
  const startDelay = index * 0.05; // Staggered entry
  
  const data = useMemo(() => {
    try {
      const scale = PX_TO_FT;
      const rad = (rotation * Math.PI) / 180;
      if (type === 'wall' && points && points.length >= 4) {
        const dx = points[2], dy = points[3];
        const length = Math.hypot(dx, dy);
        const angle = Math.atan2(dy, dx);
        const midX = (x + dx / 2) * scale, midZ = (y + dy / 2) * scale;
        return { pos: [midX, 0, midZ], rot: [0, -angle, 0], args: [length * scale, WALL_HEIGHT, WALL_THICKNESS], color: customColor || "#ffffff", label: name || "WALL", ftL: length / 4 };
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
      return { pos: [midX, type === 'room' ? 0.3 : 0.6, midZ], rot: [0, -rad, 0], args: [w, type === 'room' ? 0.2 : h, d], color, label: name || type.toUpperCase(), sqft: (width * height * scale * scale).toFixed(0), ftW: width / 4, ftH: height / 4 };
    } catch (e) { return null; }
  }, [type, x, y, width, height, points, rotation, customColor, name, id, index]);

  useFrame((state, delta) => {
    if (groupRef.current && !isAnimated.current && data) {
      animTime.current += delta;
      if (animTime.current < startDelay) {
        groupRef.current.scale.set(0, 0, 0);
        return;
      }
      
      const t = Math.min((animTime.current - startDelay) * 1.5, 1);
      
      if (t < 1) {
        // Elastic/Spring ease out math
        const c4 = (2 * Math.PI) / 3;
        const ease = t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
        
        // Crazy sci-fi transform
        groupRef.current.position.y = data.pos[1] + (200 * (1 - t)); // Drop from sky
        groupRef.current.rotation.y = data.rot[1] + (Math.PI * 4 * (1 - t)); // Fast spin
        groupRef.current.scale.set(ease, ease, ease); // Spring scale
      } else {
        groupRef.current.position.y = data.pos[1];
        groupRef.current.rotation.y = data.rot[1];
        groupRef.current.scale.set(1, 1, 1);
        isAnimated.current = true;
      }
    }
  });

  if (!data) return null;
  
  const isFurniture = !['room', 'wall', 'door', 'window'].includes(type);
  if (isFurniture && !showFurniture) return null;

  return (
    <group position={data.pos} rotation={data.rot} castShadow receiveShadow ref={groupRef} scale={[0, 0, 0]}>
      {type === 'room' ? (
        <mesh position={[0, 0, 0]} receiveShadow castShadow>
          <boxGeometry args={data.args} />
          <meshStandardMaterial 
            color={data.color} 
            emissive={lightingMode === 'punk' ? data.color : "#000000"} 
            emissiveIntensity={lightingMode === 'punk' ? 0.4 : 0} 
            roughness={0.4} metalness={0.2} 
          />
          {/* Holographic Data Tag */}
          <Html position={[0, data.args[1] + 1, 0]} center transform sprite zIndexRange={[100, 0]}>
            <div className="bg-black/60 border border-[#00ffff]/40 px-3 py-1.5 rounded-lg backdrop-blur-md shadow-[0_0_15px_rgba(0,255,255,0.15)] pointer-events-none select-none">
              <div className="text-[10px] font-black tracking-[0.2em] uppercase text-[#00ffff]">{data.label}</div>
              <div className="text-[9px] font-bold text-white/90 tracking-wider text-center mt-0.5">{data.sqft} SQFT</div>
              {showMeasurements && (
                <div className="text-[8px] font-bold text-[#fbbf24] mt-0.5 text-center">{data.ftW.toFixed(1)}' × {data.ftH.toFixed(1)}'</div>
              )}
            </div>
          </Html>
        </mesh>
      ) : (
        <>
          {type === 'wall' && lightingMode === 'glass' ? (
            <mesh position={[0, data.args[1]/2, 0]} castShadow receiveShadow>
              <boxGeometry args={data.args} />
              <meshPhysicalMaterial 
                transmission={1} 
                opacity={1} 
                metalness={0} 
                roughness={0.2} 
                ior={1.5} 
                thickness={2} 
                color="#ffffff" 
              />
            </mesh>
          ) : (
            <FurnitureModel type={type} color={data.color} args={data.args} lightingMode={lightingMode} />
          )}
          <Float speed={4} rotationIntensity={0.2} floatIntensity={0.5}>
            <Text position={[0, (data.args[1] || 2) + 4, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={1.5} color={lightingMode === 'punk' ? "#00ffff" : "#ffffff"} fontStyle="bold" anchorX="center" anchorY="middle" textAlign="center" fillOpacity={0.5}>{data.label}</Text>
          </Float>
          {type === 'wall' && showMeasurements && (
            <Html position={[0, data.args[1] + 1, 0]} center transform sprite zIndexRange={[100, 0]}>
              <div className="bg-black/80 px-2 py-0.5 rounded text-[#fbbf24] font-mono text-[8px] border border-[#fbbf24]/50 pointer-events-none">{data.ftL.toFixed(1)}'</div>
            </Html>
          )}
        </>
      )}
    </group>
  );
}

function SceneContent({ elements, showGrid, lightingMode, isFirstPerson, showMeasurements, showFurniture }) {
  const { camera, scene } = useThree();
  const controlsRef = useRef();
  const keys = useRef({});
  
  const isDay = lightingMode === 'day';
  const isPunk = lightingMode === 'punk';
  const isNight = lightingMode === 'night';
  const isGlass = lightingMode === 'glass';

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
    const down = (e) => { keys.current[e.key.toLowerCase()] = true; };
    const up = (e) => { keys.current[e.key.toLowerCase()] = false; };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, []);

  useFrame((state, delta) => {
    if (isFirstPerson) {
      const speed = 40 * delta;
      // WASD First Person Flying
      if (keys.current['w']) camera.translateZ(-speed);
      if (keys.current['s']) camera.translateZ(speed);
      if (keys.current['a']) camera.translateX(-speed);
      if (keys.current['d']) camera.translateX(speed);
    } else {
      if (!controlsRef.current) return;
      const speed = 150 * delta;
      const target = controlsRef.current.target;
      if (keys.current['arrowup']) { target.z -= speed; camera.position.z -= speed; }
      if (keys.current['arrowdown']) { target.z += speed; camera.position.z += speed; }
      if (keys.current['arrowleft']) { target.x -= speed; camera.position.x -= speed; }
      if (keys.current['arrowright']) { target.x += speed; camera.position.x += speed; }
      if (Object.values(keys.current).some(v => v)) controlsRef.current.update();
    }
  });

  useEffect(() => {
    if (isFirstPerson) {
      // Drop to human eye level (approx 5.5ft) near the center
      camera.position.set(bounds.center[0], 5.5, bounds.center[2] + 20);
      camera.rotation.set(0, 0, 0);
    } else if (controlsRef.current) {
      controlsRef.current.target.set(...bounds.center);
      camera.position.set(bounds.center[0] + 150, 150, bounds.center[2] + 150);
      controlsRef.current.update();
    }
  }, [bounds, camera, isFirstPerson]);

  // ISOLATED BACKGROUNDS
  useEffect(() => {
    if (isPunk) {
      scene.background = new THREE.Color('#050a10');
      scene.fog = new THREE.FogExp2('#050a10', 0.002);
    } else if (isNight) {
      scene.background = new THREE.Color('#010409');
      scene.fog = null;
    } else if (isGlass) {
      scene.background = new THREE.Color('#f8fafc');
      scene.fog = new THREE.FogExp2('#f8fafc', 0.001);
    } else {
      scene.background = null;
      scene.fog = null;
    }
  }, [isPunk, isNight, isGlass, scene]);

  return (
    <>
      <PerspectiveCamera makeDefault fov={isFirstPerson ? 75 : 30} far={20000} />
      
      {isFirstPerson ? (
        <PointerLockControls selector="#fpv-overlay" />
      ) : (
        <OrbitControls ref={controlsRef} makeDefault screenSpacePanning={true} enableDamping dampingFactor={0.15} maxPolarAngle={Math.PI / 2.1} minDistance={1} maxDistance={10000} autoRotate={true} autoRotateSpeed={0.5} />
      )}
      
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

      {isGlass && (
        <>
          <Environment preset="city" background blur={0.8} />
          <ambientLight intensity={1.5} color="#ffffff" />
          <directionalLight position={[100, 200, 100]} intensity={3} castShadow color="#ffffff" />
          <directionalLight position={[-100, 100, -100]} intensity={1} color="#e0f2fe" />
        </>
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
        ) : isGlass ? (
          <mesh name="base-floor" rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]} receiveShadow>
            <planeGeometry args={[20000, 20000]} />
            <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0.1} />
          </mesh>
        ) : (
          <mesh name="base-floor" rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]} receiveShadow>
            <planeGeometry args={[20000, 20000]} />
            <meshStandardMaterial color={isDay ? "#1e293b" : "#020617"} roughness={isDay ? 0.6 : 0.2} metalness={isDay ? 0 : 0.8} />
          </mesh>
        )}
        
        {showGrid && !isGlass && (
          <gridHelper 
            args={[10000, 100, 
              isDay ? "#334155" : (isPunk ? "#00ffff" : "#ffffff"), 
              isDay ? "#475569" : (isPunk ? "#ff00ff" : "#fbbf24")
            ]} 
            position={[0, 0.05, 0]} 
          />
        )}
        
        {elements.map((el, idx) => (<ArchitecturalElement key={el.id} element={el} index={idx} lightingMode={lightingMode} showMeasurements={showMeasurements} showFurniture={showFurniture} />))}
      </group>
      <ContactShadows resolution={4096} scale={4000} blur={0.5} opacity={isDay ? 0.4 : 1.0} far={200} color="#000000" />
    </>
  );
}

export default function FloorPlan3D({ elements = [], lightingMode = 'day', setLightingMode, viewMode = '3d', showGrid = true, showMeasurements = true, showFurniture = true }) {
  const [isFirstPerson, setIsFirstPerson] = React.useState(false);

  return (
    <div className="w-full h-full bg-[#000000] relative">
      <div className="absolute top-8 left-8 z-10 pointer-events-none flex flex-col gap-1">
        <span className="text-[12px] font-black tracking-[0.5em] text-[#fbbf24] uppercase drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]">PROVERSE BIM v42.0</span>
        
        <div className="pointer-events-auto mt-2 flex flex-col gap-2">
          {viewMode === '3d' && (
            <button onClick={() => {
              if (lightingMode === 'day') setLightingMode('glass');
              else if (lightingMode === 'glass') setLightingMode('night');
              else if (lightingMode === 'night') setLightingMode('punk');
              else setLightingMode('day');
            }} className="flex items-center gap-2 px-3 py-1.5 bg-black/60 border border-white/10 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-[#fbbf24] hover:text-slate-950 hover:shadow-[0_0_15px_rgba(251,191,36,0.4)] transition-all w-fit">
              {lightingMode === 'day' && <Sun size={14} className="text-yellow-400" />}
              {lightingMode === 'glass' && <Hexagon size={14} className="text-white" />}
              {lightingMode === 'night' && <Moon size={14} className="text-blue-400" />}
              {lightingMode === 'punk' && <Sparkles size={14} className="text-pink-500" />}
              {lightingMode === 'day' ? 'GOLDEN HOUR' : (lightingMode === 'glass' ? 'GLASS ARCHITECTURE' : (lightingMode === 'night' ? 'NIGHT' : 'NEON STALL (BETA)'))}
            </button>
          )}
          
          <button 
            id="fpv-overlay"
            onClick={() => setIsFirstPerson(!isFirstPerson)}
            className={`flex items-center gap-2 px-3 py-1.5 border rounded-lg text-[9px] font-black uppercase tracking-widest transition-all w-fit ${isFirstPerson ? 'bg-[#00ffff] text-black border-[#00ffff] shadow-[0_0_15px_rgba(0,255,255,0.4)]' : 'bg-black/60 border-white/10 text-white hover:bg-white/10'}`}
          >
            {isFirstPerson ? 'Exit Walkthrough' : 'Walk Inside (FPV)'}
          </button>
        </div>
        
        {isFirstPerson && (
          <div className="mt-4 text-[10px] text-white/70 font-mono tracking-widest">
            USE W,A,S,D TO WALK. MOUSE TO LOOK.
          </div>
        )}
      </div>

      <Canvas shadows={true} dpr={[1, 2]} gl={{ antialias: true }}>
        <Suspense fallback={null}>
          <SceneContent elements={elements} showGrid={showGrid} lightingMode={lightingMode} isFirstPerson={isFirstPerson} showMeasurements={showMeasurements} showFurniture={showFurniture} />
        </Suspense>
      </Canvas>
    </div>
  );
}
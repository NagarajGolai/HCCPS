import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Stage, Layer, Line, Rect, Transformer, Text, Group, Circle, Path } from 'react-konva';

const GRID_SIZE = 20;
const MAJOR_GRID = 100;
const SCALE_FACTOR = 4;

const THEME = {
  CANVAS_BG: '#0f172a',
  GRID_MINOR: 'rgba(255, 255, 255, 0.05)',
  GRID_MAJOR: 'rgba(255, 255, 255, 0.1)',
  WALL_STROKE: '#e2e8f0',
  WALL_ACTIVE: '#fbbf24',
  ROOM_FILL: 'rgba(56, 189, 248, 0.1)',
  ROOM_STROKE: '#38bdf8',
  GOLD: '#fbbf24',
  TEXT_PRIMARY: '#f8fafc',
  TEXT_SECONDARY: '#94a3b8',
};

const SYMBOLS = {
  sofa: "M10,30 L90,30 L90,70 L80,70 L80,90 L20,90 L20,70 L10,70 Z M20,30 L20,10 L80,10 L80,30",
  bed: "M10,10 L90,10 L90,90 L10,90 Z M10,10 L10,30 L90,30 L90,10 Z M20,40 L45,40 L45,20 L20,20 Z M55,40 L80,40 L80,20 L55,20 Z",
  door: "M0,100 L0,0 A100,100 0 0,1 100,100",
  window: "M0,0 L100,0 L100,20 L0,20 Z M50,0 L50,20",
};

export default function FloorPlanEditor({ elements, onUpdate, activeTool = 'select', setArea, zoom = 1, selectedId, setSelectedId }) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [tempPoints, setTempPoints] = useState([]);
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [cursor, setCursor] = useState('default');
  
  const stageRef = useRef();
  const trRef = useRef();
  const containerRef = useRef();

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    const totalSqFt = elements.reduce((acc, el) => {
      if (el.type === 'room') return acc + (el.width / SCALE_FACTOR) * (el.height / SCALE_FACTOR);
      return acc;
    }, 0);
    setArea?.(Math.round(totalSqFt));
  }, [elements, setArea]);

  useEffect(() => {
    if (selectedId && trRef.current) {
      const node = stageRef.current.findOne('#' + selectedId);
      if (node) {
        trRef.current.nodes([node]);
        trRef.current.getLayer().batchDraw();
      }
    }
  }, [selectedId, elements]);

  // Handle cursor logic
  useEffect(() => {
    if (activeTool === 'select') setCursor('grab');
    else if (activeTool === 'wall' || activeTool === 'room') setCursor('crosshair');
    else setCursor('default');
  }, [activeTool]);

  const getSnappedPos = useCallback((pos) => ({
    x: Math.round(pos.x / GRID_SIZE) * GRID_SIZE,
    y: Math.round(pos.y / GRID_SIZE) * GRID_SIZE
  }), []);

  const handleMouseDown = (e) => {
    const stage = stageRef.current;
    const pos = getSnappedPos(stage.getRelativePointerPosition());
    
    if (activeTool === 'wall') {
      setIsDrawing(true);
      setTempPoints([pos.x, pos.y, pos.x, pos.y]);
      setSelectedId(null);
    } else if (e.target === stage) {
      setSelectedId(null);
      if (activeTool === 'select') {
        setCursor('grabbing');
      } else if (activeTool !== 'wall') {
        const newEl = {
          id: `${activeTool}-${Date.now()}`,
          x: pos.x, y: pos.y,
          width: activeTool === 'room' ? 200 : 80,
          height: activeTool === 'room' ? 160 : 60,
          type: activeTool,
          name: activeTool.toUpperCase(),
          rotation: 0,
        };
        onUpdate([...elements, newEl]);
        setSelectedId(newEl.id);
      }
    }
  };

  const handleMouseMove = () => {
    const stage = stageRef.current;
    const pos = getSnappedPos(stage.getRelativePointerPosition());

    if (isDrawing && activeTool === 'wall') {
      const [startX, startY] = tempPoints;
      let endX = pos.x;
      let endY = pos.y;
      const dx = Math.abs(endX - startX);
      const dy = Math.abs(endY - startY);
      if (dx > dy * 1.5) endY = startY;
      else if (dy > dx * 1.5) endX = startX;
      setTempPoints([startX, startY, endX, endY]);
    }
  };

  const handleMouseUp = () => {
    if (activeTool === 'select') setCursor('grab');
    
    if (isDrawing && activeTool === 'wall') {
      const [x1, y1, x2, y2] = tempPoints;
      if (x1 !== x2 || y1 !== y2) {
        const newWall = { 
          id: `wall-${Date.now()}`, 
          x: x1, y: y1, 
          points: [0, 0, x2 - x1, y2 - y1], 
          type: 'wall', 
          name: 'WALL', 
          rotation: 0,
          width: Math.abs(x2 - x1) || 1,
          height: Math.abs(y2 - y1) || 1,
        };
        onUpdate([...elements, newWall]);
      }
      setIsDrawing(false);
      setTempPoints([]);
    }
  };

  const updateElement = (id, attrs) => {
    const updated = elements.map(el => el.id === id ? { ...el, ...attrs } : el);
    onUpdate(updated);
  };

  return (
    <div ref={containerRef} className="w-full h-full bg-[#0f172a] relative" style={{ cursor }}>
      <Stage
        ref={stageRef}
        width={dimensions.width}
        height={dimensions.height}
        scaleX={zoom}
        scaleY={zoom}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        draggable={activeTool === 'select' && !selectedId}
        onDragStart={() => setCursor('grabbing')}
        onDragEnd={() => setCursor('grab')}
      >
        <Layer>
          {Array.from({ length: 400 }).map((_, i) => (
            <Line key={`v-${i}`} points={[i * GRID_SIZE, -2000, i * GRID_SIZE, 4000]} stroke={i * GRID_SIZE % MAJOR_GRID === 0 ? THEME.GRID_MAJOR : THEME.GRID_MINOR} strokeWidth={0.5} listening={false} />
          ))}
          {Array.from({ length: 400 }).map((_, i) => (
            <Line key={`h-${i}`} points={[-2000, i * GRID_SIZE, 4000, i * GRID_SIZE]} stroke={i * GRID_SIZE % MAJOR_GRID === 0 ? THEME.GRID_MAJOR : THEME.GRID_MINOR} strokeWidth={0.5} listening={false} />
          ))}

          {elements.map((el) => {
            const isSelected = selectedId === el.id;
            return (
              <Group 
                key={el.id} id={el.id} x={el.x} y={el.y} width={el.width} height={el.height} rotation={el.rotation}
                draggable={activeTool === 'select'}
                onClick={(e) => {
                  e.cancelBubble = true;
                  if (activeTool === 'select') setSelectedId(el.id);
                }}
                onMouseEnter={() => activeTool === 'select' && setCursor('pointer')}
                onMouseLeave={() => activeTool === 'select' && setCursor('grab')}
                onDragEnd={(e) => {
                  const pos = getSnappedPos({ x: e.target.x(), y: e.target.y() });
                  updateElement(el.id, { x: pos.x, y: pos.y });
                }}
                onTransformEnd={(e) => {
                  const node = e.target;
                  const scaleX = node.scaleX();
                  const scaleY = node.scaleY();
                  node.scaleX(1); node.scaleY(1);
                  const newW = Math.max(20, Math.round((el.width * scaleX) / GRID_SIZE) * GRID_SIZE);
                  const newH = Math.max(20, Math.round((el.height * scaleY) / GRID_SIZE) * GRID_SIZE);
                  updateElement(el.id, {
                    x: node.x(), y: node.y(),
                    width: newW, height: newH,
                    rotation: node.rotation(),
                  });
                }}
              >
                {el.type === 'wall' ? (
                  <Line points={el.points} stroke={isSelected ? THEME.WALL_ACTIVE : THEME.WALL_STROKE} strokeWidth={8} lineCap="square" />
                ) : el.type === 'room' ? (
                  <Rect width={el.width} height={el.height} fill={THEME.ROOM_FILL} stroke={isSelected ? THEME.GOLD : THEME.ROOM_STROKE} strokeWidth={2} cornerRadius={2} />
                ) : (
                  <Group>
                    {SYMBOLS[el.type] ? (
                      <Path data={SYMBOLS[el.type]} fill="rgba(255,255,255,0.08)" stroke={isSelected ? THEME.GOLD : THEME.TEXT_SECONDARY} strokeWidth={2} scaleX={el.width / 100} scaleY={el.height / 100} />
                    ) : (
                      <Rect width={el.width} height={el.height} fill="rgba(255,255,255,0.05)" stroke={isSelected ? THEME.GOLD : THEME.TEXT_SECONDARY} strokeWidth={1} />
                    )}
                  </Group>
                )}
                <Text text={el.name} x={5} y={-15} fontSize={10} fontStyle="bold" fill={isSelected ? THEME.GOLD : THEME.TEXT_PRIMARY} />
              </Group>
            );
          })}

          {isDrawing && (
            <Line points={tempPoints} stroke={THEME.GOLD} strokeWidth={6} dash={[10, 5]} opacity={0.6} />
          )}

          {selectedId && (
            <Transformer
              ref={trRef}
              anchorFill={THEME.GOLD} anchorStroke="#ffffff" anchorSize={10} anchorCornerRadius={2}
              borderStroke={THEME.GOLD} borderDash={[5, 2]}
              keepRatio={false}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
}
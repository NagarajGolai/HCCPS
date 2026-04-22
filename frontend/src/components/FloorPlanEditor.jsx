import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Stage, Layer, Line, Rect, Transformer, Text, Group } from 'react-konva';
import { motion, AnimatePresence } from 'framer-motion';

const GRID_SIZE = 20;
const MAJOR_GRID = 100;

export default function FloorPlanEditor({ formData, onUpdate, activeTool = 'select', setArea }) {
  const [elements, setElements] = useState([
    { id: 'room1', x: 200, y: 140, width: 240, height: 180, type: 'room', name: 'Primary Suite' },
  ]);
  const [selectedId, setSelectedId] = useState(null);
  const stageRef = useRef();
  const trRef = useRef();

  // Attach transformer
  useEffect(() => {
    if (selectedId && trRef.current) {
      const stage = stageRef.current;
      const selectedNode = stage.findOne('#' + selectedId);
      if (selectedNode) {
        trRef.current.nodes([selectedNode]);
        trRef.current.getLayer().batchDraw();
      }
    }
  }, [selectedId]);

  // Calculate total area
  useEffect(() => {
    const totalArea = elements.reduce((acc, el) => {
      if (el.type === 'room') {
        const area = (el.width / 4) * (el.height / 4);
        return acc + area;
      }
      return acc;
    }, 0);
    setArea?.(Math.round(totalArea));
  }, [elements, setArea]);

  const handleStageClick = (e) => {
    if (e.target === e.target.getStage()) {
      setSelectedId(null);
      if (activeTool !== 'select') {
        const pos = e.target.getStage().getPointerPosition();
        const x = Math.round(pos.x / GRID_SIZE) * GRID_SIZE;
        const y = Math.round(pos.y / GRID_SIZE) * GRID_SIZE;
        
        const newEl = {
          id: `${activeTool}-${Date.now()}`,
          x,
          y,
          width: activeTool === 'room' ? 120 : (activeTool === 'wall' ? 120 : 40),
          height: activeTool === 'room' ? 120 : (activeTool === 'wall' ? 8 : 20),
          type: activeTool,
          name: activeTool.charAt(0).toUpperCase() + activeTool.slice(1),
        };
        setElements([...elements, newEl]);
      }
      return;
    }
    const id = e.target.id();
    if (id) setSelectedId(id);
  };

  const getToolColors = (type, isSelected) => {
    if (isSelected) return { fill: '#3b82f622', stroke: '#3b82f6', strokeWidth: 2 };
    switch (type) {
      case 'room': return { fill: '#eff6ff', stroke: '#3b82f6', strokeWidth: 1.5 };
      case 'wall': return { fill: '#1e293b', stroke: '#0f172a', strokeWidth: 1 };
      case 'door': return { fill: '#fffbeb', stroke: '#d97706', strokeWidth: 1 };
      case 'window': return { fill: '#f0f9ff', stroke: '#0ea5e9', strokeWidth: 1 };
      case 'furniture': return { fill: '#f8fafc', stroke: '#94a3b8', strokeWidth: 1 };
      default: return { fill: '#ffffff', stroke: '#cbd5e1', strokeWidth: 1 };
    }
  };

  const updateElement = (id, attrs) => {
    const newElements = elements.map((el) => {
      if (el.id === id) {
        const snappedAttrs = { ...attrs };
        if (attrs.x !== undefined) snappedAttrs.x = Math.round(attrs.x / GRID_SIZE) * GRID_SIZE;
        if (attrs.y !== undefined) snappedAttrs.y = Math.round(attrs.y / GRID_SIZE) * GRID_SIZE;
        if (attrs.width !== undefined) snappedAttrs.width = Math.round(attrs.width / GRID_SIZE) * GRID_SIZE;
        if (attrs.height !== undefined) snappedAttrs.height = Math.round(attrs.height / GRID_SIZE) * GRID_SIZE;
        return { ...el, ...snappedAttrs };
      }
      return el;
    });
    setElements(newElements);
    onUpdate?.(newElements);
  };

  const handleDelete = (id) => {
    setElements(elements.filter(el => el.id !== id));
    setSelectedId(null);
  };

  return (
    <div className="relative w-full h-full bg-slate-50 overflow-hidden">
      {/* HUD Overlay */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">CAD Interactive Canvas</span>
        </div>
        <div className="text-[10px] font-mono text-slate-400">
          Scale: 4px = 1' | {elements.length} Elements | Tool: {activeTool.toUpperCase()}
        </div>
      </div>

      <div className="absolute top-4 right-4 z-10 pointer-events-auto flex gap-2">
        {selectedId && (
          <>
            <button 
              onClick={() => setSelectedId(null)}
              className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-[10px] font-bold rounded shadow-sm hover:bg-slate-50 transition-all"
            >
              Deselect
            </button>
            <button 
              onClick={() => handleDelete(selectedId)}
              className="px-3 py-1.5 bg-red-50 border border-red-100 text-red-600 text-[10px] font-bold rounded shadow-sm hover:bg-red-500 hover:text-white transition-all"
            >
              Delete
            </button>
          </>
        )}
        <button 
          onClick={() => window.confirm("Clear all elements?") && setElements([])}
          className="px-3 py-1.5 bg-white border border-slate-200 text-slate-400 text-[10px] font-bold rounded shadow-sm hover:text-slate-600 transition-all"
        >
          Clear Canvas
        </button>
      </div>

      <Stage
        ref={stageRef}
        width={800}
        height={600}
        onClick={handleStageClick}
        className="bg-white cursor-crosshair"
      >
        <Layer>
          {/* Professional Grid */}
          {Array.from({ length: 800 / GRID_SIZE }).map((_, i) => (
            <Line
              key={`v-${i}`}
              points={[i * GRID_SIZE, 0, i * GRID_SIZE, 600]}
              stroke={i * GRID_SIZE % MAJOR_GRID === 0 ? "#e2e8f0" : "#f1f5f9"}
              strokeWidth={i * GRID_SIZE % MAJOR_GRID === 0 ? 1 : 0.5}
            />
          ))}
          {Array.from({ length: 600 / GRID_SIZE }).map((_, i) => (
            <Line
              key={`h-${i}`}
              points={[0, i * GRID_SIZE, 800, i * GRID_SIZE]}
              stroke={i * GRID_SIZE % MAJOR_GRID === 0 ? "#e2e8f0" : "#f1f5f9"}
              strokeWidth={i * GRID_SIZE % MAJOR_GRID === 0 ? 1 : 0.5}
            />
          ))}

          {elements.map((el) => {
            const isSelected = selectedId === el.id;
            const styles = getToolColors(el.type, isSelected);
            return (
              <Group key={el.id}>
                <Rect
                  id={el.id}
                  x={el.x}
                  y={el.y}
                  width={el.width}
                  height={el.height}
                  fill={styles.fill}
                  stroke={styles.stroke}
                  strokeWidth={styles.strokeWidth}
                  cornerRadius={el.type === 'room' ? 2 : 0}
                  draggable={activeTool === 'select'}
                  onDragEnd={(e) => updateElement(el.id, { x: e.target.x(), y: e.target.y() })}
                  onTransformEnd={(e) => {
                    const node = e.target;
                    updateElement(el.id, {
                      x: node.x(),
                      y: node.y(),
                      width: Math.max(10, node.width() * node.scaleX()),
                      height: Math.max(10, node.height() * node.scaleY()),
                    });
                    node.scaleX(1);
                    node.scaleY(1);
                  }}
                />
                
                <Text 
                  text={el.name}
                  x={el.x + 8}
                  y={el.y + 8}
                  fontSize={10}
                  fontFamily="Inter"
                  fontStyle="bold"
                  fill={isSelected ? "#2563eb" : "#475569"}
                  listening={false}
                />
                
                {el.type === 'room' && (
                  <Group>
                    <Text 
                      text={`${Math.round((el.width / 4) * (el.height / 4))} SQFT`}
                      x={el.x + 8}
                      y={el.y + el.height - 18}
                      fontSize={9}
                      fontFamily="monospace"
                      fill="#64748b"
                      listening={false}
                    />
                    <Text 
                      text={`${el.width/4}' x ${el.height/4}'`}
                      x={el.x + el.width/2 - 20}
                      y={el.y + el.height/2 - 5}
                      fontSize={8}
                      fontFamily="monospace"
                      fill="#94a3b8"
                      listening={false}
                      opacity={isSelected ? 1 : 0.4}
                    />
                  </Group>
                )}
              </Group>
            );
          })}

          {selectedId && (
            <Transformer
              ref={trRef}
              anchorFill="#3b82f6"
              anchorStroke="#ffffff"
              anchorSize={6}
              borderStroke="#3b82f6"
              rotateEnabled={false}
              boundBoxFunc={(oldBox, newBox) => {
                if (newBox.width < 10 || newBox.height < 10) return oldBox;
                return newBox;
              }}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
}

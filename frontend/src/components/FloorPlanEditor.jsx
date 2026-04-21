import React, { useCallback, useRef, useState } from 'react';
import { Stage, Layer, Line, Rect, Transformer } from 'react-konva';
import { motion } from 'framer-motion';

export default function FloorPlanEditor({ formData, onUpdate }) {
  const [elements, setElements] = useState([
    // Default sample room
    { id: 'room1', x: 100, y: 100, width: 200, height: 150, type: 'room', draggable: true },
  ]);
  const [selectedId, setSelectedId] = useState(null);
  const stageRef = useRef();
  const trRef = useRef();

  const checkDeselect = useCallback((e) => {
    const clicked = e.target;
    if (clicked === e.target.getStage() || clicked.getClassName?.() === 'Transformer') {
      setSelectedId(null);
    }
  }, []);

  const handleSelect = useCallback((id) => {
    setSelectedId(id);
  }, []);

  const updateElement = useCallback((id, attrs) => {
    const els = elements.slice();
    const idx = els.findIndex((el) => el.id === id);
    els[idx] = { ...els[idx], ...attrs };
    setElements(els);
    onUpdate?.(els);
  }, [elements, onUpdate]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pro-card p-2 border-2 border-dashed border-pro-blue-300 shadow-pro-lift h-[600px] relative overflow-hidden"
    >
      <div className="absolute top-4 left-4 text-xs text-pro-bg-500 z-10">
        {formData?.builtup_area_sqft?.toLocaleString()} sqft | Scale 1px=1ft | Total elements: {elements.length}
      </div>
      
      <Stage
        ref={stageRef}
        width={window.innerWidth < 768 ? 400 : 800}
        height={600}
        onMouseDown={checkDeselect}
        className="bg-gradient-to-br from-slate-50 to-white"
        draggable
      >
        <Layer>
          {/* Grid */}
          <Line 
            points={[0, 0, 800, 0, 800, 600, 0, 600, 0, 0]}
            stroke="#e5e7eb" 
            strokeWidth={1}
            closed
          />
          {Array.from({ length: 40 }, (_, i) => (
            <React.Fragment key={`grid-v-${i}`}>
              <Line points={[i * 20, 0, i * 20, 600]} stroke="#f3f4f6" strokeWidth={0.5} />
            </React.Fragment>
          ))}
          {Array.from({ length: 30 }, (_, i) => (
            <React.Fragment key={`grid-h-${i}`}>
              <Line points={[0, i * 20, 800, i * 20]} stroke="#f3f4f6" strokeWidth={0.5} />
            </React.Fragment>
          ))}

          {/* Elements */}
          {elements.map((el) => (
            <Rect
              key={el.id}
              id={el.id}
              x={el.x}
              y={el.y}
              width={el.width}
              height={el.height}
              fill={el.type === 'room' ? '#dbeafe' : '#fef3c7'}
              stroke="#3b82f6"
              strokeWidth={2}
              draggable
              onSelect={() => handleSelect(el.id)}
              onDragEnd={(e) => updateElement(el.id, { x: e.target.x(), y: e.target.y() })}
              onTransformEnd={(e) => {
                const node = e.target;
                updateElement(el.id, {
                  x: node.x(),
                  y: node.y(),
                  width: node.width() * node.scaleX(),
                  height: node.height() * node.scaleY(),
                  scaleX: 1,
                  scaleY: 1,
                });
              }}
              shadowColor="black"
              shadowBlur={10}
              shadowOpacity={0.2}
            />
          ))}

          {selectedId && (
            <Transformer
              ref={trRef}
              selectedShapeProps={{ id: selectedId }}
              onSelectEnd={() => trRef.current?.setAttrs({ scaleX: 1, scaleY: 1 })}
            />
          )}
        </Layer>
      </Stage>

      <div className="absolute bottom-4 left-4 right-4 flex gap-2 text-xs z-10">
        <button className="pro-btn px-4 py-2 text-xs shadow-none">+ Wall</button>
        <button className="pro-btn px-4 py-2 text-xs shadow-none">+ Door</button>
        <button className="pro-btn px-4 py-2 text-xs shadow-none">+ Furniture</button>
        <button className="pro-btn-success px-6 py-2 text-xs ml-auto shadow-none">Export DXF</button>
      </div>
    </motion.div>
  );
}


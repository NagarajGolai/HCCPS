import React, { Suspense } from "react";
import FloorPlanEditor from "./FloorPlanEditor";
import FloorPlan3D from "./FloorPlan3D";

export default function ExportLayoutRender({ elements }) {
  return (
    <div className="flex flex-row w-[1820px] h-[760px] bg-[#0f172a] p-8 gap-8">
      {/* 2D Plan */}
      <div className="flex-1 rounded-2xl border-4 border-slate-700 bg-[#0f172a] relative overflow-hidden">
        <h2 className="absolute top-4 left-4 z-10 text-xl font-black text-white tracking-widest bg-slate-900/80 p-3 rounded">2D DRAFTING VIEW</h2>
        <FloorPlanEditor 
          elements={elements} 
          onUpdate={() => {}} 
          activeTool="select" 
          setArea={() => {}} 
          zoom={1} 
          selectedId={null} 
          setSelectedId={() => {}} 
          showMeasurements={true} 
          showFurniture={true} 
        />
      </div>

      {/* 3D Plan */}
      <div className="flex-1 rounded-2xl border-4 border-slate-700 bg-[#0f172a] relative overflow-hidden">
        <h2 className="absolute top-4 left-4 z-10 text-xl font-black text-white tracking-widest bg-slate-900/80 p-3 rounded">3D STRUCTURAL VIEW</h2>
        <Suspense fallback={null}>
          <FloorPlan3D 
            elements={elements} 
            lightingMode="day" 
            showGrid={true} 
            showMeasurements={true} 
            showFurniture={true} 
            preserveDrawingBuffer={true}
          />
        </Suspense>
      </div>
    </div>
  );
}

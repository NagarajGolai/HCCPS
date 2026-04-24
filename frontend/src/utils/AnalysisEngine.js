const ECO_BASE_SCORES = {
  Standard: 62,
  Premium: 74,
  Luxury: 41,
};

const MATERIAL_IMPROVEMENTS = {
  Standard: {
    recommendation: "Switch to Fly Ash Bricks and PPC cement blend",
    ecoGain: 18,
    costDeltaPercent: -4,
  },
  Premium: {
    recommendation: "Adopt low-carbon concrete with recycled steel",
    ecoGain: 12,
    costDeltaPercent: 2,
  },
  Luxury: {
    recommendation: "Use engineered bamboo flooring and AAC blocks",
    ecoGain: 22,
    costDeltaPercent: -3,
  },
};

const SOIL_VASTU_FACTOR = {
  "Hard Rock": 8,
  Sandy: 4,
  Clay: -3,
  "Black Cotton": -8,
  Loamy: 6,
};

export function analyzeEcoScore(houseData) {
  const materialTier = houseData.material_tier || "Standard";
  const base = ECO_BASE_SCORES[materialTier] ?? 60;
  
  const solarBonus = houseData.has_solar ? 15 : 0;
  const rainwaterBonus = houseData.has_rainwater ? 10 : 0;
  const waterSourcePenalty = houseData.water_source === 'Borewell' ? 5 : 0;

  const density = Number(houseData.builtup_area_sqft || 0) / Number(houseData.plot_area_sqft || 1);
  const floorPenalty = Math.max(0, Number(houseData.floors || 1) - 2) * 3;
  const densityPenalty = density > 1.1 ? Math.min(14, Math.round((density - 1.1) * 18)) : 0;
  
  const score = Math.max(0, Math.min(100, Math.round(base + solarBonus + rainwaterBonus - waterSourcePenalty - floorPenalty - densityPenalty)));
  const improvement = MATERIAL_IMPROVEMENTS[materialTier] || MATERIAL_IMPROVEMENTS.Standard;
  const projectedScore = Math.min(100, score + (houseData.has_solar ? 0 : improvement.ecoGain));

  return {
    score,
    label: getLabel(score),
    recommendation: improvement.recommendation,
    ecoGain: improvement.ecoGain,
    costDeltaPercent: improvement.costDeltaPercent,
    projectedScore,
  };
}

export function analyzeVastuScore(houseData) {
  const floors = Number(houseData.floors || 1);
  const builtup = Number(houseData.builtup_area_sqft || 1000);
  const plot = Number(houseData.plot_area_sqft || 1200);
  const soilBonus = SOIL_VASTU_FACTOR[houseData.soil_type] ?? 0;
  
  const facingBonus = houseData.facing === 'East' ? 8 : (houseData.facing === 'North' ? 5 : 0);
  const kitchenBonus = houseData.kitchen_location === 'South-East' ? 12 : 0;
  const boundaryBonus = houseData.has_boundary_wall ? 3 : 0;

  const ratio = builtup / Math.max(plot, 1);
  let score = 65; // Base score adjusted

  score += facingBonus + kitchenBonus + boundaryBonus + soilBonus;

  if (ratio <= 0.85) score += 10;
  else if (ratio <= 1.05) score += 5;
  else score -= 6;

  if (floors <= 2) score += 4;
  if (floors >= 4) score -= 5;

  const findings = [];
  if (houseData.facing !== 'East') findings.push(`${houseData.facing} facing is acceptable, but East orientation is preferred for morning prana.`);
  if (houseData.kitchen_location !== 'South-East') findings.push("Kitchen is not in the Agni (SE) zone; consider minor interior adjustments.");
  if (!houseData.has_boundary_wall) findings.push("Lack of boundary wall may affect energy containment and site security.");
  if (ratio > 1.1) findings.push("High built-up density suggests tighter energy circulation zones.");
  
  if (findings.length === 0) {
    findings.push("Your configuration is exceptionally well-aligned with Vastu principles.");
  }

  const bounded = Math.max(0, Math.min(100, Math.round(score)));
  return {
    score: bounded,
    label: getLabel(bounded),
    findings,
  };
}

export function generateBoq(houseData, predictedCostInr) {
  const builtup = Number(houseData.builtup_area_sqft || 1000);
  const floors = Number(houseData.floors || 1);
  const base = Number(predictedCostInr || builtup * 2500);

  const entries = [
    { item: "Foundation & Excavation", ratio: 0.16 },
    { item: "RCC Frame & Structural Works", ratio: 0.24 },
    { item: "Masonry & Wall Systems", ratio: 0.14 },
    { item: "Roofing & Waterproofing", ratio: 0.08 },
    { item: "Electrical & Smart Wiring", ratio: 0.09 },
    { item: "Plumbing & Sanitary", ratio: 0.08 },
    { item: "Flooring & Finishes", ratio: 0.11 },
    { item: "MEP, Fixtures & Contingency", ratio: 0.1 },
  ];

  return entries.map((entry) => ({
    ...entry,
    amount: Math.round(base * entry.ratio * (1 + Math.max(0, floors - 2) * 0.02)),
    qtyHint: `${Math.round((builtup * entry.ratio) / 12)} work units`,
  }));
}


export function generateFloorPlanElements(houseData, includeFurniture = false) {
  const bhk = Math.max(1, Math.min(10, Number(houseData.bhk || 1)));
  const builtupArea = Number(houseData.builtup_area_sqft || 1000);
  const floors = Number(houseData.floors || 1);
  
  const SCALE = 4; // 1ft = 4px
  const elements = [];
  
  const centerX = 400;
  const centerY = 300;

  // Sizes in PX (1ft = 4px)
  const DOOR_SIZE = 12; // 3ft
  const WINDOW_SIZE = 24; // 6ft
  const livingW = 18 * SCALE;
  const livingH = 15 * SCALE;

  function addRoomWithWalls(x, y, w, h, name, color, type = 'room') {
    const roomId = `${type}-${name}-${Date.now()}-${Math.random()}`;
    elements.push({
      id: roomId,
      x, y, width: w, height: h,
      type: 'room', name, rotation: 0, color
    });

    const wallData = [
      { x1: 0, y1: 0, x2: w, y2: 0 }, // Top
      { x1: w, y1: 0, x2: w, y2: h }, // Right
      { x1: w, y1: h, x2: 0, y2: h }, // Bottom
      { x1: 0, y1: h, x2: 0, y2: 0 }, // Left
    ];

    wallData.forEach((wd, i) => {
      elements.push({
        id: `wall-${roomId}-${i}`,
        x: x + wd.x1, y: y + wd.y1,
        points: [0, 0, wd.x2 - wd.x1, wd.y2 - wd.y1],
        type: 'wall', name: 'WALL', rotation: 0,
        width: Math.max(2, Math.abs(wd.x2 - wd.x1)),
        height: Math.max(2, Math.abs(wd.y2 - wd.y1)),
        color: "#94a3b8" // Slate color for walls
      });
    });

    return roomId;
  }

  function addOpening(x, y, type, rotation = 0) {
    const isDoor = type === 'door';
    elements.push({
      id: `${type}-${Date.now()}-${Math.random()}`,
      x, y, 
      width: isDoor ? DOOR_SIZE : WINDOW_SIZE, 
      height: isDoor ? DOOR_SIZE : 8,
      type, name: type.toUpperCase(), rotation,
      color: isDoor ? "#fb923c" : "#38bdf8" // Orange for doors, Blue for windows
    });
  }

  function addItem(x, y, type, w = 40, h = 40, rotation = 0) {
    elements.push({
      id: `${type}-${Date.now()}-${Math.random()}`,
      x, y, width: w, height: h,
      type, name: type.toUpperCase(), rotation
    });
  }

  // 1. Living Room
  addRoomWithWalls(centerX, centerY, livingW, livingH, 'LIVING', "#fbbf24");
  addOpening(centerX + livingW / 2 - DOOR_SIZE / 2, centerY + livingH - 4, 'door', 0);
  
  if (includeFurniture) {
    addItem(centerX + 20, centerY + 20, 'sofa', 60, 40);
    addItem(centerX + livingW - 50, centerY + 20, 'desk', 40, 30); // TV unit
  }

  // 2. Kitchen
  const kitchenW = 10 * SCALE;
  const kitchenH = 10 * SCALE;
  addRoomWithWalls(centerX, centerY - kitchenH, kitchenW, kitchenH, 'KITCHEN', "#34d399");
  addOpening(centerX + kitchenW - 5, centerY - kitchenH / 2 - WINDOW_SIZE / 2, 'window', 90);
  
  if (includeFurniture) {
    addItem(centerX + 10, centerY - kitchenH + 10, 'fridge', 25, 25);
    addItem(centerX + kitchenW - 35, centerY - kitchenH + 10, 'cabinet', 30, 20);
  }

  // 3. Bedrooms
  const roomPositions = [
    { x: centerX + livingW, y: centerY, w: 12 * SCALE, h: 12 * SCALE },
    { x: centerX - 12 * SCALE, y: centerY, w: 12 * SCALE, h: 12 * SCALE },
    { x: centerX + livingW, y: centerY - 12 * SCALE, w: 12 * SCALE, h: 12 * SCALE },
    { x: centerX, y: centerY + livingH, w: 12 * SCALE, h: 12 * SCALE },
  ];

  for (let i = 0; i < bhk; i++) {
    const pos = roomPositions[i % roomPositions.length];
    const offset = Math.floor(i / roomPositions.length) * 10;
    const rx = pos.x + offset;
    const ry = pos.y + offset;
    addRoomWithWalls(rx, ry, pos.w, pos.h, `BEDROOM ${i + 1}`, "#38bdf8");
    
    addOpening(rx + 5, ry + pos.h - 5, 'door', 0);
    addOpening(rx + pos.w - 5, ry + pos.h / 2 - WINDOW_SIZE / 2, 'window', 90);
    
    if (includeFurniture) {
      addItem(rx + 20, ry + 20, 'bed', 50, 50);
      addItem(rx + pos.w - 40, ry + pos.h - 35, 'desk', 30, 25);
    }
  }

  // 4. Bathrooms
  const bathCount = Math.max(1, bhk - 1);
  for (let i = 0; i < bathCount; i++) {
    const bx = centerX + livingW - 30;
    const by = centerY + livingH + 10 + (i * 50);
    addRoomWithWalls(bx, by, 30, 40, 'BATH', "#818cf8");
  }

  return elements;
}

function getLabel(score) {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Strong";
  if (score >= 55) return "Moderate";
  return "Needs Optimization";
}

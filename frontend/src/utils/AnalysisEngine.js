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
  
  // Base Score by Tier
  let base = 0;
  if (materialTier === 'Luxury') base = 35;
  else if (materialTier === 'Premium') base = 25;
  else base = 10;
  
  // Solar & Rainwater
  const solarBonus = houseData.has_solar ? 25 : 0;
  const rainwaterBonus = houseData.has_rainwater ? 20 : 0;
  
  // Roofing
  let roofingBonus = 0;
  if (houseData.roofing === 'Living Roof') roofingBonus = 20;
  else if (houseData.roofing === 'Standard') roofingBonus = 10;
  else if (houseData.roofing === 'Bare Concrete') roofingBonus = -15;

  // Axis Bonus
  const axisBonus = (houseData.facing === 'North' || houseData.facing === 'South') ? 10 : 0;

  // Penalties
  const density = Number(houseData.builtup_area_sqft || 0) / Number(houseData.plot_area_sqft || 1);
  const densityPenalty = density > 1.1 ? Math.min(20, Math.round((density - 1.1) * 20)) : 0;
  
  let score = base + solarBonus + rainwaterBonus + roofingBonus + axisBonus - densityPenalty;
  score = Math.max(0, Math.min(100, Math.round(score)));

  const improvement = MATERIAL_IMPROVEMENTS[materialTier] || MATERIAL_IMPROVEMENTS.Standard;
  const projectedScore = Math.min(100, score + (houseData.has_solar ? 0 : 25) + (houseData.roofing === 'Living Roof' ? 0 : 15));

  let label = "The Thermal Heat-Trap";
  if (score >= 90) label = "The Net-Zero Echelon";
  else if (score >= 60) label = "The Efficient Modern";

  return {
    score,
    label,
    recommendation: improvement.recommendation,
    ecoGain: projectedScore - score,
    costDeltaPercent: improvement.costDeltaPercent,
    projectedScore,
  };
}

export function analyzeVastuScore(houseData) {
  let score = 10; // Base baseline
  const findings = [];

  // Facing
  if (houseData.facing === 'North-East') {
    score += 35;
    findings.push("Ishanya Paradigm: Main portal in North-East ensures maximum positive energy flow.");
  } else if (['North', 'East', 'West'].includes(houseData.facing)) {
    score += 20;
    findings.push(`Remedial Tier: ${houseData.facing} entrance is auspicious but requires minor color remedies.`);
  } else if (houseData.facing === 'South-West') {
    score -= 20;
    findings.push("Nairutya Conflict: South-West entrance acts as a significant energy drain.");
  } else {
    score += 5;
    findings.push(`${houseData.facing} entrance is acceptable but not optimal.`);
  }

  // Kitchen
  if (houseData.kitchen_location === 'South-East') {
    score += 30;
    findings.push("Agni Tattva: Kitchen is perfectly placed in the South-East.");
  } else if (houseData.kitchen_location === 'North-West') {
    score += 15;
    findings.push("Vayu Tattva: North-West kitchen is an acceptable secondary location.");
  } else if (['South-West', 'North-East'].includes(houseData.kitchen_location)) {
    score -= 15;
    findings.push(`Elemental Clash: Kitchen in ${houseData.kitchen_location} causes Fire/Water or Earth/Fire conflict.`);
  }

  // Brahmasthan
  if (houseData.center_type === 'Open') {
    score += 25;
    findings.push("Brahmasthan: Central courtyard is a 0-weight zone, completely open for cosmic alignment.");
  } else if (houseData.center_type === 'Light') {
    score += 15;
    findings.push("Brahmasthan: Light furniture in the center avoids energy stagnation.");
  } else if (houseData.center_type === 'Heavy') {
    score -= 25;
    findings.push("Brahmasthan Blockage: Heavy pillar or staircase in the center causes severe energetic congestion.");
  }

  const bounded = Math.max(0, Math.min(100, Math.round(score)));
  
  let label = "The Nairutya Conflict";
  if (bounded >= 90) label = "The Ishanya Paradigm";
  else if (bounded >= 60) label = "The Remedial Tier";

  return {
    score: bounded,
    label,
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
    qtyHint: `${Math.round((builtup * entry.ratio) / 12)} standard work units`,
  }));
}


export function generateFloorPlanElements(houseData, includeFurniture = true) {
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
    addItem(centerX + livingW / 2 - 30, centerY + livingH / 2 - 30, 'rug', 60, 60); // Center rug
    addItem(centerX + livingW - 30, centerY + livingH - 30, 'plant', 20, 20); // Corner plant
  }

  // 2. Kitchen
  const kitchenW = 10 * SCALE;
  const kitchenH = 10 * SCALE;
  addRoomWithWalls(centerX, centerY - kitchenH, kitchenW, kitchenH, 'KITCHEN', "#34d399");
  addOpening(centerX + kitchenW - 5, centerY - kitchenH / 2 - WINDOW_SIZE / 2, 'window', 90);
  
  if (includeFurniture) {
    addItem(centerX + 10, centerY - kitchenH + 10, 'fridge', 25, 25);
    addItem(centerX + kitchenW - 35, centerY - kitchenH + 10, 'cabinet', 30, 20);
    addItem(centerX + 10, centerY - kitchenH / 2, 'dining', 40, 30); // Small dining setup
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
      addItem(rx + 5, ry + 20, 'plant', 15, 15);
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

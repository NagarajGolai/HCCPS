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

function getLabel(score) {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Strong";
  if (score >= 55) return "Moderate";
  return "Needs Optimization";
}

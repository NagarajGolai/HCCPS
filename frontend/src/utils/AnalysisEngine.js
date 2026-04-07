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
  const density = Number(houseData.builtup_area_sqft || 0) / Number(houseData.plot_area_sqft || 1);
  const floorPenalty = Math.max(0, Number(houseData.floors || 1) - 2) * 3;
  const densityPenalty = density > 1.1 ? Math.min(14, Math.round((density - 1.1) * 18)) : 0;
  const bhkPenalty = Number(houseData.bhk || 1) >= 5 ? 4 : 0;
  const score = Math.max(0, Math.min(100, Math.round(base - floorPenalty - densityPenalty - bhkPenalty)));
  const improvement = MATERIAL_IMPROVEMENTS[materialTier] || MATERIAL_IMPROVEMENTS.Standard;
  const projectedScore = Math.min(100, score + improvement.ecoGain);

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
  const bhk = Number(houseData.bhk || 1);
  const builtup = Number(houseData.builtup_area_sqft || 1000);
  const plot = Number(houseData.plot_area_sqft || 1200);
  const soilBonus = SOIL_VASTU_FACTOR[houseData.soil_type] ?? 0;
  const ratio = builtup / Math.max(plot, 1);
  let score = 72;

  if (ratio <= 0.85) score += 10;
  else if (ratio <= 1.05) score += 5;
  else score -= 6;

  if (bhk >= 2 && bhk <= 4) score += 5;
  if (floors <= 2) score += 4;
  if (floors >= 4) score -= 5;
  score += soilBonus;

  const findings = [];
  if (ratio > 1.1) findings.push("High built-up density suggests tighter energy circulation zones.");
  if (floors >= 4) findings.push("Tall vertical stacking may reduce natural airflow harmony.");
  if (houseData.soil_type === "Black Cotton") {
    findings.push("Black Cotton soil indicates enhanced foundation correction advisory.");
  }
  if (findings.length === 0) {
    findings.push("Primary massing ratio and floor distribution are broadly Vastu-aligned.");
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

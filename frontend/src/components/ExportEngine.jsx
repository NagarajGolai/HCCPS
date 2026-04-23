import { motion } from "framer-motion";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function ExportEngine({
  floorPlanRef,
  formData,
  prediction,
  eco,
  vastu,
  boq,
  aiAdvice,
  canExport,
  isAuthenticated,
  onRequireAuth,
  onRequireUpgrade,
}) {
  const handleExport = async () => {
    if (!isAuthenticated) {
      onRequireAuth?.();
      return;
    }
    
    if (!canExport) {
      onRequireUpgrade();
      return;
    }
    
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();

      // Premium Dark Theme Header
      pdf.setFillColor(15, 23, 42); // slate-900
      pdf.rect(0, 0, pageWidth, 40, "F");
      
      // Decorative Gold Accent
      pdf.setFillColor(251, 191, 36); // fbbf24 (Gold)
      pdf.rect(0, 0, pageWidth, 2, "F");

      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(22);
      pdf.setFont("helvetica", "bold");
      pdf.text("PROVERSE MASTER BLUEPRINT", 14, 18);
      
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(148, 163, 184); // slate-400
      pdf.text(`ISSUED ON: ${new Date().toLocaleDateString()} | LICENSE: PRO-ACCESS`, 14, 25);
      
      pdf.setTextColor(251, 191, 36);
      pdf.text(`SPECIFICATIONS: ${formData.bhk} BHK | ${formData.floors} FLOORS | ${formData.city}`, 14, 30);

      // Floor Plan Section
      if (floorPlanRef?.current) {
        const canvas = await html2canvas(floorPlanRef.current, {
          backgroundColor: "#0f172a",
          scale: 2,
          useCORS: true,
        });
        const image = canvas.toDataURL("image/png");
        pdf.setFillColor(30, 41, 59); // slate-800
        pdf.rect(12, 45, pageWidth - 24, 80, "F");
        pdf.addImage(image, "PNG", 14, 47, 182, 76);
      }

      let y = 135;
      
      // Two-column layout for metrics
      pdf.setTextColor(251, 191, 36);
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text("STRUCTURAL METRICS", 14, y);
      
      pdf.setTextColor(15, 23, 42);
      y += 6;
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(51, 65, 85);
      
      const metrics = [
        `PLOT AREA: ${Number(formData.plot_area_sqft).toLocaleString()} SQ FT`,
        `BUILT-UP AREA: ${Number(formData.builtup_area_sqft).toLocaleString()} SQ FT`,
        `MATERIAL TIER: ${formData.material_tier.toUpperCase()}`,
        `SOIL TYPE: ${formData.soil_type.toUpperCase()}`
      ];
      
      metrics.forEach(m => {
        pdf.text(m, 14, y);
        y += 5;
      });

      // AI Advice Section - High Value
      y = 135;
      pdf.setTextColor(251, 191, 36);
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text("AI ARCHITECT INSIGHTS", 100, y);
      
      y += 6;
      pdf.setFontSize(8);
      pdf.setFont("helvetica", "italic");
      pdf.setTextColor(71, 85, 105);
      
      const adviceLines = aiAdvice 
        ? pdf.splitTextToSize(aiAdvice.replace(/[*#]/g, ''), 95)
        : ["Run AI Architect advice to populate professional structural insights here."];
      
      pdf.text(adviceLines.slice(0, 20), 100, y);

      // Costing Table
      y = 175;
      pdf.setFillColor(248, 250, 252);
      pdf.rect(12, y - 5, pageWidth - 24, 45, "F");
      
      pdf.setTextColor(15, 23, 42);
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.text("ESTIMATED BILL OF QUANTITIES (BOQ)", 14, y);
      
      y += 7;
      pdf.setFontSize(8);
      pdf.setFont("helvetica", "normal");
      boq.slice(0, 6).forEach((line) => {
        pdf.text(`${line.item}`, 14, y);
        pdf.text(`₹${Number(line.amount).toLocaleString()}`, 80, y);
        pdf.text(`${line.qtyHint}`, 130, y);
        y += 5;
      });

      // Vastu & Eco Summary
      y = 225;
      pdf.setTextColor(251, 191, 36);
      pdf.setFontSize(11);
      pdf.text("COMPLIANCE & SUSTAINABILITY", 14, y);
      
      y += 7;
      pdf.setFontSize(9);
      pdf.setTextColor(51, 65, 85);
      pdf.text(`VASTU RATING: ${vastu.score}/100 (${vastu.label})`, 14, y);
      pdf.text(`ECO SCORE: ${eco.score}/100 (${eco.label})`, 100, y);
      
      y += 10;
      pdf.setFillColor(15, 23, 42);
      pdf.rect(12, y, pageWidth - 24, 15, "F");
      
      const predictedCost = prediction 
        ? `TOTAL ESTIMATED INVESTMENT: ₹${Number(prediction.predicted_cost_inr).toLocaleString()}`
        : "COST ESTIMATION PENDING";
        
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text(predictedCost, 18, y + 10);

      pdf.save(`PROVERSE-MASTER-BLUEPRINT-${Date.now()}.pdf`);
    } catch (error) {
      console.error("[ExportEngine] PDF generation failed:", error);
    }
  };

  const buttonText = !isAuthenticated 
    ? "Sign In to Export" 
    : canExport 
      ? "Export Master Blueprint" 
      : "Upgrade Pro to Export";

  const buttonClass = !isAuthenticated 
    ? "from-slate-600 to-slate-700" 
    : canExport 
      ? "from-violet-500 via-sky-500 to-cyan-500" 
      : "from-orange-500 via-amber-500 to-yellow-500";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-slate-700/70 bg-slate-900/75 p-5 shadow-glow backdrop-blur"
    >
      <h3 className="text-lg font-semibold text-slate-100">Automated BOQ & PDF Export</h3>
      <p className="mt-2 text-sm text-slate-400">
        Export investor-ready report with floor snapshot, ML costing, Vastu report, sustainability insights.
      </p>
      <button
        type="button"
        onClick={handleExport}
        className={`mt-4 h-11 w-full rounded-xl bg-gradient-to-r ${buttonClass} text-sm font-bold text-white transition hover:brightness-110 disabled:cursor-not-allowed`}
        disabled={!isAuthenticated}
      >
        {buttonText}
      </button>
    </motion.div>
  );
}


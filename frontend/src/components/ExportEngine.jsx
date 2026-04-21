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
  canExport,
  isAuthenticated,
  onRequireAuth,
  onRequireUpgrade,
}) {
  const handleExport = async () => {
    if (!isAuthenticated) {
      onRequireAuth?.();
      console.warn("[ExportEngine] Blocked: Not authenticated");
      return;
    }
    
    if (!canExport) {
      onRequireUpgrade();
      console.warn("[ExportEngine] Blocked: Not Pro subscription");
      return;
    }
    
    console.log("[ExportEngine] Export allowed - authenticated + Pro");
    
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();

      pdf.setFillColor(9, 14, 29);
      pdf.rect(0, 0, pageWidth, 297, "F");
      pdf.setTextColor(204, 251, 241);
      pdf.setFontSize(20);
      pdf.text("PropVerse Master Blueprint", 14, 16);
      pdf.setFontSize(10);
      pdf.setTextColor(186, 230, 253);
      pdf.text(`City: ${formData.city} | Program: ${formData.bhk} BHK / ${formData.floors} floors`, 14, 23);
      pdf.text(
        `Built-up: ${Number(formData.builtup_area_sqft).toLocaleString("en-IN")} sq ft | Plot: ${Number(formData.plot_area_sqft).toLocaleString("en-IN")} sq ft`,
        14,
        29
      );

      if (floorPlanRef?.current) {
        const canvas = await html2canvas(floorPlanRef.current, {
          backgroundColor: "#020617",
          scale: 2,
        });
        const image = canvas.toDataURL("image/png");
        pdf.addImage(image, "PNG", 14, 35, 182, 72);
      }

      let y = 116;
      pdf.setTextColor(125, 211, 252);
      pdf.setFontSize(13);
      pdf.text("ML Cost Breakdown (BOQ)", 14, y);
      y += 5;
      pdf.setTextColor(226, 232, 240);
      pdf.setFontSize(10);
      boq.forEach((line) => {
        pdf.text(
          `${line.item} - ₹${Number(line.amount).toLocaleString("en-IN")} (${line.qtyHint})`,
          14,
          y
        );
        y += 5;
      });

      y += 4;
      pdf.setTextColor(125, 211, 252);
      pdf.setFontSize(13);
      pdf.text("Vastu Compliance Report", 14, y);
      y += 5;
      pdf.setFontSize(10);
      pdf.setTextColor(226, 232, 240);
      pdf.text(`Rating: ${vastu.score}/100 (${vastu.label})`, 14, y);
      y += 5;
      vastu.findings.slice(0, 3).forEach((finding) => {
        pdf.text(`- ${finding}`, 14, y);
        y += 5;
      });

      y += 3;
      pdf.setTextColor(125, 211, 252);
      pdf.setFontSize(13);
      pdf.text("Eco-Score Analysis", 14, y);
      y += 5;
      pdf.setFontSize(10);
      pdf.setTextColor(226, 232, 240);
      pdf.text(`Current Eco Score: ${eco.score}/100 (${eco.label})`, 14, y);
      y += 5;
      pdf.text(`Recommendation: ${eco.recommendation}`, 14, y);
      y += 5;
      pdf.text(
        `Potential Gain: +${eco.ecoGain} points | Cost impact: ${eco.costDeltaPercent}%`,
        14,
        y
      );
      y += 7;

      const predictedText = prediction
        ? `Predicted Construction Cost: ₹${Number(prediction.predicted_cost_inr).toLocaleString("en-IN")}`
        : "Predicted Construction Cost: Run ML estimation to attach final cost.";
      pdf.setTextColor(196, 181, 253);
      pdf.text(predictedText, 14, y);

      pdf.save(`PropVerse-Blueprint-${formData.city}-${Date.now()}.pdf`);
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
        disabled={!isAuthenticated || !canExport}
      >
        {buttonText}
      </button>
    </motion.div>
  );
}


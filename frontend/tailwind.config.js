/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          cyan: "#22d3ee",
          blue: "#3b82f6",
          violet: "#8b5cf6",
        },
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(34,211,238,0.2), 0 10px 35px -10px rgba(14,116,144,0.45)",
      },
      backgroundImage: {
        "aurora-gradient":
          "radial-gradient(circle at 10% 20%, rgba(59,130,246,.22), transparent 28%), radial-gradient(circle at 80% 0%, rgba(14,165,233,.24), transparent 34%), radial-gradient(circle at 70% 75%, rgba(139,92,246,.18), transparent 30%)",
      },
    },
  },
  plugins: [],
};

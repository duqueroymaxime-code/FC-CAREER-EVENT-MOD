/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    "bg-[#06080d]",
    "bg-[#070a10]",
    "bg-[#080d14]",
    "bg-[#0b111c]",
    "bg-[#101624]",
    "bg-white/[.05]",
    "bg-white/[.06]",
    "bg-white/[.07]",
    "bg-white/[.075]",
    "bg-white/[.08]",
    "rounded-[2rem]",
    "rounded-[2.4rem]",
    "rounded-[2.5rem]",
    "rounded-[1.4rem]",
    "rounded-[1.6rem]",
    "rounded-[1.8rem]",
    "shadow-[0_24px_80px_rgba(0,0,0,.45)]",
    "shadow-[0_40px_120px_rgba(0,0,0,.55)]",
    "shadow-[0_40px_160px_rgba(0,0,0,.75)]",
    {
      pattern:
        /(bg|text|border|ring|from|via|to)-(lime|cyan|violet|amber|red|emerald|sky|blue|orange|rose|pink|slate|zinc|green|purple|fuchsia)-(100|200|300|400|500|600|700|800|900|950)/,
    },
    {
      pattern: /(grid|flex|hidden|block|inline-flex)/,
    },
  ],
  theme: {
    extend: {
      colors: {
        career: {
          black: "#06080d",
          panel: "#0b111c",
          card: "#101624",
          lime: "#bef264",
          cyan: "#22d3ee",
        },
      },
      boxShadow: {
        career: "0 30px 120px rgba(0,0,0,.55)",
        glow: "0 0 80px rgba(190,242,100,.18)",
      },
    },
  },
  plugins: [],
};
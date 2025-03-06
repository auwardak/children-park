module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "gray-50": "#f9fafb",
        "gray-100": "#f3f4f6",
        "gray-200": "#e5e7eb",
        "gray-700": "#374151",
        "gray-800": "#1f2937",
        "gray-900": "#111827",
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};

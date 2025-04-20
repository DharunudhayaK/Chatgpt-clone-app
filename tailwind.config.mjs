/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      screens: {
        "mobile-sm": "320px",
        "mobile-md": "375px",
        "mobile-lg": "425px",
        "mobile-lg2": "550px",
        "tablet-sm2": "620px",
        "tablet-sm": "768px",
        "tablet-md": "820px",
        "tablet-lg": "1150px",
        "laptop-sm": "1280px",
        "laptop-md": "1366px",
        "laptop-lg": "1440px",
        "laptop-xl": "1536px",
        "desktop-sm": "1600px",
        "desktop-md": "1920px",
        mobile: { min: "320px", max: "425px" },
        tablet: { min: "425px", max: "1024px" },
        laptop: { min: "1024px", max: "1536px" },
      },
    },
  },
  plugins: [],
};

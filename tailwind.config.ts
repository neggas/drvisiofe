import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/templates/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        "spin-slow": "spin 7s linear infinite",
      },
      screens: {
        "3xl": "2200px",
        "2xl": "1750px",
        xl: "1399px",
        lg: "1025px",
        md: "768px",
        middle: "480px",
        sm: "320px",
      },
      letterSpacing: {
        wide: ".094rem",
      },
      colors: {
        "custom-active": "#3b82f6",
        black: "#0E2132",
        light: "#EDEDED",
        blue: "#0F2133",
        red: {
          50: "#FBDEE7",
          100: "#D34142",
          500: "#E7205E",
          600: "#E5221E",
          700: "#E3302C",
          900: "#B11917",
        },
        customBlue: "#48A7DE",
        lightgrey: "#D1D1D1",
        lightBlue: "#C2E6FF",
        base: {
          100: "#ffffff",
          200: "#f4f5f9",
          300: "#a9d3e7",
          400: "#4BA7DE",
        },
        primary: "#1B75BC",
        sky: {
          400: "#42ABE16E",
          500: "#3660A7",
          600: "#44AAE1",
          700: "#43ABE1",
          800: "#48A8DF",
          200: "#00AFC7",
          900: "#43ABE16E",
        },
        indigo: {
          500: "#45A7DE",
          600: "#004994",
          700: "#4C509E",
          950: "#335EA6",
          400: "#7BCBDF",
          800: "#3A7DC0",
        },
        gray: {
          300: "#E7E6E6",
          400: "#D1D1D1",
          500: "#8598AD",
          600: "#F0F2F5",
          700: "#757574",
        },
        slate: {
          100: "#929497",
          200: "#E8E7E7",
          300: "#CCCACA",
        },
        green: {
          50: "#C7D31E",
          100: "#68A02F",
          200: "#72AD2D",
          300: "#9DCB8C",
          400: "#49BBBC",
          500: "#61B34B",
          700: "#40AF6B",
        },
        yellow: {
          100: "#FFCE00",
          300: "#FDC424",
          500: "#EE713C",
        },
        orange: {
          500: "#E94E3D",
          600: "#E7245F",
        },
        steelBlue: {
          200: "#3661A8",
          300: "#49A7DE",
        },
        silver: {
          300: "#ffffff9f",
          400: "#CFCFCF",
          500: "#F5F5F5",
        },
        pink: {
          300: "#D594C1",
          400: "#E8386F",
          500: "#E8337D",
          600: "#E7376F",
          700: "#D493C0",
        },
        coolBlue: {
          400: "#8AC057",
          500: "#49B9B1",
          600: "#4C519F",
        },
        purple: {
          200: "#A1BDE4",
          500: "#824493",
        },

        "blue-gradient": "linear-gradient(to left, sky-500, indigo-500)",
        "primary-gradient": "linear-gradient(90deg, #315EA7 0%, #40ABE1 100%)",
      },
      boxShadow: {
        lg: "rgb(0 0 0 / 72%) -1px 3px 8px 0",
        cardShadow: "0px 7px 9px 3px",
        botShadow: "16px 16px 10px 3px",
      },
      fontSize: {
        "2xs": "0.65rem",
        "3xs": "0.5rem",
        "4xs": "0.375rem",
      },
      rotate: {
        "270": "270deg",
      },
      dropShadow: {
        md: "2px 2px 2px #757574",
      },
    },
  },
  plugins: [],
};
export default config;

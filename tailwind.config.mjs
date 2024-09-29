import { nextui } from "@nextui-org/react";
import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      noSidebar: "1223px",
      ...defaultTheme.screens,
    },

    extend: {
      fontFamily : {
        mono : ['giest-mono' , ...defaultTheme.fontFamily.mono],
      }
    },
  },
  darkMode: "class",
  plugins: [nextui() , require('@tailwindcss/typography'),],
};

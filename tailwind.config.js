/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#14b8a6',         // Um verde-azulado moderno para ações principais
        'background': '#111827',     // Fundo escuro
        'card': '#1f2937',             // Cor dos cartões, um pouco mais clara que o fundo
        'text-primary': '#f9fafb',   // Cor de texto principal (claro)
        'text-secondary': '#9ca3af', // Cor de texto secundário (cinza claro)
      }
    },
  },
  plugins: [],
}
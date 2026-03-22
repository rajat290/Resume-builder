/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#10233d",
        accent: "#c66b3d",
        paper: "#fffdf8",
        mist: "#eef3f7"
      },
      boxShadow: {
        panel: "0 18px 40px rgba(16, 35, 61, 0.08)"
      },
      fontFamily: {
        display: ["Georgia", "serif"],
        body: ["'Segoe UI'", "sans-serif"]
      }
    }
  },
  plugins: []
};

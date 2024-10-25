/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  plugins: [
    require("daisyui"),
  ],
  daisyui: {
    themes: ["light", "dark",
      {
        dracula: {
          ...require("daisyui/src/theming/themes")["dracula"],
          primary: "#c72323",
          secondary: "#225ad5",
          accent: "yellow",
        }
      }
    ]
  }

};

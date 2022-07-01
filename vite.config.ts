import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import semi from "vite-plugin-semi-theme";
const path = require("path")
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), semi({
    theme: "@semi-bot/semi-theme-pedis",
    // options: {
    // ... 👆
    //},
  }),],
  resolve: {
    alias: [
      {
        // this is required for the SCSS modules
        find: /^~(.*)$/,
        replacement: '$1',
      },
      { find: '@', replacement: path.resolve(__dirname, '/src') }
    ],
  },
})

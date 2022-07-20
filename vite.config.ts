import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import semi from "vite-plugin-semi-theme";
import monacoEditorPlugin from 'vite-plugin-monaco-editor';

// @ts-ignore
const path = require("path")
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [monacoEditorPlugin({}), react(), semi({
    theme: "@semi-bot/semi-theme-pedis",
    // options: {
    // ... 👆
    //},
  })],
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
  base: './'
})

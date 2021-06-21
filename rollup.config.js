const commonjs = require("@rollup/plugin-commonjs");
const typescript = require("@rollup/plugin-typescript");
const { nodeResolve } = require("@rollup/plugin-node-resolve");
const html = require("@rollup/plugin-html");

module.exports = {
  input: "./src/entry.ts",
  output: {
    file: "./dist/bundle.js",
    format: "iife",
    name: "_detector",
    sourcemap: true,
  },
  watch: {
    buildDelay: 1000,
    include: "src/**",
  },
  plugins: [nodeResolve(), commonjs(), typescript(), html()],
};

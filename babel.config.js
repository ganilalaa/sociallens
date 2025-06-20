module.exports = {
  presets: [
    "@babel/preset-env",
    ["@babel/preset-react", { runtime: "automatic" }], // automatic JSX transform for React 19
  ],
  plugins: ["@babel/plugin-syntax-import-attributes"],
};

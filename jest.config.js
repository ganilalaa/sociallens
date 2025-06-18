module.exports = {
  testEnvironment: "jsdom", // simulate a browser DOM
  injectGlobals: true,
  collectCoverage: true, // optional: coverage reports
  collectCoverageFrom: ["src/**/*.{js,jsx}"], // optional: which files
  coverageDirectory: "coverage", // optional: output folder
  moduleFileExtensions: ["js", "jsx", "json", "node"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest", // compile your JS/JSX with Babel
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  setupFiles: ["<rootDir>/jest.polyfills.js"],
  transformIgnorePatterns: ["/node_modules/(?!jose|next-auth)/"],
  testMatch: ["<rootDir>/src/**/*.test.[jt]s?(x)"],
  testEnvironmentOptions: {
    customExportConditions: ["node", "node-addons"],
  },
};

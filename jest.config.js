/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */
const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

module.exports = createJestConfig({
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageThreshold: {
    // './components/**/*.{js,jsx,ts,tsx}': {
    //   branches: 30,
    //   functions: 30,
    //   lines: 30,
    //   statements: 30,
    // },
    // Uncomment if there are already files in this folder
    // './libs/**/*.{js,jsx,ts,tsx}': {
    //   branches: 100,
    //   functions: 100,
    //   lines: 100,
    //   statements: 100,
    // },
    // Uncomment if there are already files in this folder
    // './utils/**/*.{js,jsx,ts,tsx}': {
    //   branches: 100,
    //   functions: 100,
    //   lines: 100,
    //   statements: 100,
    // },
  },
  collectCoverageFrom: [
    "./assets/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./libraries/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./redux/**/*.{js,jsx,ts,tsx}",
    "./types/**/*.{js,jsx,ts,tsx}",
    "./utils/**/*.{js,jsx,ts,tsx}",
    // '!**/*.d.ts',
    // '!**/node_modules/**',
    // '!**/.next/**',
    // '!**/pages/**',
    // '!**/coverage/**',
    // '!**/.babelrc',
    // '!**/.eslintignore',
    // '!**/.eslintrc.json',
    // '!**/.gitignore',
    // '!**/.prettierrc.json',
    // '!**/.stylelintignore',
    // '!**/.stylelintrc.json',
    // '!**/jest.config.js',
    // '!**/jest.setup.js',
    // '!**/lint-staged.config.js',
    // '!**/next.config.js',
    // '!**/package-lock.json',
    // '!**/package.json',
    // '!**/README.md',
    // '!**/tsconfig.json',
    // '!**/tsconfig.tsbuildinfo',
  ],
  moduleNameMapper: {
    /* Handle CSS imports (with CSS modules)
    https://jestjs.io/docs/webpack#mocking-css-modules */
    "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy",

    // Handle CSS imports (without CSS modules)
    "^.+\\.(css|sass|scss)$": "<rootDir>/__mocks__/styleMock.js",

    /* Handle image imports
    https://jestjs.io/docs/webpack#handling-static-assets */
    "^.+\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/__mocks__/fileMock.js",

    "@sera-assets/(.*)": "<rootDir>/assets/$1",
    "@sera-components/(.*)": "<rootDir>/components/$1",
    "@sera-features/(.*)": "<rootDir>/features/$1",
    "@sera-libraries/(.*)": "<rootDir>/libraries/$1",
    "@sera-redux": "<rootDir>/redux",
    "@sera-redux/(.*)": "<rootDir>/redux/$1",
    "@sera-types/(.*)": "<rootDir>/types/$1",
    "@sera-utils/(.*)": "<rootDir>/utils/$1",
  },
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/.next/"],
  testEnvironment: "jsdom",
  transform: {
    /* Use babel-jest to transpile tests with the next/babel preset
    https://jestjs.io/docs/configuration#transform-objectstring-pathtotransformer--pathtotransformer-object */
    "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { presets: ["next/babel"] }],
  },
  transformIgnorePatterns: [
    "/node_modules/",
    "^.+\\.module\\.(css|sass|scss)$",
  ],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
});

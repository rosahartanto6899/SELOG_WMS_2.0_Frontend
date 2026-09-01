/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",

  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
    project: ["./tsconfig.json"],
  },

  env: {
    browser: true,
    node: true,
    jest: true,
  },

  extends: [
    "next/core-web-vitals",
    "plugin:@next/next/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:jest/recommended",
    "plugin:prettier/recommended",
  ],

  plugins: [
    "@typescript-eslint",
    "react",
    "jsx-a11y",
    "jest",
    "simple-import-sort",
  ],

  rules: {
    /* =========================
     * IMPORT SORT (SOURCE OF TRUTH)
     * ========================= */
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",

    /* =========================
     * TYPESCRIPT
     * ========================= */
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-use-before-define": "error",

    /* =========================
     * REACT / NEXT
     * ========================= */
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "react/require-default-props": "off",
    "react/jsx-props-no-spreading": "off",
    "react/function-component-definition": "off",

    /* =========================
     * A11Y
     * ========================= */
    "jsx-a11y/no-static-element-interactions": "warn",
    "jsx-a11y/anchor-is-valid": [
      "error",
      {
        components: ["Link"],
        specialLink: ["hrefLeft", "hrefRight"],
        aspects: ["invalidHref", "preferButton"],
      },
    ],

    /* =========================
     * GENERAL
     * ========================= */
    "no-use-before-define": "off",
    "no-shadow": "off",
    "no-plusplus": "off",
    "no-underscore-dangle": "off",
    "no-nested-ternary": "off",
    "linebreak-style": "off",

    /* =========================
     * PRETTIER
     * ========================= */
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
      },
    ],
  },

  settings: {
    react: {
      version: "detect",
    },
  },

  overrides: [
    {
      files: ["*.js", "*.jsx"],
      parserOptions: {
        project: null,
      },
    },
    {
      files: ["**/*.slice.ts"],
      rules: {
        "no-param-reassign": ["error", { props: false }],
      },
    },
  ],
};

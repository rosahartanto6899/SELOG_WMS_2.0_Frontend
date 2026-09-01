module.exports = {
  extends: [
    "stylelint-config-standard-scss", // Aturan standar linting CSS
    "stylelint-config-recommended-scss", // Aturan untuk SCSS
    "stylelint-config-prettier-scss", // Hindari konflik dengan Prettier
  ],
  formatter: "stylelint-checkstyle-formatter",
  plugins: [
    "stylelint-order", // Plugin untuk mengatur properti CSS
    "stylelint-scss",
  ],
  rules: {
    // 'indentation': 2, // Aturan indentasi 2 spasi
    // 'string-quotes': 'single', // Menggunakan tanda kutip tunggal
    // 'color-hex-case': 'lower', // Menggunakan huruf kecil untuk hex
    "order/properties-alphabetical-order": true, // Mengurutkan properti CSS secara alfabetis
    "scss/at-rule-no-unknown": true, // Aktifkan untuk SCSS
    "font-family-no-missing-generic-family-keyword": null,
    "no-descending-specificity": null,
    "selector-pseudo-class-no-unknown": null,
    "custom-media-pattern": [
      "^([a-z][a-z0-9]*)((-|--|_)[a-z0-9]+)*$",
      {
        message: "Expected custom media query name to be kebab-case",
      },
    ],
    "custom-property-pattern": [
      "^([a-z][a-z0-9]*)((-|--|_)[a-z0-9]+)*$",
      {
        message: "Expected custom property name to be kebab-case",
      },
    ],
    "keyframes-name-pattern": [
      "^([a-z][a-z0-9]*)((-|--|_)[a-z0-9]+)*$",
      {
        message: "Expected keyframe name to be kebab-case",
      },
    ],
    "selector-class-pattern": [
      "^([a-z][a-z0-9]*)((-|--|_)[a-z0-9]+)*$",
      {
        message: "Expected class selector to be kebab-case",
      },
    ],
    "selector-id-pattern": [
      "^([a-z][a-z0-9]*)((-|--|_)[a-z0-9]+)*$",
      {
        message: "Expected id selector to be kebab-case",
      },
    ],
    "no-duplicate-selectors": null,
  },
};

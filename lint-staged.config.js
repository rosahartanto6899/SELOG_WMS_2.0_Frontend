module.exports = {
  // Type check TypeScript files
  "**/*.(ts|tsx)": () => "npx tsc --noEmit",

  // Lint then format TypeScript and JavaScript files
  "**/*.(ts|tsx|js|jsx)": (filenames) => [
    `npx eslint --fix --quiet ${filenames.join(" ")}`,
    `npx prettier --write ${filenames.join(" ")}`,
  ],

  // Run test for TypeScript and JavaScript files
  // Only changed files
  // '(components|libs|utils)/**/*.(ts|tsx|js|jsx)': (filenames) => [
  //   `npm run test:staged ${filenames.join(' ')}`,
  // ],
  // All of coverage
  // '(components|libs|utils)/**/*.(ts|tsx|js|jsx)': () => [`npm run test`],

  // Lint then format SCSS and CSS files
  "**/*.(scss|css)": (filenames) => [
    `npx stylelint --fix --formatter=string ${filenames.join(" ")}`,
    `npx prettier --write ${filenames.join(" ")}`,
  ],

  // Format MarkDown and JSON
  "**/*.(md|json)": (filenames) =>
    `npx prettier --write ${filenames.join(" ")}`,
};

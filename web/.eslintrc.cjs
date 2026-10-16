module.exports = {
  root: true,
  env: { browser: true, es2022: true, node: true },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
  ],
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  settings: { react: { version: "detect" } },
  globals: { vi: "readonly", describe: "readonly", test: "readonly", expect: "readonly", beforeEach: "readonly" },
  rules: {
    "react/prop-types": "off",
    // The exhaustive-deps rule is what would have caught the render loops in
    // Follow.js and FollowingCheck.js, so it is an error here, not a warning.
    "react-hooks/exhaustive-deps": "error",
  },
};

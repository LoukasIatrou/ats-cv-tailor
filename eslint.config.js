const js = require("@eslint/js");

module.exports = [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "commonjs",
      globals: {
        require: "readonly",
        module: "readonly",
        process: "readonly",
        console: "readonly",
        __dirname: "readonly",
        fetch: "readonly",
      },
    },
  },
  {
    ignores: ["node_modules/", "examples/.build/", "docs/assets/"],
  },
];

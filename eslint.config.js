// eslint.config.js
module.exports = [
  {
    files: ["*.ts", "*.js"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module"
    },
    rules: {
      semi: ["error", "always"],
      quotes: ["error", "double"],
    }
  }
];
module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: ["standard-with-typescript", "plugin:prettier/recommended"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: "./tsconfig.json",
  },
  rules: {
    "no-console": "off",
    "unused-vars": "off",
  },
  ignorePatterns: ["node_modules/", "dist/", "views/", ".eslintrc.js"],
};

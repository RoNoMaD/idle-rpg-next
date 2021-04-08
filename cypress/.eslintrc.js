module.export = {
  rooot: true,
  plugins: ["eslint-plugin-cypress"],
  extends: ["plugin:cypress/recommended"],
  env: {
    "cypress/global": true,
  },
  rules: {
    "jest/expect-expect": 0,
  },
};

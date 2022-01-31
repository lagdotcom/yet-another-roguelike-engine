/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
// eslint-disable-next-line no-undef
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transformIgnorePatterns: ["node_modules/(?!(@lagdotcom)/)"],
  moduleNameMapper: {
    "\\.(css|jpg|png)$": "<rootDir>/stub.js",
  },
};

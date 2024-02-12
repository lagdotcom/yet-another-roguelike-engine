/** @type {import('ts-jest/dist/types').JestConfigWithTsJest} */
// eslint-disable-next-line no-undef
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transformIgnorePatterns: ["node_modules/(?!(@lagdotcom)/)"],
  moduleNameMapper: {
    "\\.(css|jpg|png)$": "<rootDir>/stub.js",
  },
};

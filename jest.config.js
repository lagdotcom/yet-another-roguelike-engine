/*eslint-env node*/

/** @type {import('ts-jest/dist/types').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "\\.(css|jpg|png)$": "<rootDir>/stub.js",
  },
};

/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
  testMatch: ['<rootDir>/tests/**/*.test.ts'], // Look for test files in the "tests" folder
  collectCoverageFrom: [
    'src/**/*.{ts,js}', // Include source files for coverage if needed
    '!**/node_modules/**',
    '!**/dist/**',
  ],
};
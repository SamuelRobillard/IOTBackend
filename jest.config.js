const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  collectCoverage: true,
  coverageDirectory: 'coverage',

  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/index.ts',
    '!src/**/main.ts',
    '!src/**/server.ts',
    '!src/**/*.d.ts',
    '!src/data/**',
    '!src/swagger/**',
    '!src/config/**',
    '!src/winston/**',
    '!src/routes/**',
    '!src/controllers/**',
    '!src/utils/**',
    '!src/Regex/**',
    '!src/middleswares/v3/**',
    '!src/models/**',


  ],

  coverageReporters: ['text', 'lcov', 'html'],
};
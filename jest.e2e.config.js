export default {
  testEnvironment: 'node',
  testMatch: ['<rootDir>/e2e/**/*.e2e.test.js'],
  testTimeout: 60000,
  verbose: true,
  maxWorkers: 1, // Ejecutar tests secuencialmente
};

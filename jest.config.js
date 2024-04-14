const path = require('path');

module.exports = {
  testMatch: [`${path.resolve(__dirname, '..')}/blog/tests/**/*.js`],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  moduleNameMapper: {
    '^public/(.*)$': `${path.resolve(__dirname, '..')}/public/$1`,
  },
};

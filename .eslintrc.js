module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'google',
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/explicit-function-return-type': ['error'],
    'require-jsdoc': ['off'],
    'max-len': ['error', { code: 120, tabWidth: 2 }],
    'object-curly-spacing': ['error', 'always', { arraysInObjects: false }],
    'no-console': ['error'],
    'arrow-parens': ['off'],
    indent: ['off'],
    'comma-dangle': ['off'],
  },
  ignorePatterns: ['webpack.config.js', '.eslintrc.js'],
};

module.exports = {
  parser: 'babel-eslint',
  plugins: ['prettier', 'jest'],
  rules: {
    'prettier/prettier': 'error',
    'no-undef': 2,
  },
  env: {
    es6: true,
    node: true,
    'jest/globals': true,
  },
  parserOptions: {
    ecmaVersion: 7,
    sourceType: 'module',
    ecmaVersion: 2018,
  },
};

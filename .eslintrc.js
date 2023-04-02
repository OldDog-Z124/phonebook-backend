module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: 'airbnb-base',
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    semi: ['warn', 'never'],
    'no-console': 'off',
    'no-param-reassign': ['error', { props: false }],
    'no-underscore-dangle': 0,
  },
};

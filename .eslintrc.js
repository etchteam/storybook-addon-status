module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'airbnb-typescript',
  ],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    "import/no-extraneous-dependencies": ["error", {
      "devDependencies": true
    }]
  }
};

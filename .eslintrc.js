module.exports = {
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": ["plugin:react/recommended", "plugin:storybook/recommended"],
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": 12,
    "sourceType": "module"
  },
  "plugins": ["react"],
  "rules": {
    "react/display-name": 0
  }
};

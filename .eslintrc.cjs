module.exports = {
  extends: ['@etchteam'],
  rules: {
    '@next/next/no-html-link-for-pages': 0,
    // Storybook/tsup uses the import React...
    'import/default': 0,
  },
};

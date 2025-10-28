import { defineConfig } from 'tsup';

export default defineConfig(async () => {
  const commonConfig = {
    splitting: true,
    format: ['esm'],
    treeshake: true,
    // keep this line commented until https://github.com/egoist/tsup/issues/1270 is resolved
    // clean: options.watch ? false : true,
    clean: false,
    // The following packages are provided by Storybook and should always be externalized
    // Meaning they shouldn't be bundled with the addon, and they shouldn't be regular dependencies either
    external: ['react', 'react-dom', '@storybook/icons'],
  };

  const configs = [
    // manager entries are entries meant to be loaded into the manager UI
    // they'll have manager-specific packages externalized and they won't be usable in node
    // they won't have types generated for them as they're usually loaded automatically by Storybook
    {
      ...commonConfig,
      entry: ['src/manager.jsx'],
      platform: 'browser',
      target: 'esnext', // we can use esnext for manager entries since Storybook will bundle the addon's manager entries again anyway
    },
  ];

  return configs;
});

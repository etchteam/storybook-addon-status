import { globalPackages as globalManagerPackages } from 'storybook/internal/manager/globals';
import { defineConfig } from 'tsup';

// The current browsers supported by Storybook v7
const BROWSER_TARGET = ['chrome100', 'safari15', 'firefox91'];

export default defineConfig(async (options) => {
  const commonConfig = {
    splitting: false,
    minify: !options.watch,
    treeshake: true,
    sourcemap: true,
    clean: true,
  };

  const configs = [
    {
      ...commonConfig,
      entry: ['src/manager.jsx'],
      format: ['esm'],
      target: BROWSER_TARGET,
      platform: 'browser',
      external: globalManagerPackages,
    },
  ];

  return configs;
});

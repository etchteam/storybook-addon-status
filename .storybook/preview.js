/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    status: {
      statuses: {
        customStatus: {
          background: '#0000ff',
          color: '#ffffff',
          description: 'This component is stable and released',
        },
      },
    },
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;

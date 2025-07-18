import { addons } from "storybook/manager-api";

addons.setConfig({
  status: {
    statuses: {
      customStatus: {
        background: '#0000ff',
        color: '#ffffff',
        description: 'This component is stable and released',
      },
    },
    sidebarDots: 'multiple', // 'single' | 'multiple' | 'none'. 'single' is the default
  },
});

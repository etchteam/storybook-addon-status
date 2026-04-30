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
    // 'single' | 'multiple' | 'none'. When set, takes precedence over sidebarDots.
    sidebarTags: 'multiple',
    sidebarDots: 'multiple', // 'single' | 'multiple' | 'none'. 'single' is the default
  },
});

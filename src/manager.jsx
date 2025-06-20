import startCase from 'lodash/startCase';
import React from 'react';
import { addons, types } from 'storybook/manager-api';

import StatusDot from './components/StatusDot';
import StatusTag from './components/StatusTag';
import { ADDON_ID } from './constants';
import { getStatusConfigs } from './getStatusConfigs';

addons.register(ADDON_ID, (api) => {
  addons.add(ADDON_ID, {
    title: 'Status',
    type: types.TOOL,
    render: () => <StatusTag />,
  });

  const statusAddonConfig = addons.getConfig()?.[ADDON_ID] || {};

  addons.setConfig({
    sidebar: {
      renderLabel: (item) => {
        const { name, tags } = item;
        const isLeaf = ['root', 'group', 'story'].includes(item.type);

        try {
          const sidebarDotsConfig = statusAddonConfig?.sidebarDots;
          if (sidebarDotsConfig === 'none') {
            return name;
          }

          const parameters = api.getParameters(item.id, ADDON_ID);

          // item can be a Root | Group | Story
          if (!isLeaf || (tags.length === 0 && !parameters?.type)) {
            return name;
          }

          // Get custom status configurations from the current story's parameters.
          // This will include any custom statuses defined in preview.js or story parameters.
          // However custom statuses from story parameters will only be available in the sidebar
          // when viewing that story. This is a storybook limitation:
          // https://github.com/storybookjs/storybook/discussions/24022
          const customConfigs =
            statusAddonConfig?.statuses ||
            api.getCurrentStoryData().parameters?.status?.statuses;

          let statusConfigs = getStatusConfigs({
            tags,
            parameters,
            customConfigs,
          });

          if (statusConfigs.length === 0) {
            return name;
          }

          if (sidebarDotsConfig !== 'multiple') {
            statusConfigs = [statusConfigs[0]];
          }

          return (
            <>
              {name}
              {statusConfigs.map((statusConfig) => {
                const {
                  label: statusName,
                  status: { background, description },
                } = statusConfig;

                return (
                  <StatusDot
                    key={statusName}
                    type={statusName}
                    background={background}
                    title={`${startCase(statusName)}: ${description}`}
                  />
                );
              })}
            </>
          );
        } catch (error) {
          return name;
        }
      },
    },
  });
});

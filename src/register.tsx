import React from 'react';
import { addons, types } from '@storybook/addons';

import Status from './components/StatusTag';
import StatusDot from './components/StatusDot';
import { ADDON_ID } from './constants';

import type { AddonParameters } from './types';
import { defaultStatuses } from './defaults';

type RenderLabelItem = {
  name: string;
  isLeaf: boolean;
  parameters: {
    status?: AddonParameters;
  };
};

addons.register(ADDON_ID, () => {
  addons.add(ADDON_ID, {
    title: 'Status',
    type: types.TOOL,
    match: ({ viewMode }) => viewMode === 'story' || viewMode === 'docs',
    render: () => <Status />,
  });

  addons.setConfig({
    sidebar: {
      renderLabel: (item: RenderLabelItem) => {
        const { name, isLeaf, parameters } = item;
        // item can be a Root | Group | Story
        if (!isLeaf || !parameters || !parameters.status) {
          return name;
        }

        const { status } = parameters;

        const statusConfigMap = {
          ...defaultStatuses,
          ...(status.statuses || {}),
        };

        const statusConfig = statusConfigMap[status.type];

        if (!statusConfig) {
          return name;
        }

        const { background, description } = statusConfig;

        return (
          <>
            {name}
            <StatusDot
              background={background}
              title={`${status}: ${description}`}
            />
          </>
        );
      },
    },
  });
});

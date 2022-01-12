import { addons, types } from '@storybook/addons';
import { startCase } from 'lodash';
import React from 'react';

import StatusDot from './components/StatusDot';
import Status from './components/StatusTag';
import { ADDON_ID } from './constants';
import { defaultStatuses } from './defaults';

import type { AddonParameters } from './types';

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

        let statusName: string = '';

        if (Array.isArray(status.type)) {
          const firstStatus = status.type?.[0];
          statusName = typeof firstStatus === 'string' ? firstStatus : firstStatus.name;
        } else {
          statusName = status.type;
        }

        const statusConfig = statusConfigMap[statusName];

        if (!statusConfig) {
          return name;
        }

        const { background, description } = statusConfig;

        return (
          <>
            {name}
            <StatusDot
              type={statusName}
              background={background}
              title={`${startCase(statusName)}: ${description}`}
            />
          </>
        );
      },
    },
  });
});

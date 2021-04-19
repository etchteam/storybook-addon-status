import React from 'react';
import { addons, types } from '@storybook/addons';

import Status from './components/Status';
import StatusLabel from './components/StatusLabel';

const ADDON_ID = 'status';

addons.register(ADDON_ID, () => {
  addons.add(ADDON_ID, {
    title: 'Status',
    type: types.TOOL,
    match: ({ viewMode }: { viewMode: string }) => viewMode === 'story' || viewMode === 'docs',
    render: () => <Status />,
  });

  addons.setConfig({
    sidebar: {
      renderLabel: (item: any) => {
        const { name, isLeaf } = item;
        // item can be a Root | Group | Story
        if (!isLeaf) {
          return name;
        }

        const { parameters: { status, statuses } } = item;

        const statusObj = (statuses && statuses[status]) || {};

        return (
          <>
            {name}
            {' '}
            {!!status && (
              <StatusLabel
                status={status}
                statuses={statuses}
                title={`${status}: ${statusObj.description}`}
              />
            )}
          </>
        );
      },
    },
  });
});

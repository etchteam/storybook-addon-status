import React from 'react';
import { addons, types } from '@storybook/addons';
import { useStorybookApi } from '@storybook/api';
import { styled } from '@storybook/theming';

const ADDON_ID = 'status';

type tStatuses = {
  [key: string]: string
}

const defaultStatuses: tStatuses = {
  beta: '#ec942c',
  stable: '#339900',
  deprecated: '#f02c2c',
};

function statusBackground(status: string, statuses?: tStatuses) {
  const availableStatuses = statuses || defaultStatuses;
  return availableStatuses[status] || '#666';
}

const StatusText = styled.span`
  align-items: center;
  align-self: center;
  background: ${(props: any) => statusBackground(props.status, props.statuses)};
  border-radius: .25em;
  color: white;
  display: inline-flex;
  justify-content: center;
  line-height: 1;
  padding: .25em .5em;
  user-select: none;
`;


const Status = () => {
  const api = useStorybookApi();
  const story = api.getCurrentStoryData() as any;
  if (story) {
    const params = story.parameters;

    if (params.status) {
      return (
        <StatusText 
          status={params.status}
          statuses={params.statuses}
        >
          {params.status}
        </StatusText>
      );
    }
  }

  return null;
}

addons.register(ADDON_ID, () => {
  addons.add(ADDON_ID, {
    title: 'Status',
    type: types.TOOL,
    match: ({ viewMode }: { viewMode: string }) => viewMode === 'story' || viewMode === 'docs',
    render: () => {
      return <Status />;
    },
  });
});

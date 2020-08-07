import React from 'react';
import { addons, types } from '@storybook/addons';
import { useStorybookApi } from '@storybook/api';
import { styled } from '@storybook/theming';

const ADDON_ID = 'status';

function statusBackground(status: 'beta' | 'stable' | 'deprecated') {
  if (status === 'beta') return '#ec942c';
  if (status === 'stable') return '#339900';
  if (status === 'deprecated') return '#f02c2c';
  return '#666';
}

const StatusText = styled.span`
  align-items: center;
  align-self: center;
  background: ${(props: any) => statusBackground(props.status)};
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
        <StatusText status={params.status}>{params.status}</StatusText>
      );
    }
  }

  return null;
}

addons.register(ADDON_ID, () => {
  addons.add(ADDON_ID, {
    title: 'Status',
    type: types.TOOL,
    match: ({ viewMode }: { viewMode: string }) => viewMode === 'story',
    render: () => {
      return <Status />;
    },
  });
});

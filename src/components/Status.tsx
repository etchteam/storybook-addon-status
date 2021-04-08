import React from 'react';
import { useStorybookApi } from '@storybook/api';

import StatusText from './StatusText';

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
};

export default Status;

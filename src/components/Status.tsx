import React from 'react';
import { useStorybookApi } from '@storybook/api';

import StatusLink from './StatusLink';
import StatusText from './StatusText';

const Status = () => {
  const api = useStorybookApi();
  const story = api.getCurrentStoryData() as any;
  if (story) {
    const { status, statusLink, statuses } = story.parameters;
    const statusObj = (statuses && statuses[status]) || {};
    const Component = statusLink ? StatusLink : StatusText;

    if (status) {
      return (
        <Component
          status={status}
          statuses={statuses}
          title={statusObj.description}
          href={statusLink}
        >
          {status}
        </Component>
      );
    }
  }

  return null;
};

export default Status;

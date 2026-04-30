import React from 'react';
import { useParameter, useStorybookApi, addons } from 'storybook/manager-api';

import { ADDON_ID } from '../constants';
import { getStatusConfigs } from '../getStatusConfigs';

import StatusTagBase from './StatusTagBase';

const StatusTag = () => {
  const api = useStorybookApi();
  const tags = api.getCurrentStoryData()?.tags ?? [];

  const parameters = useParameter(ADDON_ID, null);
  const customConfigs = addons.getConfig()?.[ADDON_ID]?.statuses;

  const statusConfigs = getStatusConfigs({
    tags,
    parameters,
    customConfigs,
  });

  if (!statusConfigs?.length) {
    return null;
  }

  return (
    <>
      {statusConfigs.map((statusConfig) => (
        <StatusTagBase
          key={statusConfig.label}
          label={statusConfig.label}
          status={statusConfig.status}
          url={statusConfig.url}
          variant="toolbar"
        />
      ))}
    </>
  );
};

export default StatusTag;

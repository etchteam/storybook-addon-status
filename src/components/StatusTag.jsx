import startCase from 'lodash/startCase';
import React from 'react';
import { useParameter, useStorybookApi } from 'storybook/manager-api';
import { styled, css } from 'storybook/theming';

import { ADDON_ID } from '../constants';
import { defaultStatuses, defaultBackground, defaultColor } from '../defaults';
import { getStatusConfigs } from '../getStatusConfigs';

const tagStyles = css`
  align-self: center;
  border-radius: 0.25em;
  padding: 0 0.5em;
  text-decoration: none;
  user-select: none;
  font-size: 11px;
  text-transform: uppercase;
  line-height: 20px;
  font-weight: 700;
  padding: 0 0.5em;
`;

const LinkTag = styled.a`
  ${tagStyles}
`;

const TextTag = styled.span`
  ${tagStyles}
`;

const StatusTag = () => {
  const api = useStorybookApi();
  const tags = api.getCurrentStoryData()?.tags ?? [];

  const parameters = useParameter(ADDON_ID, null);

  const statusConfigs = getStatusConfigs({
    tags,
    parameters,
    // No need to pass customConfigs here as within a story, parameters.statuses
    // already includes the custom statuses defined in preview.js.
  });

  if (!statusConfigs?.length) {
    return null;
  }

  return (
    <>
      {statusConfigs.map((statusConfig) => {
        const { background, color, description } = statusConfig.status;
        const statusUrl = statusConfig.url;
        const label = startCase(statusConfig.label);

        const style = {
          color:
            color ??
            (defaultStatuses[label]
              ? defaultStatuses[label].color
              : defaultColor),
          backgroundColor:
            background ??
            (defaultStatuses[label]
              ? defaultStatuses[label].background
              : defaultBackground),
        };

        return statusUrl ? (
          <LinkTag
            key={statusConfig.label}
            style={style}
            title={description}
            href={statusUrl}
          >
            {label}
          </LinkTag>
        ) : (
          <TextTag key={statusConfig.label} style={style} title={description}>
            {label}
          </TextTag>
        );
      })}
    </>
  );
};

export default StatusTag;

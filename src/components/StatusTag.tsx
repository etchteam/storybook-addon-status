import React from 'react';
import { useParameter } from '@storybook/api';
import { styled, css } from '@storybook/theming';
import { startCase } from 'lodash';
import { defaultStatuses, defaultBackground, defaultColor } from '../defaults';
import { ADDON_PARAM_KEY } from '../constants';

import type { AddonParameters } from '../types';

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
  const parameters = useParameter(
    ADDON_PARAM_KEY,
    null,
  ) as AddonParameters | null;

  if (parameters === null) {
    return null;
  }

  const { type, url, statuses } = parameters;

  if (!type) {
    return null;
  }

  const statusConfigMap = {
    ...defaultStatuses,
    ...(statuses || {}),
  };

  const statusConfig = statusConfigMap[type];

  if (!statusConfig) {
    return null;
  }

  const { background, color, description } = statusConfig;

  const style: React.CSSProperties = {
    color: color ?? defaultColor,
    backgroundColor: background ?? defaultBackground,
  };

  const label = startCase(type);

  return url ? (
    <LinkTag style={style} title={description} href={url}>
      {label}
    </LinkTag>
  ) : (
    <TextTag style={style} title={description}>
      {label}
    </TextTag>
  );
};

export default StatusTag;

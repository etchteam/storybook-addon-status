import React from 'react';
import { useParameter } from '@storybook/api';
import { styled, css } from '@storybook/theming';
import { startCase } from 'lodash';
import { defaultStatuses, defaultBackground, defaultColor } from '../defaults';
import { ADDON_PARAM_KEY } from '../constants';
import { AddonParameters, CustomStatusType, StatusVersion } from '../types';

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

  const { type, url, statuses, version } = parameters;

  if (!type) {
    return null;
  }

  const statusConfigMap = {
    ...defaultStatuses,
    ...(statuses || {}),
  };

  let statusConfigs: { url?: string; label?: string, status?: CustomStatusType, version?: StatusVersion }[];

  if (Array.isArray(type)) {
    statusConfigs = type.map((t) => {
      if (typeof t === 'string') {
        return {
          label: t,
          status: statusConfigMap[t],
          url,
          version,
        };
      }

      return {
        label: t.name,
        status: statusConfigMap[t.name],
        url: t.url,
        version: t.version,
      };
    });
  } else {
    statusConfigs = [
      {
        label: type,
        status: statusConfigMap[type],
        url,
        version,
      },
    ];
  }

  statusConfigs = statusConfigs.filter((x) => x.status != null);

  if (!statusConfigs?.length) {
    return null;
  }

  return (
    <>
      {statusConfigs.map((statusConfig) => {
        const { background, color, description } = statusConfig.status;
        const statusUrl = statusConfig.url;

        const style: React.CSSProperties = {
          color: color ?? defaultColor,
          backgroundColor: background ?? defaultBackground,
        };

        const label = startCase(statusConfig.label);
        const version = statusConfig.version ? `(${statusConfig.version})` : ''

        return statusUrl ? (
          <LinkTag
            key={statusConfig.label}
            style={style}
            title={description}
            href={statusUrl}
          >
            {label} {version}
          </LinkTag>
        ) : (
          <TextTag key={statusConfig.label} style={style} title={description}>
            {label} {version}
          </TextTag>
        );
      })}
    </>
  );
};

export default StatusTag;

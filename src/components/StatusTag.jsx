import { css, styled } from '@storybook/theming';
import startCase from 'lodash/startCase';

import { defaultBackground, defaultColor, defaultStatuses } from '../defaults';

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

const StatusTag = ({ parameters }) => {
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

  let statusConfigs;

  if (Array.isArray(type)) {
    statusConfigs = type.map((t) => {
      if (typeof t === 'string') {
        return {
          label: t,
          status: statusConfigMap[t],
          url,
        };
      }

      return {
        label: t.name,
        status: statusConfigMap[t.name],
        url: t.url,
      };
    });
  } else {
    statusConfigs = [
      {
        label: type,
        status: statusConfigMap[type],
        url,
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

import startCase from 'lodash/startCase';
import React from 'react';
import { styled, css } from 'storybook/theming';

import { defaultStatuses, defaultBackground, defaultColor } from '../defaults';

const baseStyles = css`
  align-self: center;
  border-radius: 0.25em;
  font-weight: 700;
  text-decoration: none;
  text-transform: uppercase;
  user-select: none;
`;

const toolbarStyles = css`
  font-size: 11px;
  line-height: 20px;
  padding: 0 0.5em;
`;

const sidebarStyles = css`
  font-size: 10px;
  line-height: 16px;
  padding: 0 0.4em;
`;

const variantStyles = ({ variant }) =>
  variant === 'sidebar' ? sidebarStyles : toolbarStyles;

const LinkTag = styled.a`
  ${baseStyles}
  ${variantStyles}
`;

const TextTag = styled.span`
  ${baseStyles}
  ${variantStyles}
`;

const StatusTagBase = ({ label, status, url, variant = 'toolbar' }) => {
  const resolvedColor =
    status?.color ??
    (defaultStatuses[label] ? defaultStatuses[label].color : defaultColor);
  const resolvedBackground =
    status?.background ??
    (defaultStatuses[label]
      ? defaultStatuses[label].background
      : defaultBackground);

  const style = {
    color: resolvedColor,
    backgroundColor: resolvedBackground,
  };

  const description = status?.description;
  const displayLabel = startCase(label);
  const isLink = variant === 'toolbar' && !!url;

  if (isLink) {
    return (
      <LinkTag variant={variant} style={style} title={description} href={url}>
        {displayLabel}
      </LinkTag>
    );
  }

  return (
    <TextTag variant={variant} style={style} title={description}>
      {displayLabel}
    </TextTag>
  );
};

export default StatusTagBase;

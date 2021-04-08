import { styled } from '@storybook/theming';

import statusBackground from '../lib/status-background';

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

export default StatusText;

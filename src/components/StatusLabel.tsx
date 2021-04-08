import { styled } from '@storybook/theming';

import statusBackground from '../lib/status-background';

const StatusText = styled.span`
  align-items: center;
  align-self: center;
  background: ${(props: any) => statusBackground(props.status, props.statuses)};
  border-radius: 50%;
  display: inline-block;
  height: 6px;
  justify-content: center;
  line-height: 1;
  margin-left: .5em;
  user-select: none;
  width: 6px;
`;

export default StatusText;

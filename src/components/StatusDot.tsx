import { styled } from '@storybook/theming';
import { defaultStatuses, defaultBackground } from '../defaults';

type StatusDotProps = {
  type?: string
  background?: string;
};

const StatusDot = styled.span<StatusDotProps>`
  align-self: center;
  background-color: ${({ background, type }) => background ?? (defaultStatuses[type] ? defaultStatuses[type].background : defaultBackground) };
  border-radius: 100%;
  height: 6px;
  margin-left: 0.5em;
  user-select: none;
  width: 6px;
`;

export default StatusDot;

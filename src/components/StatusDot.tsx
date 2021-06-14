import { styled } from '@storybook/theming';
import { defaultBackground } from '../defaults';

type StatusDotProps = {
  background?: string;
};

const StatusDot = styled.span<StatusDotProps>`
  align-self: center;
  background-color: ${({ background }) => background ?? defaultBackground};
  border-radius: 100%;
  height: 6px;
  margin-left: 0.5em;
  user-select: none;
  width: 6px;
`;

export default StatusDot;

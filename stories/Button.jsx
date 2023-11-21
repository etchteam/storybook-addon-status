import { bool, func, oneOf, string } from 'prop-types';
import './button.css';

/**
 * Primary UI component for user interaction
 */
export const Button = ({ primary, backgroundColor, size, label, ...props }) => {
  const mode = `storybook-button--${primary ? 'primary' : 'secondary'}`;

  return (
    <button
      type="button"
      className={['storybook-button', `storybook-button--${size}`, mode].join(
        ' ',
      )}
      style={backgroundColor && { backgroundColor }}
      {...props}
    >
      {label}
    </button>
  );
};

Button.propTypes = {
  /**
   * Is this the principal call to action on the page?
   */
  primary: bool,
  /**
   * What background color to use
   */
  backgroundColor: string,
  /**
   * How large should the button be?
   */
  size: oneOf(['small', 'medium', 'large']),
  /**
   * Button contents
   */
  label: string.isRequired,
  /**
   * Optional click handler
   */
  onClick: func,
};

Button.defaultProps = {
  backgroundColor: null,
  primary: false,
  size: 'medium',
  onClick: undefined,
};

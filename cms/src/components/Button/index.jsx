import PropTypes from 'prop-types';

const Button = ({ onClick, children, className,type }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-full p-2 rounded transition-colors duration-300 font-medium ${className}`}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

Button.defaultProps = {
  onClick: () => {},
  className: '',
  type: 'button',
};

export default Button;
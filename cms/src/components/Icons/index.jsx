const IconWrapper = ({ children,className }) => {
  return (
    <span className={`flex items-center justify-center bg-green-100 rounded-full w-14 h-14 ${className}`}>
      {children}
    </span>
  );
};

export default IconWrapper;

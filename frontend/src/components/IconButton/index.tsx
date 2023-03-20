type IconButtonProps = {
  children?: React.ReactNode;
  onClick?: () => void;
};

const IconButton: React.FC<IconButtonProps> = (props) => {
  const { children, onClick } = props;
  return <button onClick={onClick}>{children}</button>;
};

export default IconButton;

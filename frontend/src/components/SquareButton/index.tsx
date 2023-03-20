type SquareButtonProps = {
  children: React.ReactNode;
  onClick: () => void;
  tailwind: string;
};

const SquareButton: React.FC<SquareButtonProps> = (props) => {
  const { children, onClick, tailwind } = props;

  return (
    <button onClick={onClick} className={tailwind}>
      {children}
    </button>
  );
};

export default SquareButton;

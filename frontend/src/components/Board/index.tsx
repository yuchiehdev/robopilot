type BoardProps = {
  title?: string;
  width: string;
  className?: string;
  children?: React.ReactNode;
  minWidth?: string;
};

const Board: React.FC<BoardProps> = (props) => {
  const { children, title, width, className, minWidth } = props;

  return (
    <section
      className={`relative rounded-lg bg-white p-4 shadow-md dark:bg-black-100 ${minWidth} ${width} ${className}`}
    >
      {title && (
        <h1 className="mb-1 pl-4 text-lg font-semibold tracking-wider text-blue-dark dark:text-white">
          {title}
        </h1>
      )}
      {children}
    </section>
  );
};

export default Board;

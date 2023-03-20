type BulbProps = {
  color: string;
  width: string;
  height: string;
  position?: string;
  index: number;
};

const Bulb: React.FC<BulbProps> = (props) => {
  const { color, width, height, position, index } = props;
  return (
    <div className={`${color} ${width} ${height} ${position} rounded-full`}>
      <span className="flex justify-center text-lg font-extrabold ">{index}</span>
    </div>
  );
};

export default Bulb;

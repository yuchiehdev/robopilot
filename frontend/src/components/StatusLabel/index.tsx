type StatusLabelProps = {
  status: string;
  label: string;
  width?: string;
  height?: string;
  font?: string;
  color?: string;
  position?: string;
};

const StatusLabel: React.FC<StatusLabelProps> = (props) => {
  const { status, width, height, font, color, position, label } = props;
  return (
    <h1
      className={`${label} ${width} ${height} ${font} ${color} ${position} flex items-center justify-center rounded-full px-1 tracking-wide`}
    >
      {status}
    </h1>
  );
};

export default StatusLabel;

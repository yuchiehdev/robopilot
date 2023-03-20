import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

type CircularProgressbarProps = {
  text: string;
  value: number;
};

const CircularProgressbar: React.FC<CircularProgressbarProps> = (props) => {
  const { text, value } = props;

  return (
    <section className="relative flex h-16 w-16 flex-col items-center justify-center">
      <CircularProgressbarWithChildren
        value={value}
        text={`${value}%`}
        background
        backgroundPadding={5}
        styles={buildStyles({
          rotation: 1 / 2,
          pathColor: 'rgb(0,108,146)',
          textColor: 'rgb(0,108,146)',
          backgroundColor: 'rgb(255,255,255)',
          trailColor: 'rgb(255,255,255)',
          pathTransitionDuration: 0.15,
        })}
      />
      <div className="absolute bottom-[-2.2rem] text-lg text-white">
        <strong>{text}</strong>
      </div>
    </section>
  );
};

export default CircularProgressbar;

import React from 'react';
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

type CircularProgressbarProps = {
  text?: string;
  value: number;
};

const getProgressBarColor = (status: number) => {
  let color;
  if (status >= 0 && status <= 40) {
    color = '#B0DD82';
  } else if (status > 30 && status <= 80) {
    color = 'rgb(255,190,11)';
  } else if (status > 80 && status <= 100) {
    color = '#DD5F7F';
  } else {
    color = '#808080';
  }
  return color;
};

const CircularProgressbar: React.FC<CircularProgressbarProps> = (props) => {
  const { text, value } = props;
  const pathColor = getProgressBarColor(value);

  return (
    <section className="relative flex h-16 w-16 flex-col items-center justify-center">
      <CircularProgressbarWithChildren
        value={value}
        text={`${value}%`}
        background
        backgroundPadding={5}
        styles={buildStyles({
          rotation: 1 / 2,
          pathColor,
          textColor: '#162848',
          backgroundColor: 'rgb(255,255,255)',
          trailColor: 'rgb(220,220,220)',
          pathTransitionDuration: 0.15,
        })}
      />
      {text && (
        <div className="absolute bottom-[-2.2rem] text-lg text-white">
          <strong>{text}</strong>
        </div>
      )}
    </section>
  );
};

export default React.memo(CircularProgressbar);

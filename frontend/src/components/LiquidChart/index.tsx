import { useState, useRef, useEffect } from 'react';
import { color } from 'd3-color';
import LiquidFillGauge from 'react-liquid-gauge';

interface GradientStop {
  key: string;
  stopColor: string;
  stopOpacity: number;
  offset: string;
}

const LiquidChart = ({
  chartWidth,
  chartHeight,
  data,
}: {
  chartWidth: string;
  chartHeight: string;
  data: number;
}) => {
  const [value, setValue] = useState<number>(50);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const gaugeRef = useRef<any>(null);

  useEffect(() => {
    setValue(data);
  }, [data]);

  useEffect(() => {
    const parentWidth = gaugeRef.current?.clientWidth || 0;
    const parentHeight = gaugeRef.current?.clientHeight || 0;
    setWidth(parentWidth);
    setHeight(parentHeight);
  }, []);

  const fillColor = 'rgb(0,108,146)';
  const gradientStops: GradientStop[] = [
    {
      key: '0%',
      stopColor: color(fillColor)?.darker(0.5).toString() || '',
      stopOpacity: 1,
      offset: '0%',
    },
    {
      key: '50%',
      stopColor: fillColor,
      stopOpacity: 0.75,
      offset: '50%',
    },
    {
      key: '100%',
      stopColor: color(fillColor)?.brighter(0.5).toString() || '',
      stopOpacity: 0.5,
      offset: '100%',
    },
  ];

  return (
    <div
      className="flex items-center justify-center"
      ref={gaugeRef}
      style={{ height: chartHeight, width: chartWidth }}
    >
      {width && height && (
        <LiquidFillGauge
          style={{ margin: '0 auto' }}
          width={width}
          height={height}
          value={value}
          percent="%"
          textSize={1}
          textOffsetX={0}
          textOffsetY={0}
          // eslint-disable-next-line react/no-unstable-nested-components
          textRenderer={(props: {
            value: number;
            percent: string;
            textSize: number;
            height: number;
            width: number;
          }) => {
            const roundedValue = Math.round(props.value);
            const minRadius = Math.min(props.height / 2, props.width / 2);
            const textPixels = (props.textSize * minRadius) / 2;
            const valueStyle = {
              fontSize: textPixels,
            };
            const percentStyle = {
              fontSize: textPixels * 0.6,
            };
            return (
              <tspan>
                <tspan className="value" style={valueStyle}>
                  {roundedValue}
                </tspan>
                <tspan style={percentStyle}>{props.percent}</tspan>
              </tspan>
            );
          }}
          riseAnimation
          waveAnimation
          waveFrequency={2}
          waveAmplitude={1}
          gradient
          gradientStops={gradientStops}
          circleStyle={{
            fill: fillColor,
          }}
          waveStyle={{
            fill: fillColor,
          }}
          textStyle={{
            fill: color('#444')?.toString(),
            fontFamily: 'Arial',
          }}
          waveTextStyle={{
            fill: color('#fff')?.toString(),
            fontFamily: 'Arial',
          }}
        />
      )}
    </div>
  );
};

export default LiquidChart;

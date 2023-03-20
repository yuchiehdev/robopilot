import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  LineController,
  ScatterController,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import deviation from '../../utils/standardDeviation';

ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  LineController,
  ScatterController,
);

const BellCurveChart = () => {
  const dataMock = [
    31.1, 36.4, 20.18, 21.65, 45, 25.93, 24.8, 38.13, 21.67, 45.14, 26.8, 26.21, 34.87,
    34.95, 22.52, 28.4, 42.79, 45.11, 31.53, 43.05, 22.2, 33.14, 45.31, 21.76, 45, 38.26,
    28.44, 34.35, 46.27, 34.62, 31.64, 44.31, 35.34, 41.45, 43.83, 30.61, 43.7, 35.31,
    40.07, 39.48, 44.79, 32.61, 36.74, 20.13, 33.22, 45.68, 44.88, 22.19, 20.68, 41.59,
    40.13, 35.91, 40.41, 29.73, 34.31, 25.25, 22.69, 34.94, 46.04, 21.37, 29.56, 28.45,
    43.43, 25.85, 44.31, 46.87, 23.88, 20.2, 29.97, 43.69, 30.04, 29.49, 20.66, 40.95,
    20.82, 32.05, 30.3, 20.27, 48.14, 25.89, 29.07, 28.78, 26.65, 42.02, 36.45, 44.29,
    23.76, 26.67, 39.94, 37.81, 21.59, 41.66, 48.03, 36.21, 46.96, 37.19, 21.77, 28.82,
    21.44, 35.72,
  ];
  // const dataRandom = new Array(100)
  //   .fill(0)
  //   .map((v, i) => ({ x: i, y: dataMock[Math.floor(Math.random() * dataMock.length)] }));
  const dataRandom = dataMock.map((v, i) => ({ x: i, y: v }));

  const calcMean = (dataInput: any, useY?: boolean) => {
    // calculate mean of data, if useY is true, calculate the mean of y values, otherwise calculate the mean of x values
    const sum = dataInput.reduce((a: any, b: any) => a + (useY ? b.y : b.x), 0);
    return sum / dataInput.length;
  };
  const mean = calcMean(dataRandom, true);
  const y = dataRandom.map((p: any) => p.y);
  const variance = deviation(y) ** 2;
  const stddev = Math.sqrt(variance);

  const pdf = (x: any) => {
    // calculate probability density function for normal distribution
    const m = stddev * Math.sqrt(2 * Math.PI);
    const e = Math.exp(-((x - mean) ** 2) / (2 * variance));
    return e / m;
  };
  const bell: { x: number; y: number }[] = [];
  const startX = mean - 3.5 * stddev;
  const endX = mean + 3.5 * stddev;
  const step = stddev / 7;
  let x;
  for (x = startX; x <= mean; x += step) {
    bell.push({ x, y: pdf(x) });
  }
  for (x = mean + step; x <= endX; x += step) {
    bell.push({ x, y: pdf(x) });
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'nearest' as const,
      intersect: false,
    },
    scales: {
      x: { min: 0, max: 100 } as const,
      y: { min: 0, max: 300, title: { display: false, text: 'Data' } } as const,
      x2: {
        position: 'top' as const,
        type: 'linear' as const,
        grid: {
          display: false,
        } as const,
        afterBuildTicks(scale: { ticks: { value: number }[] }) {
          scale.ticks = bell
            .map((p) => ({ value: p.x }))
            .filter((tick, index) => index % 2 === 0) as any;
        },
        ticks: {
          maxRotation: 0,
        } as const,
        min: startX as any,
        max: endX as any,
      },
      y2: {
        type: 'linear' as const,
        position: 'right' as const,
        grid: {
          display: false,
        } as const,
        title: {
          display: false,
          text: 'Bell Curve',
          color: 'rgba(84,102,160,0.8)',
        } as const,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };
  const data = {
    datasets: [
      {
        type: 'line' as const,
        label: 'Bell Curve' as const,
        data: bell,
        xAxisID: 'x2' as const,
        yAxisID: 'y2' as const,
        fill: true,
        tension: 0.4,
        radius: 0,
        borderColor: 'rgba(84,102,160,0.3)' as const,
      },
      // {
      //   type: 'scatter' as const,
      //   label: 'Data' as const,
      //   data: dataRandom,
      //   backgroundColor: 'rgba(0,200,0,0.3)',
      //   hoverRadius: 10,
      //   hoverBackgroundColor: 'yellow' as const,
      //   showLine: false,
      // },
    ],
  };

  return <Chart options={options} data={data} type="line" />;
};

export default BellCurveChart;

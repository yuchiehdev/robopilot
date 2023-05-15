import { useState } from 'react';
import { Chart } from 'chart.js';
import { Line } from 'react-chartjs-2';
import ChartStreaming from 'chartjs-plugin-streaming';
import 'chartjs-adapter-luxon';
// import { PPR } from '../../data/fetchUrl';
// import deviation from '../../utils/standardDeviation';

Chart.register(ChartStreaming);

const Template = () => {
  const [TIMEPPR] = useState([]);

  // useEffect(() => {
  //   fetch(PPR)
  //     .then((res) => res.json())
  //     .then((item) => {
  //       setTIMEPPR(item.TIME_PP_R);
  //     });
  // }, []);

  const CL = TIMEPPR;
  console.log(CL);

  // const fetchData = [
  //   31.1, 36.4, 20.18, 21.65, 45, 25.93, 24.8, 38.13, 21.67, 45.14, 26.8, 26.21, 34.87,
  //   34.95, 22.52, 28.4, 42.79, 45.11, 31.53, 43.05, 22.2, 33.14, 45.31, 21.76, 45, 38.26,
  //   28.44, 34.35, 46.27, 34.62, 31.64, 44.31, 35.34, 41.45, 43.83, 30.61, 43.7, 35.31,
  //   40.07, 39.48, 44.79, 32.61, 36.74, 20.13, 33.22, 45.68, 44.88, 22.19, 20.68, 41.59,
  //   40.13, 35.91, 40.41, 29.73, 34.31, 25.25, 22.69, 34.94, 46.04, 21.37, 29.56, 28.45,
  //   43.43, 25.85, 44.31, 46.87, 23.88, 20.2, 29.97, 43.69, 30.04, 29.49, 20.66, 40.95,
  //   20.82, 32.05, 30.3, 20.27, 48.14, 25.89, 29.07, 28.78, 26.65, 42.02, 36.45, 44.29,
  //   23.76, 26.67, 39.94, 37.81, 21.59, 41.66, 48.03, 36.21, 46.96, 37.19, 21.77, 28.82,
  //   21.44, 35.72,
  // ];

  const data = {
    datasets: [
      {
        label: 'Dataset',
        backgroundColor: 'rgb(0,108,146)',
        borderColor: 'rgb(0,108,146)',
        data: [],
      },
    ],
  };
  const options = {
    plugins: {
      // Change options for ALL axes of THIS CHART
      streaming: {
        delay: 2000,
        duration: 20000,
      },
    },
    scales: {
      x: {
        type: 'realtime' as const,
        // Change options only for THIS AXIS
        realtime: {
          onRefresh: (chart: { data: { datasets: any[] } }) => {
            chart.data.datasets.forEach((dataset) => {
              dataset.data.push({
                x: Date.now(),
                y: Math.random() * 13 + 1,
              });
            });
          },
        },
      },
    },
  };
  return (
    <div style={{ height: '70vh' }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default Template;

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale, // x axis
  LinearScale, // y axis
  PointElement,
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const ControlChart = () => {
  const data = {
    datasets: [
      {
        label: 'Dataset',
        backgroundColor: 'rgb(0,108,146)',
        borderColor: 'rgb(0,108,146)',
        data: [],
      },
      {
        label: 'CL',
        backgroundColor: '#162848',
        borderColor: '#162848',
        pointRadius: 0,
        data: [],
      },
      {
        label: 'UCL',
        backgroundColor: '#e5446d',
        borderColor: '#e5446d',
        data: [],
        pointRadius: 0,
        borderDash: [8, 4],
      },
      {
        label: 'LCL',
        backgroundColor: 'rgb(142,211,0)',
        borderColor: 'rgb(142,211,0)',
        data: [],
        pointRadius: 0,
        borderDash: [8, 4],
      },
    ],
  };
  const options = {
    maintainAspectRatio: false,
    plugins: {
      streaming: {
        duration: 20000,
      },
    },
    scales: {
      x: {
        type: 'realtime' as const,
        realtime: {
          duration: 40000,
          delay: 2000,
          onRefresh: (chart: { data: { datasets: any[] } }) => {
            chart.data.datasets.forEach((dataset) => {
              if (dataset.label === 'UCL') {
                dataset.data.push({
                  // show time every 10 seconds
                  x: Date.now(),
                  y: 10,
                });
              } else if (dataset.label === 'LCL') {
                dataset.data.push({
                  x: Date.now(),
                  y: 1,
                });
              } else if (dataset.label === 'CL') {
                dataset.data.push({
                  x: Date.now(),
                  y: 5,
                });
              } else {
                dataset.data.push({
                  x: Date.now(),
                  y: Math.random() * 13 + 1,
                });
              }
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

export default ControlChart;

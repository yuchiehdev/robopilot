import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { StreamingPlugin, RealTimeScale } from 'chartjs-plugin-streaming';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale, // x axis
  LinearScale, // y axis
  PointElement,
  Legend,
  Tooltip,
} from 'chart.js';
import 'chartjs-adapter-luxon';

import DDL from '../DropDownList';
import deviation, { mean } from '../../utils/standardDeviation';
import mockControlData from '../../data/mockControlData.json';

ChartJS.register(
  StreamingPlugin,
  RealTimeScale,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
);

// 2023-02-06 fetch entire array from api, and simply show that onRefresh
// 2023-02-08 fetch two kind of data, one is for deviation needed to be refresh per ten minutes, another is for current data needed to be refresh per second

const StreamChart = () => {
  const listItems = ['TrayA', 'TrayB', 'Press', 'Calibration'];
  const [TIMEPPR, setTIMEPPR] = useState<number[]>([]);
  const [TIMEPPL, setTIMEPPL] = useState<number[]>([]);
  const [TIMEPRESS, setTIMEPRESS] = useState<number[]>([]);
  const [TIMEVISCAL, setTIMEVISCAL] = useState<number[]>([]);
  const [selected, setSelected] = useState('TrayA');
  const [checked, setChecked] = useState([
    selected === listItems[0],
    false,
    false,
    false,
    false,
    false,
    false,
  ]);

  useEffect(() => {
    setTIMEPPR(mockControlData[0].TIME_PP_R);
    setTIMEPPL(mockControlData[0].TIME_PP_L);
    setTIMEPRESS(mockControlData[0].TIME_PRESS);
    setTIMEVISCAL(mockControlData[0].TIME_VIS_CAL);
  }, []);

  let deviationTIME = deviation(TIMEPPR) * 3;
  let meanTIME = mean(TIMEPPR);
  let selectedData = TIMEPPR;

  switch (selected) {
    case 'TrayA':
      deviationTIME = deviation(TIMEPPR) * 3;
      meanTIME = mean(TIMEPPR);
      selectedData = TIMEPPR;
      break;
    case 'TrayB':
      deviationTIME = deviation(TIMEPPL) * 3;
      meanTIME = mean(TIMEPPL);
      selectedData = TIMEPPL;
      break;
    case 'Press':
      deviationTIME = deviation(TIMEPRESS) * 3;
      meanTIME = mean(TIMEPRESS);
      selectedData = TIMEPRESS;
      break;
    case 'Calibration':
      deviationTIME = deviation(TIMEVISCAL) * 3;
      meanTIME = mean(TIMEVISCAL);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      selectedData = TIMEVISCAL;
      break;
    default:
      break;
  }

  const data = {
    datasets: [
      {
        label: 'Dataset',
        backgroundColor: 'rgb(0,108,146)',
        borderColor: 'rgb(0,108,146)',
        data: [],
        spanGaps: true,
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
        delay: 5000, // set value that's equal to refresh rate, orelse chart will be jumpy
        duration: 20000,
        refresh: 2000,
        ttl: 60000,
        // frameRate: 20, // for decrease CPU usage
      },
    },
    scales: {
      x: {
        type: 'realtime' as const,
        realtime: {
          onRefresh: (chart: { data: { datasets: any[] } }) => {
            fetch('http://localhost:5003/test')
              .then((res) => res.json())
              .then((value) => {
                chart.data.datasets.forEach((dataset) => {
                  if (dataset.label === 'UCL') {
                    dataset.data.push({
                      x: Date.now(),
                      y: meanTIME + deviationTIME,
                    });
                  } else if (dataset.label === 'LCL') {
                    dataset.data.push({
                      x: Date.now(),
                      y: meanTIME - deviationTIME,
                    });
                  } else if (dataset.label === 'CL') {
                    dataset.data.push({
                      x: Date.now(),
                      y: meanTIME,
                    });
                  } else {
                    dataset.data.push({
                      x: Date.now(),
                      y: value,
                    });
                  }
                });
              });
          },
        },
      },
    },
  };

  return (
    <>
      <div className="absolute top-2 right-[1rem]">
        <DDL
          setSelected={setSelected}
          selected={selected}
          listItems={listItems}
          checked={checked}
          setChecked={setChecked}
        />
      </div>
      <div className="h-[60%]">
        <Line data={data} options={options} />
      </div>
    </>
  );
};

export default StreamChart;

/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import { FcComboChart } from 'react-icons/fc';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-luxon';
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
// import { PPR, PPL, PRESS, VISCAL } from '../../data/fetchUrl';
import dayjs from 'dayjs';
import deviation, { mean } from '../../utils/standardDeviation';
import DDL from '../DropDownList';
import mockControlData from '../../data/mockControlData.json';
import './streamChart.scss';
import { useAppSelector } from '../../store';

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
  const listitems = ['TrayA', 'TrayB', 'Press', 'Calibration'];
  const [TIMEPPR, setTIMEPPR] = useState<number[]>([]);
  const [TIMEPPL, setTIMEPPL] = useState<number[]>([]);
  const [TIMEPRESS, setTIMEPRESS] = useState<number[]>([]);
  const [TIMEVISCAL, setTIMEVISCAL] = useState<number[]>([]);
  const [selected, setSelected] = useState('TrayA');
  const [checked, setChecked] = useState([
    selected === listitems[0],
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const URL = [
    'http://localhost:5003/test',
    'http://localhost:5003/test',
    'http://localhost:5003/test',
    'http://localhost:5003/test',
  ];
  const deviationTenMin = useAppSelector((state) => state.eventQuery.deviation);
  const meanTenMin = useAppSelector((state) => state.eventQuery.mean);
  console.log(meanTenMin);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dataForTestingNA = [
    '31.1',
    'N/A',
    'N/A',
    'N/A',
    '34.88',
    'N/A',
    'N/A',
    'N/A',
    'N/A',
    45.14,
    26.8,
    26.21,
    34.87,
    34.95,
    22.52,
    28.4,
    42.79,
    45.11,
    31.53,
    43.05,
    22.2,
    33.14,
    45.31,
    21.76,
    45,
    38.26,
    28.44,
    34.35,
    46.27,
    34.62,
    31.64,
    44.31,
    35.34,
    41.45,
    43.83,
    30.61,
    43.7,
    35.31,
    40.07,
    39.48,
    44.79,
    32.61,
    36.74,
    20.13,
    33.22,
    45.68,
    44.88,
    22.19,
    20.68,
    41.59,
    40.13,
    35.91,
    40.41,
    29.73,
    34.31,
    25.25,
    22.69,
    34.94,
    46.04,
    21.37,
    29.56,
    28.45,
    43.43,
    25.85,
    44.31,
    46.87,
    23.88,
    20.2,
    29.97,
    43.69,
    30.04,
    29.49,
    20.66,
    40.95,
    20.82,
    32.05,
    30.3,
    20.27,
    48.14,
    25.89,
    29.07,
    28.78,
    26.65,
    42.02,
    36.45,
    44.29,
    23.76,
    26.67,
    39.94,
    37.81,
    21.59,
    41.66,
    48.03,
    36.21,
    46.96,
    37.19,
    21.77,
    28.82,
    21.44,
    35.72,
  ];
  useEffect(() => {
    setTIMEPPR(mockControlData[0].TIME_PP_R);
    setTIMEPPL(mockControlData[0].TIME_PP_L);
    setTIMEPRESS(mockControlData[0].TIME_PRESS);
    setTIMEVISCAL(mockControlData[0].TIME_VIS_CAL);
  }, []);
  // useEffect(() => {
  //   Promise.all([fetch(PPR), fetch(PPL), fetch(PRESS), fetch(VISCAL)]).then(
  //     async ([res1, res2, res3, res4]) => {
  //       const data1 = await res1.json();
  //       const data2 = await res2.json();
  //       const data3 = await res3.json();
  //       const data4 = await res4.json();
  //       setTIMEPPR(data1.TIME_PP_R);
  //       setTIMEPPL(data2.TIME_PP_L);
  //       setTIMEPRESS(data3.TIME_PRESS);
  //       setTIMEVISCAL(data4.TIME_VISCAL);
  //     },
  //   );
  // }, []);

  let deviationTIME = deviation(TIMEPPR) * 3;
  let meanTIME = mean(TIMEPPR);
  let selectedData = TIMEPPR;
  let selectedCount = 0;

  switch (selected) {
    case 'TrayA':
      deviationTIME = deviation(TIMEPPR) * 3;
      meanTIME = mean(TIMEPPR);
      selectedData = TIMEPPR;
      selectedCount = 0;
      break;
    case 'TrayB':
      deviationTIME = deviation(TIMEPPL) * 3;
      meanTIME = mean(TIMEPPL);
      selectedData = TIMEPPL;
      selectedCount = 1;
      break;
    case 'Press':
      deviationTIME = deviation(TIMEPRESS) * 3;
      meanTIME = mean(TIMEPRESS);
      selectedData = TIMEPRESS;
      selectedCount = 2;
      break;
    case 'Calibration':
      deviationTIME = deviation(TIMEVISCAL) * 3;
      meanTIME = mean(TIMEVISCAL);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      selectedData = TIMEVISCAL;
      selectedCount = 3;
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
        backgroundColor: 'rgba(22,40,72,0.7)',
        borderColor: 'rgba(22,40,72,0.7)',
        pointRadius: 0,
        data: [],
      },
      {
        label: 'UCL',
        backgroundColor: 'rgba(229,68,109,0.7)',
        borderColor: 'rgba(229,68,109,0.7)',
        data: [],
        pointRadius: 0,
        borderDash: [8, 4],
      },
      {
        label: 'LCL',
        backgroundColor: 'rgba(142,211,0,0.7)',
        borderColor: 'rgba(142,211,0,0.7)',
        data: [],
        pointRadius: 0,
        borderDash: [8, 4],
      },
    ],
  };
  let hovering = false;
  let count = 0;
  const tooltip = document.getElementById('tooltip') as HTMLElement;
  // const simutime = new Date(Date.now()).toLocaleTimeString('en-US');
  const options = {
    maintainAspectRatio: false,

    plugins: {
      legend: {
        onHover: (legendItem: any) => {
          // log legend item
          if (hovering) return;
          hovering = true;
          tooltip.style.display = 'block';
        },
        onLeave: () => {
          hovering = false;
          tooltip.style.display = 'none';
        },
      },
      streaming: {
        delay: 5000, // set value that's equal to refresh rate, orelse chart will be jumpy
        duration: 20000,
        refresh: 2000,
        // ttl: 60000,
        // frameRate: 20, // for decrease CPU usage
      },
    },
    scales: {
      x: {
        type: 'realtime' as const,
        time: {
          displayFormats: {
            second: 'x',
            minute: 'x',
            hour: 'x',
          },
        },
        ticks: {
          maxRotation: 0,
          // force to format x axis as AM/PM
          callback(v: any) {
            // const currentTime = new Date(Date.now()).toLocaleTimeString('en-US');
            // const currentTime = moment(Number(v)).zone('+01:00').format('h:mm:ss a');
            // const currentTime = moment(Number(v)).format('h:mm:ss a');
            const currentTime = dayjs(Number(v)).format('h:mm:ss a');
            // const currentTime = v.toString('hh:mm:ss a');
            return currentTime;
          },
        },
        realtime: {
          onRefresh: (chart: { data: { datasets: any[] } }) => {
            Promise.all([
              // fetch('http://localhost:5003/pp', {
              //   method: 'POST',
              //   headers: {
              //     'Content-Type': 'application/json',
              //   },
              //   body: JSON.stringify({
              //     index: count,
              //   }),
              // }),
              fetch(URL[0]),
              fetch(URL[1]),
              fetch(URL[2]),
              fetch(URL[3]),
            ]).then(async ([res1, res2, res3, res4]) => {
              const data1 = await res1.json();
              const data2 = await res2.json();
              const data3 = await res3.json();
              const data4 = await res4.json();
            });
            fetch('http://loaclhost:5003/pp', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                index: count,
              }),
            })
              .then((res) => {
                // if res is null or undefined, don't show error

                // console.log(res);
                if (res.status === 404) {
                  return 'N/A';
                }
                return res.json();
              })
              .then((value) => {
                try {
                  chart.data.datasets.forEach((dataset) => {
                    if (dataset.label === 'UCL') {
                      dataset.data.push({
                        x: Date.now(),
                        y: meanTenMin + deviationTenMin,
                      });
                    } else if (dataset.label === 'LCL') {
                      dataset.data.push({
                        x: Date.now(),
                        y: meanTenMin - deviationTenMin,
                      });
                    } else if (dataset.label === 'CL') {
                      dataset.data.push({
                        x: Date.now(),
                        y: meanTenMin,
                      });
                    } else {
                      dataset.data.push({
                        x: Date.now(),
                        y: value,
                      });
                    }
                  });
                } catch (error) {
                  console.log(error);
                }
              });
            count += 1;
            if (count === 100) {
              count = 0;
            }
          },
        },
      },
    },
  };

  return (
    <>
      <div className="absolute top-2 left-2">
        <h1 className="mb-1 pl-4 font-semibold tracking-wider text-blue-dark dark:text-white">
          Control Chart
        </h1>
      </div>
      <div className="absolute top-2 right-[1rem]">
        <DDL
          setSelected={setSelected}
          selected={selected}
          listitems={listitems}
          icon={<FcComboChart className="mr-[0.3rem]" size="20" />}
          styleCSS="py-[0.4rem] px-3 text-sm font-semibold border-[#F3F3F3] shadow-sm rounded-md"
          arrowColor="#8a8a8a"
          checked={checked}
          setChecked={setChecked}
        />
      </div>
      <div id="tooltip" className="absolute top-2 left-1/3 hidden">
        <div className="dialogBottom">CL、UCL、LCL refresh every ten minutes</div>
      </div>
      <Line data={data} options={options} />
    </>
  );
};

export default StreamChart;

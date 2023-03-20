import { useRef, useEffect } from 'react';
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
} from 'chart.js';
import { Chart, getElementAtEvent } from 'react-chartjs-2';
import { useAppDispatch, useAppSelector } from '../../store';
import { eventActions } from '../../store/eventQuerySlice';
import NoData from '../IconText';
import { ReactComponent as LoadCheckIcon } from '../../assets/icons/loadCheck.svg';

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
);
type peratoChartProps = {
  eventData: number[][];
  eventErrorName: string[];
  hasEvent?: boolean;
};

const PeratoChart = ({ eventData, eventErrorName, hasEvent }: peratoChartProps) => {
  const filterTag = useAppSelector((state) => state.eventQuery.filterTag);
  const dispatch = useAppDispatch();

  let label = [];
  let data: (string | number)[] = [];
  if (eventData.length < 10) {
    // only for making sure the chart has 10 data points
    let i = 0;
    while (i < 10) {
      if (i < eventData.length) {
        label.push(eventData[i][0]);
        data.push(eventData[i][1]);
      } else {
        label.push('');
        data.push('N/A');
      }
      i += 1;
    }
  } else {
    label = eventData.map((el) => el[0]);
    data = eventData.map((el) => el[1]);
  }

  // total sum of all data
  const dataSum = data.reduce((total, item) => {
    if (typeof item === 'number') {
      return Number(total) + Number(item);
    }
    return total;
  }, 0);

  // cumulativeSum
  const cumulativeSum = data.map((el, index) => {
    if (typeof el === 'number') {
      return data
        .slice(0, index + 1)
        .reduce((total, item) => Number(total) + Number(item), 0);
    }
    return el;
  });
  // map array + cumulative into percentage
  const percentage = cumulativeSum.map((el) => {
    if (typeof el === 'number') {
      return parseFloat(((el / Number(dataSum)) * 100).toFixed(1));
    }
    return el;
  });

  const analysisData = {
    labels: label,
    datasets: [
      {
        type: 'line' as const,
        label: 'Cumulative Percentage',
        data: percentage,
        backgroundColor: '#FF7E0B',
        yAxisID: 'percentageAxis',
      },
      {
        type: 'bar' as const,
        label: 'Count',
        data,
        backgroundColor: '#ffbe0b',
      },
    ],
  };

  const analysisOptions = {
    maintainAspectRatio: false,
    responsive: true,
    onHover: (event: any, chartElement: any) => {
      // change cursor to pointer if there is a chart element under the cursor
      if (chartElement.length === 1) {
        event.native.target.style.cursor = 'pointer';
      }
      if (chartElement.length === 0) {
        event.native.target.style.cursor = 'default';
      }
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          title: (t: any) => {
            const description = `  Error : ${
              eventErrorName[t[0].dataIndex]
            } \n  Count : ${data[t[0].dataIndex]} \n  Percentage : ${
              percentage[t[0].dataIndex]
            }%`;
            return description;
          },
          label: () => {
            return '';
          },
        },
        backgroundColor: '#1E2939',
        borderColor: '#000000',
        borderWidth: 1,
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 14,
        },
        displayColors: false,
      } as any,
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Error Code',
        },
        grid: {
          display: hasEvent,
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Count',
        },
        grid: {
          display: false,
        },
      },
      percentageAxis: {
        type: 'linear' as const,
        position: 'right' as const,
        beginAtZero: true,
        min: 0,
        max: 100,
        ticks: {
          callback: (value: number) => `${value}%`,
        } as any,
        title: {
          display: true,
          text: 'Cumulative Percentage',
        },
        grid: {
          display: hasEvent,
        },
      },
    },
  };

  const chartRef = useRef<any>(null);
  const onClick = (event: any) => {
    // console.log(getElementAtEvent(chartRef.current, event)[0]?.index);
    // console.log(eventData[getElementAtEvent(chartRef.current, event)[0]?.index][0]);
    const clickedBar =
      eventData[getElementAtEvent(chartRef.current, event)[0]?.index][0].toString();
    dispatch(
      eventActions.filterTag({
        ...filterTag,
        perato: clickedBar,
      }),
    );
  };
  useEffect(() => {
    dispatch(
      eventActions.filterTag({
        dashboardTable: '',
        perato: '',
      }),
    );
  }, []);

  return (
    <div className="relative h-full w-full">
      <Chart
        type="bar"
        options={analysisOptions}
        data={analysisData}
        onClick={onClick}
        ref={chartRef}
      />
      {!hasEvent ? (
        <div className="absolute top-0 left-0 z-10 flex h-full w-full items-center justify-center bg-[rgba(255,255,255,0.6)]">
          <NoData
            text="No Data"
            color="#999999"
            width="w-14"
            description={{
              firstLine: 'Looks like there are no data here yet.',
              secondLine: 'Try to change the date range to see the data.',
            }}
            gap="mt-2 mb-4"
            textSize="text-3xl"
          >
            <LoadCheckIcon fill="#999999" />
          </NoData>
        </div>
      ) : null}
    </div>
  );
};

export default PeratoChart;

import { useState, useEffect } from 'react';
import Panel from '../../components/Panel';
import StreamChart from '../../components/StreamChart';
import BellCurveChart from '../../components/BellCurveChart';
import DashboardTable from '../../components/DashboardTable';
import dimmIcon from '../../assets/icons/dimm.png';
import mockMeasureData from '../../data/mockMeasurementsTable.json';
import deviation, { mean } from '../../utils/standardDeviation';
import mockControlData from '../../data/mockControlData.json';
import { useAppDispatch } from '../../store';
import { eventActions } from '../../store/eventQuerySlice';
import { ReactComponent as LoadCheckIcon } from '../../assets/icons/loadCheck.svg';
import NoData from '../../components/IconText';

const tableCeil: string[] = ['S/N', 'P/N', 'Time In', 'Time Out', 'Total', 'Pass Rate'];
const tableHeader: string[] = ['S/N', 'P/N', 'Time In', 'Time Out', 'Total', 'Pass Rate'];

const Measurements = () => {
  const dispatch = useAppDispatch();
  const [selectedSN, setSelectedSN] = useState<string>('');
  const mockData = [
    'SN0000000001',
    'SN0000000002',
    'SN0000000003',
    'SN0000000004',
    'SN0000000005',
    'SN0000000006',
    'SN0000000007',
    'SN0000000008',
    'SN0000000009',
  ];
  const mockDataSN: { [key: string]: boolean[] } = {
    SN0000000001: [true, true, true, true, true, true, true, true, true, true],
    SN0000000002: [false, true, false, true, true, false, true, true, true, true],
    SN0000000003: [true, false, true, true, true, false, true, true, true, true],
    SN0000000004: [false, true, false, true, true, false, true, true, true, true],
    SN0000000005: [true, false, true, true, true, false, true, true, true, true],
    SN0000000006: [false, true, false, true, true, false, true, true, true, true],
    SN0000000007: [true, false, true, true, true, false, true, true, true, true],
    SN0000000008: [false, true, false, true, true, false, true, true, true, true],
    SN0000000009: [true, false, true, true, true, false, true, true, true, true],
  };

  useEffect(() => {
    const calculate = () => {
      const deviationTIME = deviation(mockControlData[0].TIME_PP_R) * 3;
      const meanTIME = mean(mockControlData[0].TIME_PP_R);
      dispatch(eventActions.deviation(deviationTIME));
      dispatch(eventActions.mean(meanTIME));
    };
    calculate();
    const setPerTenMin = setInterval(() => {
      calculate();
    }, 600000);
    return () => {
      clearInterval(setPerTenMin);
    };
  }, []);

  const handleTableClick = (sn: string) => {
    if (sn) {
      setSelectedSN(sn);
    }
  };

  return (
    <Panel>
      <div className="flex h-full w-full flex-wrap overflow-y-auto th:flex-nowrap th:overflow-y-hidden">
        <div className="flex h-full w-full flex-col pr-[2.5rem] th:w-[70%]">
          <div className="relative h-1/2 w-full overflow-hidden rounded-2xl bg-white p-2 pb-[1rem] pt-6 shadow-md dark:bg-black-100">
            <StreamChart />
          </div>
          <div className="h-1/2 w-full pt-[1rem]">
            <DashboardTable
              tableCeil={tableCeil}
              hasEvent
              tableData={mockMeasureData}
              tableHeader={tableHeader}
              handleTableClick={handleTableClick}
              page="measurements"
            />
          </div>
        </div>
        <div className="flex h-full w-full flex-col gap-10 pl-[2.5rem] th:w-[30%] th:gap-0">
          <div className="h-1/2 w-full pb-[1rem] pt-6">
            <section className="h-full w-full overflow-hidden rounded-lg dark:bg-black-100">
              <BellCurveChart />
            </section>
          </div>
          <div className="h-1/2 w-full pt-[1rem]">
            <div className="scrollbarHide h-full w-full overflow-y-auto">
              <table className="relative h-full w-full">
                <thead className="sticky top-[-2px]">
                  <tr className=" bg-[#f9f9f9]">
                    <th
                      className="border-b-2 border-[#F0F0F0] pl-2 pb-4 text-start text-xl font-extrabold tracking-wide text-[#2f2f31]"
                      colSpan={3}
                    >
                      DIMM INFO
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedSN &&
                    mockData.map((item, index) => {
                      return (
                        <tr
                          // eslint-disable-next-line react/no-array-index-key
                          key={index}
                          className={`${
                            mockDataSN[selectedSN][index]
                              ? 'bg-[rgba(119,224,32,0.1)]'
                              : 'bg-[#ffebeb7a]'
                          }`}
                        >
                          <td className="h-auto pr-5 text-start text-sm tracking-wide text-[#797c88]">
                            <img
                              alt="icon"
                              src={dimmIcon}
                              className="h-6 w-6 rounded-2xl bg-white object-contain shadow-md"
                            />
                          </td>
                          <td className="py-[0.54rem] text-start align-middle text-lg tracking-wide text-[#797c88]">
                            <span className="text-[#636363]">{item}</span>
                          </td>
                          <td
                            className={`text-start text-xl tracking-wide  ${
                              mockDataSN[selectedSN][index]
                                ? 'text-[#636363]'
                                : ' font-bold text-red'
                            } `}
                          >
                            <span>{mockDataSN[selectedSN][index] ? 'PASS' : 'FAIL'}</span>
                          </td>
                        </tr>
                      );
                    })}
                  {!selectedSN ? (
                    <div className="absolute top-0 left-0 z-10 flex h-[95%] w-full items-center justify-center bg-[rgba(255,255,255,0.2)]">
                      <NoData
                        text="No Data"
                        color="#999999"
                        width="w-14"
                        gap="mt-4 mb-2"
                        textSize="text-3xl"
                      >
                        <LoadCheckIcon fill="#999999" />
                      </NoData>
                    </div>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
};

export default Measurements;

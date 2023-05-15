import { useQuery } from '@tanstack/react-query';

import Board from '../../components/Board';
import { FETCH_INTERVAL } from '../../data/constant';
import { getFeederA, getFeederB } from '../../api/assembly';
import CircularProgressbar from '../../components/CircularProgressbar';
import type { Sensor } from '../../types';

const DimmSupplement = () => {
  const { data: feederA } = useQuery<Sensor[]>(['trayFeederA'], () => getFeederA(), {
    refetchInterval: FETCH_INTERVAL,
    useErrorBoundary: true,
    suspense: true,
  });
  const { data: feederB } = useQuery<Sensor[]>(['trayFeederB'], () => getFeederB(), {
    refetchInterval: FETCH_INTERVAL,
    useErrorBoundary: true,
    suspense: true,
  });
  const progressbarValue: number[][] = [
    [
      feederA
        ?.filter((item) => item.name === 'FEEDER_A_BUFFER')
        .map((item) => (item.value !== 0 ? 100 : 0))[0] ?? 0,
      feederA
        ?.filter((item) => item.name === 'FEEDER_A_IN_REMAIN')
        .map((item) => (item.value != null ? Number(item.value / 10) * 100 : 0))[0] ?? 0,
      feederA
        ?.filter((item) => item.name === 'FEEDER_A_OUT_EMPTY')
        .map((item) => (item.value != null ? Number(item.value / 10) * 100 : 0))[0] ?? 0,
    ],
    [
      feederB
        ?.filter((item) => item.name === 'FEEDER_B_BUFFER')
        .map((item) => (item.value !== 0 ? 100 : 0))[0] ?? 0,
      feederB
        ?.filter((item) => item.name === 'FEEDER_B_IN_REMAIN')
        .map((item) => (item.value != null ? Number(item.value / 10) * 100 : 0))[0] ?? 0,
      feederB
        ?.filter((item) => item.name === 'FEEDER_B_OUT_EMPTY')
        .map((item) => (item.value != null ? Number(item.value / 10) * 100 : 0))[0] ?? 0,
    ],
  ];
  return (
    <Board
      width="w-full lg:w-[33%]"
      className="h-max py-3 text-sm lg:h-full"
      title="DIMM Supplement"
    >
      <section className="text-md flex h-[90%] w-full flex-col items-center justify-center">
        <section className="flex w-full justify-evenly p-1 font-bold text-blue-dark">
          <section className="flex w-1/5">{null}</section>
          {['Q1', 'Q2', 'Rec. Bin'].map((item) => (
            <div key={item} className="flex w-1/4 items-center justify-center">
              {item}
            </div>
          ))}
        </section>

        {['Left', 'Right'].map((item, index) => (
          <section className="flex w-full justify-evenly p-1" key={item}>
            <section className="flex w-1/5">
              <h5 className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-table-bg text-base font-bold text-blue-dark shadow">
                {item}
              </h5>
            </section>
            {progressbarValue[index].map((value) => (
              <div className="flex w-1/4 items-center justify-center">
                <CircularProgressbar value={value} />
              </div>
            ))}
          </section>
        ))}
      </section>
    </Board>
  );
};

export default DimmSupplement;

/* eslint-disable no-underscore-dangle */
import { useState } from 'react';
import { useQueries, useQuery } from '@tanstack/react-query';

import { getFeeder } from '../../api/assembly';
import type { Sensor } from '../../types';
import DashboardTable from '../../components/DashboardTable';
import { FETCH_INTERVAL } from '../../data/constant';

const tableCeil: string[] = ['Name', 'Value'];
const tableHeader: string[] = ['name', 'value'];
const blockName: string[] = ['Tray Feeder', 'Dimm Feeder', 'TS5000'];

const Status = () => {
  const [trayFeederTab, setTrayFeederTab] = useState('1');
  const [dimmFeederTab, setDimmFeederTab] = useState('1');
  const trayFeeder = useQueries({
    queries: [
      {
        queryKey: ['trayFeederA'],
        queryFn: () => getFeeder('device_kv8000_trayfeeder_A'),
        refetchInterval: FETCH_INTERVAL,
        useErrorBoundary: true,
      },
      {
        queryKey: ['trayFeederB'],
        queryFn: () => getFeeder('device_kv8000_trayfeeder_B'),
        refetchInterval: FETCH_INTERVAL,
        useErrorBoundary: true,
      },
    ],
  });

  const dimmFeeder = useQueries({
    queries: [
      {
        queryKey: ['dimmFeederA'],
        queryFn: () => getFeeder('device_kv8000_dimmfeeder_A'),
        refetchInterval: FETCH_INTERVAL,
        useErrorBoundary: true,
      },
      {
        queryKey: ['dimmFeederB'],
        queryFn: () => getFeeder('device_kv8000_dimmfeeder_B'),
        refetchInterval: FETCH_INTERVAL,
        useErrorBoundary: true,
      },
    ],
  });
  const { data: ts5000 } = useQuery<Sensor[], Error>({
    queryKey: ['ts5000'],
    queryFn: () => getFeeder('device_ts5000'),
    refetchInterval: FETCH_INTERVAL,
    useErrorBoundary: true,
  });
  const data = [
    trayFeeder.map((item) => item.data)[Number(trayFeederTab) - 1],
    dimmFeeder.map((item) => item.data)[Number(dimmFeederTab) - 1],
    ts5000?.filter((item) => !item.name.startsWith('MER')),
  ];

  return (
    <main className="grid grid-cols-2 gap-4 overflow-auto p-4 status:grid-cols-3">
      {blockName.map((item, index) => (
        <div className="min-h-[30rem] rounded-lg bg-white p-6 shadow-md" key={item}>
          <div className="flex">
            <h1 className="mb-1 grow pl-4 text-lg font-semibold tracking-wider text-blue-dark dark:text-white">
              {item}
            </h1>
            {index === 0 || index === 1 ? (
              <>
                <button
                  className={`${
                    (index === 0 ? trayFeederTab : dimmFeederTab) === '1'
                      ? 'border border-[#F3F3F4] bg-white text-wiwynn-blue shadow-sm'
                      : 'bg-white hover:cursor-pointer hover:bg-[#f9f9f9]'
                  } rounded-md px-4 py-[0.4rem]`}
                  onClick={() => {
                    if (index === 0) {
                      setTrayFeederTab('1');
                    } else {
                      setDimmFeederTab('1');
                    }
                  }}
                  disabled={(index === 0 ? trayFeederTab : dimmFeederTab) === '1'}
                >
                  A
                </button>
                <button
                  className={`${
                    (index === 0 ? trayFeederTab : dimmFeederTab) === '2'
                      ? 'border border-[#F3F3F4] bg-white text-wiwynn-blue shadow-sm'
                      : 'bg-white hover:cursor-pointer hover:bg-[#f9f9f9]'
                  } rounded-md px-4 py-[0.4rem]`}
                  onClick={() => {
                    if (index === 0) {
                      setTrayFeederTab('2');
                    } else {
                      setDimmFeederTab('2');
                    }
                  }}
                  disabled={(index === 0 ? trayFeederTab : dimmFeederTab) === '2'}
                >
                  B
                </button>
              </>
            ) : null}
          </div>
          <div className="h-[85%]">
            <DashboardTable
              hasEvent={data.length > 0}
              tableCeil={tableCeil}
              tableData={data[index]}
              tableHeader={tableHeader}
              page="status"
            />
          </div>
        </div>
      ))}
    </main>
  );
};

export default Status;

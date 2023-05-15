/* eslint-disable camelcase */
import { useEffect, useState, useMemo } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useQuery } from '@tanstack/react-query';
import Panel from '../../components/Panel';
import { useAppSelector } from '../../store';
import { stringToUTCTimestamp } from '../../utils/dateToUTCTimestamp';
import PeratoChart from '../../components/PeratoChart';
import DashboardTable from '../../components/DashboardTable';
import LiquidChart from '../../components/LiquidChart';
import { isFeatureEnabled } from '../../data/featureFlag';
import { getEventByTime } from '../../api/event';
import type { EventType } from '../../types';

const tableCeil: string[] = [
  'Time',
  'Deactivated Time',
  'Name',
  'Severity',
  'Error Code',
  'Activation',
];
const tableHeader: string[] = [
  'time',
  'deactivatedTime',
  'name',
  'severity',
  'errorCode',
  'activation',
];

const Troubleshooting = () => {
  dayjs.extend(utc);
  const [events, setEvents] = useState<EventType[]>([]);
  const startDateTime = useAppSelector((state) => state.dashboard.startDateTime);
  const endDateTime = useAppSelector((state) => state.dashboard.endDateTime);
  const utcTimestamp = {
    gte: stringToUTCTimestamp(startDateTime.date, startDateTime.time) || 0,
    lte: stringToUTCTimestamp(endDateTime.date, endDateTime.time) || 0,
  };
  const { data } = useQuery<EventType[], Error>(
    ['eventsByTime', startDateTime, endDateTime],
    () => getEventByTime(utcTimestamp),
    {
      refetchInterval: 1000,
      keepPreviousData: true,
      suspense: true,
    },
  );
  const formattedData = useMemo(() => {
    if (data) {
      return data.map((item: EventType) => {
        const {
          _id: { $oid },
          timestamp: { $date },
          deactivate_timestamp,
          name,
          severity,
          error_code,
          activation,
        } = item;
        return {
          ...item,
          id: $oid,
          time: dayjs.utc($date).format('YYYY-MM-DD HH:mm:ss'),
          deactivatedTime: deactivate_timestamp
            ? dayjs(new Date(deactivate_timestamp.$date))
                .format('YYYY/MM/DD HH:mm:ss')
                .toString()
            : '',
          name,
          severity,
          errorCode: error_code,
          activation: activation.toString(),
        };
      });
    }
    return [];
  }, [data]);

  useEffect(() => {
    setEvents(formattedData);
  }, [formattedData]);

  const extractErrorCode = () => {
    // get unique error code and count them
    const errorCode = events.map((el) => {
      return el.error_code;
    });
    const uniqueErrorCode = errorCode.filter((el, index, arr) => {
      return arr.indexOf(el) === index;
    });
    const countErrorCode = uniqueErrorCode
      .map((el) => {
        return [el, errorCode.filter((x) => x === el).length];
      })
      .sort((a, b) => {
        return b[1] - a[1];
      });
    return { errorCode, uniqueErrorCode, countErrorCode };
  };

  const eventErrorName = () => {
    const { countErrorCode } = extractErrorCode();
    const errorNameForUniqueErrorCode = countErrorCode.map((el) => {
      return events.filter((x) => x.error_code === el[0])[0].name;
    });
    return errorNameForUniqueErrorCode;
  };

  return (
    <Panel>
      <div className="relative flex h-full w-full flex-col gap-1">
        <div className="h-1/2 w-full">
          <section className="h-full w-full">
            <PeratoChart
              eventData={extractErrorCode().countErrorCode}
              eventErrorName={eventErrorName()}
              hasEvent={events.length > 0}
            />
          </section>
        </div>
        <div className="h-1/2 w-full">
          {isFeatureEnabled('LIQUID_FEATURE') ? (
            <section className="flex h-4/5 border-2">
              <LiquidChart chartWidth="100%" chartHeight="100%" data={30} />
              <LiquidChart chartWidth="100%" chartHeight="100%" data={60} />
              <LiquidChart chartWidth="100%" chartHeight="100%" data={90} />
            </section>
          ) : null}
          <DashboardTable
            hasEvent={events.length > 0}
            tableCeil={tableCeil}
            tableData={events}
            tableHeader={tableHeader}
            page="troubleshooting"
          />
        </div>
      </div>
    </Panel>
  );
};

export default Troubleshooting;

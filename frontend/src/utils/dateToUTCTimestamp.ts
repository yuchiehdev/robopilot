import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';

const dateToUTCTimestamp = (date: Date, time: string) => {
  dayjs.extend(customParseFormat);
  dayjs.extend(utc);
  dayjs.utc();
  const utcDate = dayjs.utc(date);
  const utcTime = dayjs.utc(time, 'h:mm A');

  const combinedDateTime = utcDate
    .set('hour', utcTime.hour())
    .set('minute', utcTime.minute())
    .set('second', utcTime.second());
  return Math.round(dayjs(combinedDateTime.toISOString()).valueOf() / 1000);
};

const stringToUTCTimestamp = (dateString: string, timeString: string) => {
  dayjs.extend(utc);
  const dateTimeString = `${dateString} ${timeString}`;

  const isoString = dayjs.utc(dateTimeString, 'YYYY-MM-DD hh:mm A').toISOString();
  const utcTimestamp = Math.round(dayjs(isoString).valueOf() / 1000);
  return utcTimestamp;
};

const fullStringToUTCTimestamp = (dateTimeString: string) => {
  dayjs.extend(utc);
  const utcTimestamp = Math.round(
    dayjs.utc(dateTimeString, 'YYYY-MM-DD HH:mm:ss').valueOf() / 1000,
  );
  return utcTimestamp;
};

export default dateToUTCTimestamp;
export { stringToUTCTimestamp, fullStringToUTCTimestamp };

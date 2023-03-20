import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';

const dateToUTCTimestamp = (date: Date, time: string) => {
  dayjs.extend(customParseFormat);
  dayjs.extend(utc);
  dayjs.utc();
  const utcDate = dayjs(date).utc();
  const utcTime = dayjs(time, 'h:mm A').utc();

  const combinedDateTime = utcDate
    .set('hour', utcTime.hour())
    .set('minute', utcTime.minute())
    .set('second', utcTime.second());
  return Math.round(dayjs(combinedDateTime).valueOf() / 1000);
};

const stringToUTCTimestamp = (dateString: string, timeString: string) => {
  dayjs.extend(utc);
  const dateTimeString = `${dateString} ${timeString}`;
  // const utcTimestamp = Math.round(dayjs.utc(dateTimeString).valueOf() / 1000);
  const isoString = dayjs.utc(dateTimeString, 'YYYY-MM-DD hh:mm A').toISOString();
  const utcTimestamp = Math.round(dayjs(isoString).valueOf() / 1000);
  return utcTimestamp;
};

export default dateToUTCTimestamp;
export { stringToUTCTimestamp };

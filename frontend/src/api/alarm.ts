import { FETCH_ALARM_URL } from '../data/fetchUrl';

export const getAlarm = async () => {
  const response = await fetch(FETCH_ALARM_URL);
  return response.json();
};

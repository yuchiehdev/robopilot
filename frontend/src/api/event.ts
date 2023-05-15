import { FETCH_EVENT_URL } from '../data/fetchUrl';

type timeType = {
  gte: number;
  lte: number;
};

export const getEvent = async () => {
  const url = new URL(FETCH_EVENT_URL);
  url.searchParams.append('activation', 'false');
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const data = await response.json();
    return data;
  } catch (err) {
    throw new Error('Failed to fetch data');
  }
};

export const getEventByTime = async (time: timeType) => {
  try {
    const url = new URL(FETCH_EVENT_URL);
    url.searchParams.append('activation', 'false');
    url.searchParams.append('gte', time.gte.toString());
    url.searchParams.append('lte', time.lte.toString());
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const data = await response.json();
    return data;
  } catch (err) {
    throw new Error('Failed to fetch data');
  }
};

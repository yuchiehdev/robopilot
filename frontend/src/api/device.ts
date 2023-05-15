import {
  FETCH_DEVICE_URL,
  FETCH_DEVICE_STATUS_URL,
  DEVICE_SETTING_URL,
} from '../data/fetchUrl';

type timeType = {
  gte: number;
  lte: number;
};

export const getDevice = async () => {
  const response = await fetch(FETCH_DEVICE_URL);
  return response.json();
};

export const getDeviceStatus = async () => {
  const response = await fetch(FETCH_DEVICE_STATUS_URL);
  return response.json();
};

export const getDeviceSetting = async () => {
  const response = await fetch(DEVICE_SETTING_URL);
  return response.json();
};

export const getEventByTime = async (time: timeType) => {
  const response = await fetch(`${FETCH_DEVICE_URL}&gte=${time.gte}&lte=${time.lte}`);
  return response.json();
};

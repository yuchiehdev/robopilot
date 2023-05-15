import {
  RESOURCE,
  FETCH_PRODUCTION,
  STATUSCONTROL,
  apiEndpoints,
  withParams,
} from '../data/fetchUrl';

export const getResource = async () => {
  const response = await fetch(RESOURCE);
  return response.json();
};

export const getProduction = async () => {
  const url = new URL(FETCH_PRODUCTION);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    return await response.json();
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(`Fetch error: ${err.message}`);
    } else {
      throw err;
    }
  }
};

export const getFeeder = async (deviceName: string) => {
  const url = withParams(apiEndpoints.sensor, { device: deviceName });
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    return await response.json();
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(`Fetch error: ${err.message}`);
    } else {
      throw err;
    }
  }
};

export const getFeederA = async () => {
  const url = withParams(apiEndpoints.sensor, { device: 'device_kv8000_trayfeeder_A' });
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    return await response.json();
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(`Fetch error: ${err.message}`);
    } else {
      throw err;
    }
  }
};

export const getFeederB = async () => {
  const url = withParams(apiEndpoints.sensor, { device: 'device_kv8000_trayfeeder_B' });
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    return await response.json();
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(`Fetch error: ${err.message}`);
    } else {
      throw err;
    }
  }
};

export const getControlStatus = async () => {
  try {
    const response = await fetch(STATUSCONTROL);
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    return await response.json();
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(`Fetch error: ${err.message}`);
    } else {
      throw err;
    }
  }
};

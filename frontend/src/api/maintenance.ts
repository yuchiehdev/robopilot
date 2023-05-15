import { FETCH_MAINTENANCE, FETCH_ACTIVE_MAINTENANCE_URL } from '../data/fetchUrl';

export const getMaintenance = async () => {
  const response = await fetch(FETCH_MAINTENANCE);
  return response.json();
};

export const getActiveMaintenance = async () => {
  const response = await fetch(FETCH_ACTIVE_MAINTENANCE_URL);
  return response.json();
};

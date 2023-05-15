import { useQuery } from '@tanstack/react-query';
import { VALIDATE } from '../data/fetchUrl';

export const fetchValidate = async () => {
  const response = await fetch(VALIDATE, {
    headers: {
      'Content-Type': 'application/json',
      token: localStorage.getItem('JWToken') || '',
    },
  });

  const result = await response.json();

  if (response.status === 403 || response.status === 401) {
    localStorage.removeItem('JWToken');
    throw new Error('Unauthorized');
  }
  return result;
};

export const useAuth = () => {
  return useQuery(['validate'], fetchValidate, {
    retry: false,
  });
};

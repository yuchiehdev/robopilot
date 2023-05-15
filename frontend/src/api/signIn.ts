import { SIGN_IN } from '../data/fetchUrl';

type SignInData = {
  username: string;
  password: string;
};
export type SignInInput = {
  data: SignInData;
  mode: string;
};
export type SignInResponse = {
  username: string;
  company: string;
  department: string;
  employeeID: string;
  group: string;
  local: boolean;
  mail: string;
  name: string;
  password: null;
  permission: string;
  title: string;
  access_token: string;
  refresh_token: string;
  message: string;
};

export const signIn = async (input: SignInInput): Promise<SignInResponse> => {
  const response = await fetch(`${SIGN_IN}${input.mode}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input.data),
  });

  const result: SignInResponse = await response.json();
  if (response.status === 200) {
    localStorage.setItem('JWToken', result.access_token);
    localStorage.setItem('RefreshToken', result.refresh_token);
  } else {
    throw new Error(result.message);
  }

  return result;
};

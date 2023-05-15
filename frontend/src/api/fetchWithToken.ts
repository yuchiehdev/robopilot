export const fetchWithToken = async (
  url: string | URL,
  method: string,
  token: string | null,
  body?: any,
  queryParams?: any,
  headers: HeadersInit = {},
) => {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    token: token || '',
  };
  const urlParams = new URLSearchParams(queryParams);
  const fullUrl = `${url}?${urlParams.toString()}`;

  const requestOptions: {
    method: string;
    headers: HeadersInit;
    body?: string;
  } = {
    method,
    headers: { ...defaultHeaders, ...headers },
  };

  if (body) {
    requestOptions.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(fullUrl, requestOptions);
    return response;
  } catch (error: any) {
    console.log('Error:', error.message);
    throw error;
  }
};

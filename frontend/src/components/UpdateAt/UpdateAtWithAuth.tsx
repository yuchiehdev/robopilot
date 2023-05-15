import dayjs from 'dayjs';
import { useAuthenticatedQuery } from '../../hooks/useAuthenticatedQuery';

type UpdateAtProps = {
  queryKey: Array<string>;
  url: string;
  method: string;
  otherOptions?: Record<string, unknown>;
};

const UpdateAtWithAuth = ({ queryKey, url, method, otherOptions }: UpdateAtProps) => {
  const { dataUpdatedAt } = useAuthenticatedQuery<unknown[]>(
    queryKey,
    url,
    method,
    otherOptions,
  );

  return (
    <span className="dark:text-white">
      {dayjs(dataUpdatedAt).format('YYYY/MM/DD HH:mm:ss')}
    </span>
  );
};

export default UpdateAtWithAuth;

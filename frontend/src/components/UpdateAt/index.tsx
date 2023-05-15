import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';

type UpdateAtProps = {
  queryKey: Array<string>;
  queryFn: () => Promise<unknown[]>;
  refetchInterval: number;
};

const UpdateAt: React.FC<UpdateAtProps> = ({ queryKey, queryFn, refetchInterval }) => {
  const { dataUpdatedAt } = useQuery<unknown[], Error>({
    queryKey: [queryKey],
    queryFn,
    refetchInterval,
  });

  return (
    <span className="dark:text-white">
      {dayjs(dataUpdatedAt).format('YYYY/MM/DD HH:mm:ss')}
    </span>
  );
};

export default UpdateAt;

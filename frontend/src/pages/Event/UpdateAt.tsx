import dayjs from 'dayjs';

interface UpdateAtProps {
  dataUpdatedAt?: number;
}

const UpdateAt = ({ dataUpdatedAt }: UpdateAtProps) => {
  return (
    <span className="dark:text-white">
      {dayjs(dataUpdatedAt).format('YYYY/MM/DD HH:mm:ss')}
    </span>
  );
};

export default UpdateAt;

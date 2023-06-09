type NotificationProps = {
  count?: number;
};

const Notification: React.FC<NotificationProps> = ({ count }) => {
  return (
    <span
      className={`bg-red ${
        count
          ? `ml-4 flex items-center justify-center rounded-t-full rounded-r-full pr-0.5 text-center !text-white  ${
              count >= 100 ? 'h-7 w-7 text-xs font-medium' : 'h-6 w-6'
            }`
          : 'block h-3 w-3 rounded-full'
      }`}
    >
      {count}
    </span>
  );
};

export default Notification;

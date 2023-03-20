type TodayBoardProps = {
  complete: number;
  warning: number;
  alert: number;
  yieldRate: number;
  updateTime: string;
};

const TodayBoard: React.FC<TodayBoardProps> = (props) => {
  const { complete, warning, alert, yieldRate, updateTime } = props;

  return (
    <section className="flex h-[80%] flex-col justify-around px-4">
      <section className="flex items-end justify-between pl-4">
        <h1 className="text-end text-2xl font-bold">{complete + warning + alert}</h1>
        <h3 className="text-gray-160">total</h3>
      </section>
      <section className="flex items-end justify-between pl-4">
        <h1 className="text-end text-2xl  font-bold  text-wiwynn-green">{complete}</h1>
        <h3 className="text-gray-160">completed</h3>
      </section>
      <section className="flex items-end justify-between pl-4">
        <h1 className="text-end text-2xl  font-bold text-yellow">{warning}</h1>
        <h3 className="text-gray-160">warning</h3>
      </section>
      <section className="flex items-end justify-between pl-4">
        <h1 className="text-end text-2xl  font-bold text-red">{alert}</h1>
        <h3 className="text-gray-160">alert</h3>
      </section>
      <section className="flex items-end justify-between pl-4 text-wiwynn-blue">
        <h1 className="text-end text-2xl  font-bold ">{yieldRate * 100}%</h1>
        <h3 className="text-gray-160">yield</h3>
      </section>
      <p className="text-end text-xs text-gray-160">上次更新: {updateTime}</p>
    </section>
  );
};

export default TodayBoard;

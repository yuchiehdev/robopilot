type TrayPageProps = {
  isStart: boolean;
};

const TrayPage: React.FC<TrayPageProps> = ({ isStart }) => {
  return (
    <>
      <label htmlFor="area_1_range" className="flex w-full gap-2 font-semibold">
        <span className="w-2/3">area_1_range</span>
        <input
          disabled={!isStart}
          type="number"
          id="area_1_range"
          name="area_1_range"
          defaultValue={3923}
          className="w-1/3 rounded-md border-[1px] border-gray-180 px-1 accent-wiwynn-blue dark:accent-wiwynn-green"
        />
      </label>

      <label htmlFor="area_1_value" className="flex w-full gap-2 font-semibold">
        <span className="w-2/3">area_1_value</span>
        <input
          disabled={!isStart}
          type="number"
          id="area_1_value"
          name="area_1_value"
          defaultValue={32}
          className="w-1/3 rounded-md border-[1px] border-gray-180 px-1 accent-wiwynn-blue dark:accent-wiwynn-green"
        />
      </label>

      <label htmlFor="match_score_1" className="flex w-full gap-2 font-semibold">
        <span className="w-2/3">match_score_1</span>
        <input
          disabled={!isStart}
          type="number"
          id="match_score_1"
          name="match_score_1"
          defaultValue={32}
          className="w-1/3 rounded-md border-[1px] border-gray-180 px-1 accent-wiwynn-blue dark:accent-wiwynn-green"
        />
      </label>

      <label htmlFor="r_1_high" className="flex w-full gap-2 font-semibold">
        <span className="w-2/3">r_1_high</span>
        <input
          disabled={!isStart}
          type="number"
          id="r_1_high"
          name="r_1_high"
          defaultValue={32}
          className="w-1/3 rounded-md border-[1px] border-gray-180 px-1 accent-wiwynn-blue dark:accent-wiwynn-green"
        />
      </label>
    </>
  );
};

export default TrayPage;

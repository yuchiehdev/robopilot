export type SelectorInputs = {
  rows: number;
};

type SelectorProps = {
  viewRows: number;
  selectorOptions: number[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

const Selector: React.FC<SelectorProps> = (props) => {
  const { viewRows, selectorOptions, onChange } = props;

  const options = selectorOptions.map((option: number) => {
    return (
      <option key={option.toString()} value={option}>
        {option}
      </option>
    );
  });

  return (
    <form>
      <select
        className="rounded-md border border-gray-140 px-4 py-2 dark:bg-black-70"
        defaultValue={viewRows}
        onChange={onChange}
      >
        {options}
      </select>
    </form>
  );
};

export default Selector;

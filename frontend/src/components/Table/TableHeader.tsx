type SortByGenerics<T> = T;

export type TableHeaderItem = {
  name: string;
  sortBy: SortByGenerics<string>;
};

type TableHeaderProps = {
  item: TableHeaderItem;
  sortHandler: (name: string) => void;
  tdWidth?: object;
};

const TableHeader: React.FC<TableHeaderProps> = ({ item, sortHandler, tdWidth }) => {
  return (
    <th
      style={tdWidth}
      className="text-start text-sm leading-5 tracking-wide text-gray-220 dark:bg-gray-220 dark:text-light-60"
    >
      <button
        className="flex items-center"
        onClick={() => sortHandler(item.sortBy)}
        onTouchEnd={() => sortHandler(item.sortBy)}
      >
        <span>{item.name}</span>
      </button>
    </th>
  );
};

export default TableHeader;

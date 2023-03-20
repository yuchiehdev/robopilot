import { useRef, forwardRef, useImperativeHandle } from 'react';
import { useAppSelector } from '../../store';
import { ReactComponent as SearchIcon } from '../../assets/icons/magnifying-glass.svg';
import { ReactComponent as XmarkIcon } from '../../assets/icons/xmark.svg';

type SearchBarProps = {
  searchInput: string;
  ref?: React.ForwardedRef<unknown>;
  onClear: () => void;
  onChange: (data: React.ChangeEvent<HTMLInputElement>) => void;
};

const SearchBar: React.FC<SearchBarProps> = forwardRef((props, ref) => {
  const { searchInput, onChange, onClear } = props;
  const theme = useAppSelector((state) => state.user.theme);
  const innerRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    focus: () => {
      if (innerRef.current) {
        innerRef.current.focus();
      }
    },
  }));

  return (
    <>
      <form className="relative">
        <input
          className={`${
            searchInput ? 'w-60 pl-4 pr-16' : 'w-2'
          } relative h-8  rounded-full border-[0.1px] border-gray-100 pr-10 shadow-sm transition-all duration-500 focus:w-60 focus:pl-4 focus:outline-0  dark:bg-black-70 dark:text-light-60`}
          value={searchInput}
          onChange={onChange}
          ref={innerRef}
        />
      </form>

      {searchInput && (
        <XmarkIcon
          className="absolute top-2 right-10 w-3 cursor-pointer"
          fill={`${theme === 'light' ? '#999' : '#eee'}`}
          onClick={onClear}
        />
      )}

      <SearchIcon
        className="absolute top-2 right-3 w-4 cursor-pointer"
        fill={`${theme === 'light' ? '##d8d8d8' : '#eee'}`}
        onClick={() => innerRef.current?.focus()}
      />
    </>
  );
});

export default SearchBar;

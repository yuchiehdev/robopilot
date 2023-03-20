import { useAppSelector } from '../../store';
import { ReactComponent as ChevronIcon } from '../../assets/icons/chevron-up.svg';

const IconColor = '#979797';

export type PaginatorInputs = {
  newPage: number;
};

type PaginatorProps = {
  goPrev: () => void;
  goNext: () => void;
  jumpTo: (number: number) => void;
  currentPage: number;
  maxPage: number;
};

const Paginator: React.FC<PaginatorProps> = (props) => {
  const { goPrev, goNext, jumpTo, currentPage, maxPage } = props;
  const theme = useAppSelector((state) => state.user.theme);

  return (
    <section className="mx-14 flex items-center">
      <button className="h-6 w-6 rotate-[-90deg]" onClick={goPrev}>
        <ChevronIcon fill={theme === 'light' ? IconColor : '#fff'} />
      </button>
      <section className="mx-4 flex items-center text-gray-180 dark:text-light-100">
        <form>
          <input
            type="number"
            min={0}
            max={maxPage}
            value={currentPage}
            onChange={(e) => {
              jumpTo(Number(e.target.value));
            }}
            className="h-10 w-14 rounded-md border border-gray-140 pl-4 dark:bg-black-70"
          />
        </form>
        <p className="mx-4 text-xl">/</p>
        <p>{Math.ceil(maxPage)}</p>
      </section>
      <button className="h-6 w-6 rotate-90" onClick={goNext}>
        <ChevronIcon fill={theme === 'light' ? IconColor : '#fff'} />
      </button>
    </section>
  );
};

export default Paginator;

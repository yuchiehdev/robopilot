/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import { useClickOutsideSingle } from '../../hooks/useClickOutside';

type DDLProps = {
  selected: string;
  setSelected: (value: string) => void;
  listItems: string[];
  styleCSS?: string;
  icon?: React.ReactNode;
  arrowColor?: string;
  checked: boolean[];
  setChecked: (value: boolean[]) => void;
};

const DDL = ({
  selected,
  setSelected,
  listItems,
  styleCSS,
  icon,
  arrowColor,
  checked,
  setChecked,
}: DDLProps) => {
  const [isList, setIsList] = useState(false);

  const checkHandler = (key: number) => {
    const newChecked = checked.map((item, index) => {
      if (index === key) {
        return true;
      }
      return false;
    });
    setChecked(newChecked);
    setSelected(listItems[key]);
  };

  const clickHandler = () => setIsList(!isList);

  const { domNode } = useClickOutsideSingle<HTMLDivElement>(() => {
    setIsList(false);
  });

  return (
    <div className="relative" ref={domNode}>
      <div
        onClick={clickHandler}
        className={` ${
          isList ? 'bg-white' : null
        } ${styleCSS} flex cursor-pointer items-center justify-between rounded border leading-none`}
      >
        {icon}
        <span>{selected}</span>

        <div className="ml-3">
          <IoIosArrowDown size="15" color={arrowColor} />
        </div>
      </div>
      <div
        className={`transition-all duration-300 ${
          isList ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        } absolute right-0 z-10 mt-2 rounded-lg border border-[#F3F3F3] bg-white drop-shadow-md`}
      >
        {listItems.map((item, key) => {
          return (
            <div
              key={item}
              onClick={() => {
                checkHandler(key);
                setIsList(false);
              }}
              className="flex w-[90%] py-2 px-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex min-h-[1.2rem] min-w-[9.5rem] cursor-pointer items-center pl-3 hover:bg-[#F3F4F6]">
                    <div className="dark:bg-gray-800 dark:border-gray-700 relative flex h-3 w-3 flex-shrink-0 items-center justify-center rounded-sm border border-[#a0a0a0] bg-[#d2d2d2]">
                      <input
                        type="checkbox"
                        onChange={() => checkHandler(key)}
                        className="checkbox absolute h-full w-full cursor-pointer opacity-0"
                      />
                      <div
                        className={`check-icon rounded-sm border border-gray-220 bg-blue text-white ${
                          checked[key] ? 'flex' : 'hidden'
                        }`}
                      >
                        <svg
                          className="icon icon-tabler icon-tabler-check"
                          width={12}
                          height={12}
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" />
                          <path d="M5 12l5 5l10 -10" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-gray-800 ml-2 text-sm leading-normal">{item}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default DDL;

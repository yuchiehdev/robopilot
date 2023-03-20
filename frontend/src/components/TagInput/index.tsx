/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useRef, useEffect, useState, RefObject, SetStateAction } from 'react';
import './TagInput.scss';
import { BsSearch } from 'react-icons/bs';
import { RiDeleteBin5Fill } from 'react-icons/ri';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayjs from 'dayjs';
import DateInput from './DateInput';
import TimeInput from './TimeInput';

import Tag from './Tag';
import DDL from '../DropDownList/index';
import { useClickOutsideSingle } from '../../hooks/useClickOutside';
import type { tagObjType } from '../../pages/Event';
import RadioButton from '../RadioButton';

type tagInputProps = {
  dropdownItems: {
    name: string;
    sortBy: string;
  }[];
  tagObjs: tagObjType[];
  setTagObjs: (value: tagObjType[]) => void;
  forwardRef?: RefObject<HTMLInputElement>;
  statusItems?: string[];
};

const TagInput = ({
  dropdownItems,
  tagObjs,
  setTagObjs,
  forwardRef,
  statusItems,
}: tagInputProps) => {
  const listitems = dropdownItems.map((item) => item.name);
  const inputRef = useRef<HTMLInputElement>(null);
  const [selected, setSelected] = useState('Search All');
  const [checked, setChecked] = useState(
    Array(6)
      .fill(false)
      .concat(selected === listitems[listitems.length - 1] ? [true] : [false]),
  );

  dayjs.extend(customParseFormat);

  const [showDropdown, setShowDropdown] = useState(false);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState<string>(dayjs(Date.now()).format('h:mm A'));
  const [endTime, setEndTime] = useState<string>('11:59 PM');
  const [isList, setIsList] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>(
    statusItems ? statusItems[0] : '',
  );
  const [showRadio, setShowRadio] = useState(false);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isList, selected]);
  useEffect(() => {
    setIsList(false);
  }, [tagObjs]);

  useEffect(() => {
    if (selected === 'Time' || selected === 'Deactivated Time') {
      setShowDropdown(true);
    } else if (selected === 'Status') {
      setShowRadio(true);
    } else {
      setShowDropdown(false);
      setShowRadio(false);
    }
  }, [selected]);

  const { domNode }: any = useClickOutsideSingle(() => {
    setIsList(false);
  });

  const addTagWithKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // e.target is not garanteed to have value, so cast it to HTMLInputElement
      setTagObjs([
        ...tagObjs,
        { category: selected, input: (e.target as HTMLInputElement).value },
      ]);
      (e.target as HTMLInputElement).value = '';
      setIsList(false);
    }
  };
  const addTagWithButton = () => {
    if (selected === 'Time' || selected === 'Deactivated Time') {
      const startTimeObj = dayjs(startTime, 'h:mm A');
      const endTimeObj = dayjs(endTime, 'h:mm A');
      const startDateObj = dayjs(startDate);
      const endDateObj = dayjs(endDate);
      const startDateStr = startDateObj.format('YYYY-MM-DD');
      const endDateStr = endDateObj.format('YYYY-MM-DD');
      const startTimeStr = startTimeObj.format('h:mm A');
      const endTimeStr = endTimeObj.format('h:mm A');
      const start = `${startDateStr} ${startTimeStr}`;
      const end = `${endDateStr} ${endTimeStr}`;
      setTagObjs([...tagObjs, { category: selected, input: `${start} - ${end}` }]);
      setIsList(false);
    } else if (selected === 'Status') {
      setTagObjs([...tagObjs, { category: selected, input: selectedStatus }]);
      setIsList(false);
    } else {
      const input = inputRef.current?.value;
      if (input) {
        setTagObjs([...tagObjs, { category: selected, input }]);
        setIsList(false);
        inputRef.current.value = '';
      }
    }
  };
  const removeTag = (removedTag: tagObjType) => {
    const newTagObjs = tagObjs.filter((tagObj) => tagObj !== removedTag);
    setTagObjs(newTagObjs);
    setIsList(false);
  };
  const clearAllTagsHandler = () => {
    setTagObjs([]);
    setIsList(false);
  };
  const radioChangeHandler = (e: { target: { value: SetStateAction<string> } }) => {
    console.log(e.target.value);
    setSelectedStatus(e.target.value);
  };

  return (
    <div className="relative w-full">
      <div className="flex w-full grow items-center">
        <div
          className={`tagInputWrapper h-full w-[94%] border-2 hover:cursor-pointer ${
            isList ? 'border-[#616161]' : 'border-[#e9e8e8]'
          }`}
          onClick={() => setIsList(!isList)}
        >
          <BsSearch className="tagInputIcon" fill="#576476" />
          <ul className="tagsList">
            {tagObjs.map((tagObj, index) => {
              // eslint-disable-next-line react/no-array-index-key
              return <Tag tag={tagObj} key={index} remove={removeTag} />;
            })}
          </ul>
          <input
            onClick={() => setIsList(!isList)}
            className="tagInput bg-white  hover:cursor-pointer"
            placeholder="Search with a tag..."
            readOnly
          />
        </div>
        <button className="trash ml-[1%] h-full w-[5%] py-2">
          <RiDeleteBin5Fill fill="#7A8799" onClick={clearAllTagsHandler} size={20} />
        </button>
      </div>
      <section
        ref={domNode}
        className={`transition-all duration-100 ${
          isList ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        } ddlSection absolute right-0 z-10 mt-2 w-full rounded-2xl bg-white py-3 shadow-xl`}
      >
        <div className="mb-2 flex flex-wrap items-start gap-14 p-3 pl-8">
          <DDL
            setSelected={setSelected}
            selected={selected}
            listitems={listitems}
            styleCSS="py-[0.6rem] px-3 text-base font-semibold mr-2 bg-[#4171FF] border-[#4171FF] text-white min-w-[12rem]"
            forwardRef={forwardRef}
            checked={checked}
            setChecked={setChecked}
          />
          {showDropdown ? (
            <div className="mb-8 flex max-w-[25rem] flex-col gap-4">
              <DateInput
                startDate={startDate}
                endDate={endDate}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                width="px-8"
              />
              <TimeInput
                startTime={startTime}
                setStartTime={setStartTime}
                endTime={endTime}
                setEndTime={setEndTime}
                width="px-8"
              />
            </div>
          ) : showRadio ? (
            statusItems
              ?.slice(0, -1)
              .map((item, index) => (
                <RadioButton
                  changed={radioChangeHandler}
                  id={String(index)}
                  isSelected={selectedStatus === item}
                  label={item}
                  value={item}
                />
              ))
          ) : (
            <input
              autoComplete="off"
              onKeyDown={addTagWithKeyDown}
              name="tagInput"
              className="tagInput text-lg focus-within:outline-none"
              placeholder="Search..."
              ref={inputRef}
            />
          )}
        </div>
        <div className="line"> </div>
        <div className="flex h-[3.5rem] w-full items-end justify-center gap-2">
          <button
            className="text-md rounded-md bg-[#F6F6F6] px-4 py-2 font-semibold"
            onClick={() => setIsList(false)}
          >
            Cancel
          </button>
          <button
            className="text-md rounded-md bg-[#2173F2] px-4 py-2 font-semibold text-white"
            onClick={addTagWithButton}
          >
            Search
          </button>
        </div>
      </section>
    </div>
  );
};

export default TagInput;

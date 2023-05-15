/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-unused-expressions */
import React, { useState, useEffect } from 'react';
import './select.scss';

export type SelectOption = {
  value: string | null;
  label: string;
};

type SingleSelectProps = {
  multiple?: false;
  value?: any;
  onChange: (value: SelectOption) => void;
  style?: React.CSSProperties;
};

export type SelectProps = {
  options: SelectOption[];
} & SingleSelectProps;

type RefType = HTMLDivElement;

const Select = React.forwardRef<RefType, SelectProps>(
  ({ multiple, onChange, options, value = options[0], style }: SelectProps, ref: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const [highlighted, setHighlighted] = useState(0);
    useEffect(() => {
      if (!multiple) {
        if (value === undefined || value === 'Please select') {
          onChange(options[0]);
        }
      }
    });

    useEffect(() => {
      if (isOpen) setHighlighted(0);
    }, [isOpen]);

    useEffect(() => {
      const containerRef = ref?.current;
      const handler = (e: KeyboardEvent) => {
        if (e.target !== containerRef) return;
        switch (e.code) {
          case 'Enter':
          case 'Space':
            setIsOpen((pre) => !pre);
            if (isOpen) {
              onChange(options[highlighted]);
              setIsOpen(false);
            }
            break;
          case 'ArrowUp':
            setHighlighted((pre) => (pre === 0 ? options.length - 1 : pre - 1));
            break;
          case 'ArrowDown':
            if (!isOpen) setIsOpen(true);
            setHighlighted((pre) => (pre === options.length - 1 ? 0 : pre + 1));
            break;
          case 'Escape':
            setIsOpen(false);
            break;
          default:
            break;
        }
      };
      containerRef?.addEventListener('keydown', handler);
      return () => containerRef?.removeEventListener('keydown', handler);
    }, [isOpen, highlighted, options]);

    return (
      <div
        ref={ref}
        tabIndex={0}
        style={style}
        className="relative flex items-center gap-[0.5em] rounded-[0.25em] border-[0.13em] border-[#dadce4] bg-white py-[0.4rem] px-[1rem] hover:cursor-pointer focus:border-wiwynn-blue focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setIsOpen(false)}
      >
        <span className="mr-2 flex grow flex-wrap gap-2">{value?.label}</span>
        <div className="w-[.05em] self-stretch bg-[#777]"> </div>
        <div className="translate-y-1/4 border-[.25em] border-transparent border-t-[#777]">
          {' '}
        </div>
        <ul
          className={`options m-h-[15em] absolute left-0 z-10 m-0 w-full list-none overflow-y-auto rounded-[.25em] bg-white p-0 drop-shadow-xl
      ${isOpen ? 'block' : 'hidden'}`}
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              className={`py-[.25em] px-[.5em] hover:cursor-pointer ${
                index === highlighted ? 'bg-[#dadce4]' : ''
              }`}
              onClick={(e) => {
                e.stopPropagation();
                onChange(option);
                setIsOpen(false);
              }}
              onMouseEnter={() => setHighlighted(options.indexOf(option))}
            >
              {option.label}
            </li>
          ))}
        </ul>
      </div>
    );
  },
);

export default Select;

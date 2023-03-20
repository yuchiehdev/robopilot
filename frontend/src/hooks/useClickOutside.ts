import { useRef, useEffect } from 'react';

const useClickOutside = (handler: () => void) => {
  const domNode1 = useRef<HTMLDivElement>(null);
  const domNode2 = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      domNode1.current &&
      !domNode1.current.contains(event.target as Node) &&
      domNode2.current &&
      !domNode2.current.contains(event.target as Node)
    ) {
      handler();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });

  return { domNode1, domNode2 };
};

const useClickOutsideSingle = (handler: () => void) => {
  const domNode = useRef<HTMLDivElement>(null);
  const handleClickOutside = (event: MouseEvent) => {
    if (domNode.current && !domNode.current.contains(event.target as Node)) {
      handler();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });

  return { domNode };
};

const useClickOutsidePicker = (handler: () => void) => {
  const domNode = useRef<HTMLDivElement>(null);
  const handleClickOutside = (event: MouseEvent) => {
    //  if event target class start with 'react-datepicker' then do not close the picker
    if (
      (event.target &&
        (event.target as HTMLElement).className &&
        !(event.target as HTMLElement).className.startsWith('react-datepicker')) ||
      !(event.target as HTMLElement).className.startsWith('rc-time-picker')
    ) {
      handler();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });

  return { domNode };
};

export { useClickOutsideSingle, useClickOutsidePicker };

export default useClickOutside;

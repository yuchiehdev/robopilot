import { useState } from 'react';

const useTooltip = (dataLength: number) => {
  const [tooltipVisible, setTooltipVisible] = useState(Array(dataLength).fill(false));
  let timer: any | null = null;
  const TIMEOUT = 100;

  const mouseEnter = (index: number) => {
    timer = setTimeout(() => {
      setTooltipVisible(() => {
        const newState = Array(dataLength).fill(false);
        newState[index] = true;
        return newState;
      });
    }, TIMEOUT);
  };

  const mouseLeave = (index: number) => {
    setTooltipVisible((prev) => {
      const newState = [...prev];
      newState[index] = false;
      return newState;
    });
    clearTimeout(timer);
  };

  return { tooltipVisible, mouseEnter, mouseLeave };
};

export default useTooltip;

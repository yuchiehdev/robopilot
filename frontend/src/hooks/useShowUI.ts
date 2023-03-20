import { useState, useRef, useEffect } from 'react';

const useShowUI = (show: boolean, outDelay = 1000) => {
  const [layoutToShow, setLayoutToShow] = useState(show);
  const timeoutRef = useRef<null | ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (show) {
      setLayoutToShow(false);
      timeoutRef.current = setTimeout(() => setLayoutToShow(true));
    } else {
      setLayoutToShow(true);
      timeoutRef.current = setTimeout(() => setLayoutToShow(false), outDelay);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = null;
    };
  }, [show, outDelay]);

  return show ? [layoutToShow, show] : [show, layoutToShow];
};

export default useShowUI;

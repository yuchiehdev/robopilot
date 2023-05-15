import { useRef, useEffect, useCallback } from 'react';

const useClickOutside = <T1 extends HTMLElement, T2 extends HTMLElement>(
  handler: () => void,
) => {
  const domNode1 = useRef<T1>(null);
  const domNode2 = useRef<T2>(null);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        domNode1.current &&
        !domNode1.current.contains(event.target as Node) &&
        domNode2.current &&
        !domNode2.current.contains(event.target as Node)
      ) {
        handler();
      }
    },
    [handler],
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  return { domNode1, domNode2 };
};

const useClickOutsideSingle = <T extends HTMLElement>(handler: () => void) => {
  const domNode = useRef<T>(null);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (domNode.current && !domNode.current.contains(event.target as Node)) {
        handler();
      }
    },
    [handler],
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  return { domNode };
};

export { useClickOutsideSingle };

export default useClickOutside;

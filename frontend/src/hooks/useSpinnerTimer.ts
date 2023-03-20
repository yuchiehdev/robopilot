import { useState } from 'react';

const useSpinnerTimer = (second: number) => {
  const [showSpinner, setShowSpinner] = useState(false);

  setTimeout(() => {
    setShowSpinner(false);
  }, second * 1000);

  return { showSpinner, setShowSpinner };
};

export default useSpinnerTimer;

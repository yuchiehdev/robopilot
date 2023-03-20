import React from 'react';

import { FiTarget } from 'react-icons/fi';

const KeyIndicator2 = ({ title, value }: { title: string; value: number }) => {
  return (
    <div className="flex w-1/2 flex-col items-center justify-center gap-1">
      <div className="flex items-center gap-2">
        <FiTarget className="text-sm text-red" />
        <span className="text-[#aaa9ac]">{title}</span>
      </div>
      <span className="text-2xl font-extrabold">{value}</span>
    </div>
  );
};

export default KeyIndicator2;

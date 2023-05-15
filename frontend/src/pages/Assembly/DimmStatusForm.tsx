/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-array-index-key */
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { DimmFeederType } from '../../types';
import { getProduction } from '../../api/assembly';
import NoData from '../../components/IconText';

const processArray = (binaryArray: string[]) => {
  if (binaryArray.length !== 16) {
    throw new Error('binaryArray length must be 16');
  }
  const result: boolean[] = [];
  binaryArray.forEach((item) => {
    if (item === '1') {
      result.push(true);
    } else {
      result.push(false);
    }
  });
  return result;
};

const passRate = (boolArray: boolean[]) => {
  const pass = boolArray.filter((item) => item === true).length;
  const percentage = (pass / boolArray.length) * 100;
  return percentage;
};

const DimmStatusForm = ({ status }: { status: string[] }) => {
  const [isExpanded, setIsExpanded] = useState(Array(16).fill(false));
  const { data } = useQuery({
    queryKey: ['production'],
    queryFn: () => getProduction(),
  });
  const handleTdClick = (index: number) => {
    setIsExpanded((prev) => {
      const copy = [...prev];
      copy[index] = !copy[index];
      return copy;
    });
  };
  const dimmStatus = [...(data?.dimmfeeder_A ?? []), ...(data?.dimmfeeder_B ?? [])];
  return (
    <>
      <section className="absolute right-[5%] top-4 flex rounded-md border-2 border-wiwynn-blue">
        <h5 className="border-r-2 border-wiwynn-blue bg-wiwynn-blue px-2 font-semibold text-white">
          Pass Rate
        </h5>
        <h5 className="px-2 font-medium text-wiwynn-blue dark:bg-white">
          {passRate(processArray(status))}%
        </h5>
      </section>

      <section className="relative mt-4 h-[90%] w-full overflow-y-auto">
        <table className="relative mx-auto mb-8 w-11/12">
          <thead className="sticky top-[-1px] z-20">
            <tr className="border-2 border-table-border bg-table-bg text-table-font">
              {['Group', 'Loc.', 'CSN', 'Status'].map((item) => (
                <th
                  key={item}
                  className="px-1 py-1 text-center text-sm leading-5 tracking-wide text-gray-220 dark:bg-gray-220 dark:text-light-60"
                >
                  {item}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="relative z-10 text-center text-xs">
            {/* show no data when data is empty */}
            {!(dimmStatus.length > 0) ? (
              <tr className="absolute top-0 left-0 z-10 flex h-[95%] w-full items-center justify-center bg-[rgba(255,255,255,0.8)]">
                <td colSpan={5}>
                  <NoData
                    text="No Data"
                    color="text-[#676668]"
                    width="w-14"
                    description={{
                      firstLine: 'Looks like there are no data here yet.',
                      secondLine: 'Try to start production to see the current data.',
                    }}
                    gap="mt-[20rem] mb-4"
                    textSize="text-3xl"
                  />
                </td>
              </tr>
            ) : null}

            {dimmStatus.map((item: DimmFeederType, index: number) => {
              return (
                <tr
                  key={`${item?.code}-${index}`}
                  className="event-row border-2 border-table-border text-sm leading-6 dark:border-gray-200 dark:text-light-100  dark:hover:text-white"
                >
                  {index % 2 === 0 && (
                    <td rowSpan={2} className="border-r-[1px] border-table-border">
                      {index / 2 + 1}
                    </td>
                  )}
                  <td className="border-r-[1px] border-table-border">{index + 1}</td>
                  <td
                    onClick={handleTdClick.bind(null, index)}
                    className={`max-w-[15rem] overflow-hidden hover:cursor-pointer ${
                      isExpanded[index]
                        ? 'break-words'
                        : 'text-ellipsis whitespace-nowrap'
                    } px-1 text-start`}
                  >
                    {item?.code}
                  </td>
                  {index % 2 === 0 &&
                    (status[index / 2] === '-1' ? (
                      <td
                        rowSpan={2}
                        className="border-b-[1px] bg-[#e9e9e9] px-1 text-center dark:text-black-70"
                      >
                        INSTALL
                      </td>
                    ) : (
                      <td
                        className={`border-b-[1px] px-1 text-center dark:text-black-70 ${
                          processArray(status)[index / 2]
                            ? 'bg-green-transparent'
                            : 'bg-red-transparent'
                        }`}
                        rowSpan={2}
                      >
                        {processArray(status)[index / 2] ? 'READY' : 'NG'}
                      </td>
                    ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </>
  );
};

export default DimmStatusForm;

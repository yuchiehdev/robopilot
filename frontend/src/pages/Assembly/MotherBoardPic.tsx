import React, { useState } from 'react';
import boardImage from '../../assets/board-image2.jpg';
import {
  bulbPositions,
  builbBPositions,
  linePositions,
  lineBPositions,
} from '../../data/constant';

type BulbColorType = {
  [key: string]: string;
};

const BULB_COLOR: BulbColorType = {
  '-1': 'bg-gray-60 dark:text-black',
  '0': 'bg-red text-white',
  '1': 'bg-[#ABDC7A]',
};

const renderBulbElement = (
  top: string,
  left: string,
  leftLine: string,
  status: string,
  index: number,
) => {
  return (
    <React.Fragment key={index}>
      <p
        style={{ top: `${top}%`, left: `${left}%` }}
        className={`absolute z-10 flex h-6 w-[4.35%] items-center justify-center rounded-sm text-lg ${BULB_COLOR[status]}`}
      >
        {index}
      </p>
      <span
        style={{
          top: `${top === '7' ? Number(top) + 3 : Number(top) - 3}%`,
          left: `${leftLine}%`,
        }}
        className={`absolute z-0 h-6 w-[4%] border-4 ${
          top === '7' ? 'border-b-0' : 'border-t-0'
        } border-yellow-dark`}
      >
        {null}
      </span>
    </React.Fragment>
  );
};

const MotherBoardPic = ({ dimmStatus }: { dimmStatus: string[] }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <section className="relative flex items-center py-4">
      <img
        src={boardImage}
        loading="lazy"
        alt="main"
        className="relative mx-auto max-h-80 w-full overflow-hidden"
        onLoad={handleImageLoad}
      />
      {imageLoaded && (
        <>
          <section>
            {dimmStatus
              .slice(0, 4)
              .map((status, index) =>
                renderBulbElement(
                  '7',
                  bulbPositions[index],
                  linePositions[index],
                  status,
                  index + 1,
                ),
              )}
            {dimmStatus
              .slice(4, 8)
              .map((status, index) =>
                renderBulbElement(
                  '7',
                  bulbPositions[index + 4],
                  linePositions[index + 4],
                  status,
                  index + 5,
                ),
              )}
          </section>

          <section>
            {dimmStatus
              .slice(8, 12)
              .map((status, index) =>
                renderBulbElement(
                  '85',
                  builbBPositions[index],
                  lineBPositions[index],
                  status,
                  index + 9,
                ),
              )}

            {dimmStatus
              .slice(12, 16)
              .map((status, index) =>
                renderBulbElement(
                  '85',
                  builbBPositions[index + 4],
                  lineBPositions[index + 4],
                  status,
                  index + 13,
                ),
              )}
          </section>
        </>
      )}
    </section>
  );
};

export default MotherBoardPic;

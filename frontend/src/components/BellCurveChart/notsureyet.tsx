// import { useEffect, useState } from 'react';

const Normal = () => {
  // const [bellMean, setBellMean] = useState<number>(12.2036); // example
  // const [bellStdev, setBellStdev] = useState<number>(0.0008); // example
  // const [bellXValues, setBellXValues] = useState<number[]>([]);
  // const [bellYValues, setBellYValues] = useState<(number | null)[]>([]);

  // useEffect(() => {
  //   // defining chart limits between which the graph will be plotted
  //   const lcl = bellMean - bellStdev * 6;
  //   const ucl = bellMean + bellStdev * 6;

  //   const ticks = [lcl];
  //   const steps = 100; // steps corresponds to the size of the output array
  //   const stepSize = Math.round(((ucl - lcl) / steps) * 10000) / 10000;
  //   let tickVal = lcl;

  //   for (let i = 0; i <= steps; i++) {
  //     ticks.push(Math.round(tickVal * 10000) / 10000); // rounding off to 4 decimal places
  //     tickVal += stepSize;
  //   }
  //   setBellXValues(ticks); // array for X values
  // }, [bellMean, bellStdev]);

  // useEffect(() => {
  //   // Using PDF function from vega-statistics instead of importing the whole library
  //   const densityNormal = (value: number, mean: number, stdev: number) => {
  //     const SQRT2PI = Math.sqrt(2 * Math.PI);
  //     stdev = stdev == null ? 1 : stdev;
  //     const z = (value - (mean || 0)) / stdev;
  //     return Math.exp(-0.5 * z * z) / (stdev * SQRT2PI);
  //   };

  //   const YValues = bellXValues.map((item: number) => {
  //     if (bellMean === null || bellStdev === undefined) {
  //       return null;
  //     } else {
  //       const pdfValue = densityNormal(item, bellMean, bellStdev);
  //       return pdfValue === Infinity ? null : pdfValue;d
  //     }
  //   });
  //   setBellYValues(YValues); // array for Y values
  // }, [bellXValues]);
  return <div>from stack overflow has not try yet</div>;
  // https://stackoverflow.com/questions/38313968/creating-a-normal-distribution-graph-with-chart-js
};

export default Normal;

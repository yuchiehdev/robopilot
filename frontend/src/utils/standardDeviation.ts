const deviation = (arr: number[]) => {
  // Calculating the average of the array
  const mean =
    arr.reduce((acc: number, curr: number) => {
      return acc + curr;
    }, 0) / arr.length;

  // Calculating the variance of the array
  arr = arr.map((k) => {
    return (k - mean) ** 2;
  });

  // Calculating the sum of updated array
  const sum = arr.reduce((acc, curr) => acc + curr, 0);

  // Returning the standard deviation
  return Math.sqrt(sum / arr.length);
};

const mean = (arr: number[]) => {
  return (
    arr.reduce((acc: number, curr: number) => {
      return acc + curr;
    }, 0) / arr.length
  );
};

export default deviation;
export { mean };

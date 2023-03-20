// CPK值計算公式 : CPK = min(USL - μ, μ - LSL) / 3σ

const cpk = (data: number[]): number => {
  // Find the mean and standard deviation of the data array
  const n = data.length;
  const mean = data.reduce((sum, x) => sum + x, 0) / n;
  const stdDev = Math.sqrt(data.reduce((sum, x) => sum + (x - mean) ** 2, 0) / (n - 1));

  // Find the upper and lower specification limits
  const upperLimit = mean + 3 * stdDev;
  const lowerLimit = mean - 3 * stdDev;

  // Calculate the process mean and process standard deviation
  const processMean = data.reduce((sum, x) => sum + x, 0) / n;
  const processStdDev = Math.sqrt(
    data.reduce((sum, x) => sum + (x - processMean) ** 2, 0) / (n - 1),
  );

  const cpkValue =
    Math.round(
      Math.min(
        (upperLimit - processMean) / (3 * processStdDev),
        (processMean - lowerLimit) / (3 * processStdDev),
      ) * 100,
    ) / 100;

  return cpkValue;
};

export default cpk;

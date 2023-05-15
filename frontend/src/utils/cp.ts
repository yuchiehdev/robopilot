// CP 值計算公式 : CP = (USL - LSL) / (6 * sigma)
// 一般而言，USL 跟 LSL 會由人員提供，這裡設定如果沒有提供，則會自動取得資料中的最大值及最小值

const cp = (data: number[], upperLimit?: number, lowerLimit?: number): number => {
  // Calculate the sample mean and sample standard deviation
  const n = data.length;
  const mean = data.reduce((sum, x) => sum + x, 0) / n;
  const stdDev = Math.sqrt(data.reduce((sum, x) => sum + (x - mean) ** 2, 0) / (n - 1));

  const upper = upperLimit || Math.max(...data);
  const lower = lowerLimit || Math.min(...data);

  // Calculate the CP value using the formula
  const cpValue = Math.round(((upper - lower) / (6 * stdDev)) * 100) / 100;

  return cpValue;
};

export default cp;

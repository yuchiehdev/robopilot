const convertToBinary = (num: number): [string, string, string, string] => {
  if (num === -1) return ['-1', '-1', '-1', '-1'];
  const binary = num.toString(2).padStart(4, '0');
  const [a, b, c, d] = binary.split('');
  return [a, b, c, d];
};

export default convertToBinary;

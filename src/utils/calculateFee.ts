const calculateFee = (amount: number): number => {
  if (amount <= 100) return 2;
  if (amount <= 500) return 5;
  if (amount <= 1000) return 10;
  return 15;
};

export default calculateFee;

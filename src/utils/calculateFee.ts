const getNetworkGroup = (phone: string): string => {
  const prefix = phone.replace(/^\+260/, '').substring(0, 2);
  if (['96', '76'].includes(prefix)) return 'MTN';
  if (['97', '77'].includes(prefix)) return 'AIRTEL';
  if (['95', '75'].includes(prefix)) return 'ZAMTEL';
  return 'UNKNOWN';
};

export const isSameNetwork = (phone1: string, phone2: string): boolean => {
  return getNetworkGroup(phone1) === getNetworkGroup(phone2);
};

const calculateFee = (amount: number, crossNetwork: boolean = false): number => {
  // Same-network fee table
  if (!crossNetwork) {
    if (amount <= 100) return 2;
    if (amount <= 500) return 5;
    if (amount <= 1000) return 10;
    return 15;
  }

  // Cross-network fee table (higher fees)
  if (amount <= 100) return 3;
  if (amount <= 500) return 7;
  if (amount <= 1000) return 12;
  return 20;
};

export default calculateFee;

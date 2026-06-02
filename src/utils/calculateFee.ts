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
  if (crossNetwork) {
    if (amount <= 150)  return 2.40;
    if (amount <= 300)  return 4.90;
    if (amount <= 500)  return 9.90;
    if (amount <= 1000) return 19.90;
    if (amount <= 3000) return 29.90;
    if (amount <= 5000) return 28.90;
    return 69.80;
  } else {
    if (amount <= 150)  return 1.50;
    if (amount <= 300)  return 1.70;
    if (amount <= 500)  return 2.00;
    if (amount <= 1000) return 2.10;
    if (amount <= 3000) return 7.10;
    if (amount <= 5000) return 8.10;
    return 9.10;
  }
};

export default calculateFee;

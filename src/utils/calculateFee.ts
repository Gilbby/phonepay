const getNetworkGroup = (phone: string): string => {
  const cleaned = phone.replace(/^\+260/, '').replace(/^0/, '');
  const prefix = cleaned.substring(0, 2);
  if (['96', '76'].includes(prefix)) return 'MTN';
  if (['97', '77'].includes(prefix)) return 'AIRTEL';
  if (['95', '75'].includes(prefix)) return 'ZAMTEL';
  return 'UNKNOWN';
};

export const isSameNetwork = (phone1: string, phone2: string): boolean => {
  return getNetworkGroup(phone1) === getNetworkGroup(phone2);
};

const PAWAPAY_RATE = 0.01; // 1% pawaPay fee

const calculateLevy = (amount: number): number => {
  if (amount <= 150)  return 0.32;
  if (amount <= 300)  return 0.40;
  if (amount <= 500)  return 0.80;
  if (amount <= 1000) return 2.00;
  if (amount <= 3000) return 4.00;
  if (amount <= 5000) return 7.50;
  return 8.00;
};

const snappayProfit = (amount: number, crossNetwork: boolean): number => {
  if (crossNetwork) {
    if (amount <= 50)   return 1.90;
    if (amount <= 100)  return 1.40;
    if (amount <= 200)  return 2.90;
    if (amount <= 500)  return 4.90;
    if (amount <= 1000) return 9.90;
    if (amount <= 3000) return 10.00;
    if (amount <= 5000) return 10.00;
    return 10.00;
  } else {
    return 1.00; // flat K1.00 profit on all same-network tiers
  }
};

const calculateFee = (amount: number, crossNetwork: boolean = false): number => {
  const pawapay = amount * PAWAPAY_RATE;
  const levy = calculateLevy(amount);
  const profit = snappayProfit(amount, crossNetwork);
  return +(pawapay + levy + profit).toFixed(2);
};

export default calculateFee;

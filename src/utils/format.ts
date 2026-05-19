export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatPartNumber = (partNo: string): string => {
  // Insert clean dashes into Yamaha/Mercury style part numbers if needed for styling
  if (!partNo) return '';
  return partNo.toUpperCase();
};

export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

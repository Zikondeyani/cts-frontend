export const STOCK_STATES = [
  "Ready",
  "Fumigation",
  "Rebagging",
  "Repacking",
  "Expired",
];

export const isStockExpired = (stock) => {
  if (!stock?.ExpiryDate) {
    return false;
  }

  const expiryDate = new Date(stock.ExpiryDate);
  const today = new Date();

  expiryDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return expiryDate < today;
};

export const getResolvedStockState = (stock) => {
  if (isStockExpired(stock)) {
    return "Expired";
  }

  return stock?.state || "Ready";
};

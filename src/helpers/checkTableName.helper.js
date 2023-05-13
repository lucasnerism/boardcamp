export const isTableName = (order) => {
  const tableNames = ["id", "name", "image", "stockTotal", "pricePerDay", "phone", "cpf", "birthday", "customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee"];
  if (tableNames.includes(order)) return true;
  return false;
};
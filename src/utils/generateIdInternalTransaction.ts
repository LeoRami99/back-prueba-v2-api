const encodeProductId = (idProduct: string): string => {
  return Buffer.from(idProduct).toString('base64').slice(0, 10); // acortado
};

const generateIdInternalTransaction = (
  idProduct: string,
  date: Date,
): string => {
  const encodedId = encodeProductId(idProduct);
  const timestamp = date.getTime().toString(36);
  const random = Math.random().toString(36).substring(2, 6);
  return `TX-${encodedId}-${timestamp}-${random}`;
};

export { generateIdInternalTransaction };

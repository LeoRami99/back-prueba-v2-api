export const hash256Signature = async (
  reference: string,
  mount_cents: string,
  currency: string,
  token: string,
): Promise<string> => {
  const chain = `${reference}${mount_cents}${currency}${token}`;
  const encondedText = new TextEncoder().encode(chain);
  const hashBuffer = await crypto.subtle.digest('SHA-256', encondedText);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return hashHex;
};

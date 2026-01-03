export const CART_EXPIRE_MINUTES = 30;

export function isCartExpired(updatedAt: Date) {
  const diff = Date.now() - new Date(updatedAt).getTime();
  return diff > CART_EXPIRE_MINUTES * 60 * 1000;
}
export type CartItem = {
  id: string | number;
  userId: string | number;
  productId: string | number;
  quantity: number;
};

export type AddCartItemPayload = {
  userId: string | number;
  productId: string | number;
  quantity: number;
};

export type UpdateCartItemPayload = {
  id: string | number;
  quantity: number;
};

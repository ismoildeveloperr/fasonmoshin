export type OrderStatus =
  "new" | "processing" | "delivery" | "completed" | "cancelled";

export type OrderPaymentMethod = "cash" | "card";

export type OrderDeliveryMethod = "courier" | "pickup";

export type OrderProduct = {
  productId: string | number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

export type OrderAddress = {
  city: string;
  street: string;
  house: string;
  apartment?: string;
};

export type Order = {
  id: string | number;

  userId: string | number;

  products: OrderProduct[];

  customerName: string;
  phone: string;
  email: string;

  deliveryMethod: OrderDeliveryMethod;
  paymentMethod: OrderPaymentMethod;

  address?: OrderAddress;

  comment?: string;

  productsPrice: number;
  deliveryPrice: number;
  discount: number;
  total: number;

  status: OrderStatus;

  createdAt: string;
};

export type CreateOrderPayload = Omit<Order, "id">;

export type UpdateOrderPayload = {
  id: string | number;
  data: Partial<Omit<Order, "id">>;
};

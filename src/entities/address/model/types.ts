export type Address = {
  id: string | number;
  userId: string | number;

  title: string;

  city: string;
  street: string;
  house: string;
  apartment?: string;

  phone: string;

  isDefault: boolean;
};

export type AddAddressPayload = Omit<Address, "id">;

export type UpdateAddressPayload = {
  id: string | number;
  data: Partial<Omit<Address, "id" | "userId">>;
};

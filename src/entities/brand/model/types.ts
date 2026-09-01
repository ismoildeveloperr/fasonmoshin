export type Brand = {
  id: string | number;
  name: string;
  slug: string;
  logo?: string;
};

export type CreateBrandPayload = Omit<Brand, "id">;

export type UpdateBrandPayload = {
  id: string | number;
  data: Partial<Omit<Brand, "id">>;
};

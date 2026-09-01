export type Category = {
  id: string | number;
  name: string;
  slug: string;
  image?: string;
  parentId?: string | number | null;
};

export type CreateCategoryPayload = Omit<Category, "id">;

export type UpdateCategoryPayload = {
  id: string | number;
  data: Partial<Omit<Category, "id">>;
};

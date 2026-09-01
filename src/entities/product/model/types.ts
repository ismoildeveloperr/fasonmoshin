export type Product = {
  id: number;

  name: string;
  slug: string;
  article: string;
  description: string;

  price: number;
  oldPrice?: number;
  discount?: number;

  categorySlug: string;
  brandSlug?: string;

  images: string[];

  rating: number;
  reviewsCount: number;

  stock: number;

  color?: string;
  compatibility?: string[];

  isNew: boolean;
  isPopular: boolean;
  isSale: boolean;

  createdAt: string;
};

export type CreateProductPayload = Omit<Product, "id">;

export type UpdateProductPayload = {
  id: string | number;

  data: Partial<Omit<Product, "id">>;
};

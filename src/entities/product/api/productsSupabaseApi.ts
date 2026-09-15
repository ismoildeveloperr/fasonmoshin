import { supabase } from "@/shared/api/supabase";

import type {
  CreateProductPayload,
  Product,
  UpdateProductPayload,
} from "../model/types";

type ProductRow = {
  id: number;
  name: string;
  slug: string;
  article: string;
  description: string;
  price: number | string;
  old_price: number | string | null;
  discount: number | string | null;
  category_slug: string;
  brand_slug: string | null;
  images: string[] | null;
  rating: number | string;
  reviews_count: number;
  stock: number;
  color: string | null;
  compatibility: string[] | null;
  is_new: boolean;
  is_popular: boolean;
  is_sale: boolean;
  created_at: string;
};

const mapProduct = (product: ProductRow): Product => ({
  id: product.id,
  name: product.name,
  slug: product.slug,
  article: product.article,
  description: product.description,

  price: Number(product.price),

  oldPrice: product.old_price !== null ? Number(product.old_price) : undefined,

  discount: product.discount !== null ? Number(product.discount) : undefined,

  categorySlug: product.category_slug,

  brandSlug: product.brand_slug ?? undefined,

  images: product.images ?? [],

  rating: Number(product.rating),

  reviewsCount: product.reviews_count,

  stock: product.stock,

  color: product.color ?? undefined,

  compatibility: product.compatibility ?? [],

  isNew: product.is_new,

  isPopular: product.is_popular,

  isSale: product.is_sale,

  createdAt: product.created_at,
});

const toProductRow = (
  payload: Partial<Omit<Product, "id">>,
): Record<string, unknown> => ({
  ...(payload.name !== undefined ? { name: payload.name } : {}),
  ...(payload.slug !== undefined ? { slug: payload.slug } : {}),
  ...(payload.article !== undefined ? { article: payload.article } : {}),
  ...(payload.description !== undefined
    ? { description: payload.description }
    : {}),
  ...(payload.price !== undefined ? { price: payload.price } : {}),
  ...(payload.oldPrice !== undefined ? { old_price: payload.oldPrice } : {}),
  ...(payload.discount !== undefined ? { discount: payload.discount } : {}),
  ...(payload.categorySlug !== undefined
    ? { category_slug: payload.categorySlug }
    : {}),
  ...(payload.brandSlug !== undefined ? { brand_slug: payload.brandSlug } : {}),
  ...(payload.images !== undefined ? { images: payload.images } : {}),
  ...(payload.rating !== undefined ? { rating: payload.rating } : {}),
  ...(payload.reviewsCount !== undefined
    ? { reviews_count: payload.reviewsCount }
    : {}),
  ...(payload.stock !== undefined ? { stock: payload.stock } : {}),
  ...(payload.color !== undefined ? { color: payload.color } : {}),
  ...(payload.compatibility !== undefined
    ? { compatibility: payload.compatibility }
    : {}),
  ...(payload.isNew !== undefined ? { is_new: payload.isNew } : {}),
  ...(payload.isPopular !== undefined ? { is_popular: payload.isPopular } : {}),
  ...(payload.isSale !== undefined ? { is_sale: payload.isSale } : {}),
  ...(payload.createdAt !== undefined ? { created_at: payload.createdAt } : {}),
});

export const getProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("id", {
      ascending: true,
    });

  if (error) {
    throw new Error(error.message);
  }

  return (data as ProductRow[]).map(mapProduct);
};

export const createProduct = async (
  payload: CreateProductPayload,
): Promise<Product> => {
  const { data, error } = await supabase
    .from("products")
    .insert(toProductRow(payload))
    .select("*")
    .single();

  if (error) throw new Error(error.message);

  return mapProduct(data as ProductRow);
};

export const updateProduct = async ({
  id,
  data: payload,
}: UpdateProductPayload): Promise<Product> => {
  const { data, error } = await supabase
    .from("products")
    .update(toProductRow(payload))
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(error.message);

  return mapProduct(data as ProductRow);
};

export const deleteProduct = async (id: string | number): Promise<void> => {
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) throw new Error(error.message);
};

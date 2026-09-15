import { supabase } from "@/shared/api/supabase";

import type {
  Category,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "../model/types";

type CategoryRow = {
  id: number;
  name: string;
  slug: string;
  image: string | null;
  parent_id: number | null;
};

const mapCategory = (category: CategoryRow): Category => ({
  id: category.id,
  name: category.name,
  slug: category.slug,
  image: category.image ?? undefined,
  parentId: category.parent_id ?? undefined,
});

export const getCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("id", {
      ascending: true,
    });

  if (error) {
    throw new Error(error.message);
  }

  return (data as CategoryRow[]).map(mapCategory);
};

export const createCategory = async (
  payload: CreateCategoryPayload,
): Promise<Category> => {
  const { data, error } = await supabase
    .from("categories")
    .insert({
      name: payload.name,
      slug: payload.slug,
      image: payload.image ?? null,
      parent_id: payload.parentId ? Number(payload.parentId) : null,
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);

  return mapCategory(data as CategoryRow);
};

export const updateCategory = async ({
  id,
  data: payload,
}: UpdateCategoryPayload): Promise<Category> => {
  const { data, error } = await supabase
    .from("categories")
    .update({
      ...(payload.name !== undefined ? { name: payload.name } : {}),
      ...(payload.slug !== undefined ? { slug: payload.slug } : {}),
      ...(payload.image !== undefined ? { image: payload.image } : {}),
      ...(payload.parentId !== undefined
        ? { parent_id: payload.parentId ? Number(payload.parentId) : null }
        : {}),
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(error.message);

  return mapCategory(data as CategoryRow);
};

export const deleteCategory = async (id: string | number): Promise<void> => {
  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) throw new Error(error.message);
};

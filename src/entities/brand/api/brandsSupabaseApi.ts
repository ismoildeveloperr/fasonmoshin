import { supabase } from "@/shared/api/supabase";

import type {
  Brand,
  CreateBrandPayload,
  UpdateBrandPayload,
} from "../model/types";

type BrandRow = {
  id: number;
  name: string;
  slug: string;
  logo: string | null;
};

const mapBrand = (brand: BrandRow): Brand => ({
  id: brand.id,
  name: brand.name,
  slug: brand.slug,
  logo: brand.logo ?? undefined,
});

export const getBrands = async (): Promise<Brand[]> => {
  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .order("id", {
      ascending: true,
    });

  if (error) {
    throw new Error(error.message);
  }

  return (data as BrandRow[]).map(mapBrand);
};

export const createBrand = async (
  payload: CreateBrandPayload,
): Promise<Brand> => {
  const { data, error } = await supabase
    .from("brands")
    .insert({
      name: payload.name,
      slug: payload.slug,
      logo: payload.logo ?? null,
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);

  return mapBrand(data as BrandRow);
};

export const updateBrand = async ({
  id,
  data: payload,
}: UpdateBrandPayload): Promise<Brand> => {
  const { data, error } = await supabase
    .from("brands")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(error.message);

  return mapBrand(data as BrandRow);
};

export const deleteBrand = async (id: string | number): Promise<void> => {
  const { error } = await supabase.from("brands").delete().eq("id", id);

  if (error) throw new Error(error.message);
};

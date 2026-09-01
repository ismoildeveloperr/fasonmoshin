export type ProductFiltersState = {
  categoryId?: number;
  brandIds: number[];
  minPrice?: number;
  maxPrice?: number;
  inStock: boolean;
  isNew: boolean;
  isSale: boolean;
};

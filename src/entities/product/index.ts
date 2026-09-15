export {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "./api/productsSupabaseApi";

export {
  PRODUCT_QUERY_KEYS,
  useCreateProductMutation,
  useDeleteProductMutation,
  useProductsQuery,
  useUpdateProductMutation,
} from "./model/queries";

export { ProductCard } from "./ui/ProductCard/ProductCard";

export type {
  CreateProductPayload,
  Product,
  UpdateProductPayload,
} from "./model/types";

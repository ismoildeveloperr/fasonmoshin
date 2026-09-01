export { createProduct } from "./api/createProduct";
export { deleteProduct } from "./api/deleteProduct";
export { getProducts } from "./api/getProducts";
export { updateProduct } from "./api/updateProduct";

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

import { ProductCard, useProductsQuery } from "@/entities/product";
import { ErrorState } from "@/shared/ui/ErrorState";
import { Loader } from "@/shared/ui/Loader";

export const ProductCatalog = () => {
  const { data: products, isLoading, isError, refetch } = useProductsQuery();

  if (isLoading) {
    return <Loader text="Загружаем каталог..." />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Не удалось загрузить товары"
        onRetry={() => refetch()}
      />
    );
  }

  if (!products?.length) {
    return <div>Товары не найдены</div>;
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
        gap: "24px",
      }}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

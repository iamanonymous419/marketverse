'use client';

import { useFetchProducts } from '@/service/product-detail/fetchAllProducts';
import ProductComponent from './List';
import ProductGridSkeleton from '@/components/custom/skeleton/Products-List';

const ProductList: React.FC = () => {
  const { data, isLoading, error } = useFetchProducts();

  if (isLoading) {
    return <ProductGridSkeleton />;
  }

  if (error) {
    return <div> Error occurred </div>;
  }

  return (
    <main className="py-16">
      <ProductComponent products={data?.data || []} />
    </main>
  );
};

export default ProductList;

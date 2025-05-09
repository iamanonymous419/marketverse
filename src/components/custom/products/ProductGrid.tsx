'use client';

import { useFetchProducts } from '@/service/product-detail/fetchAllProducts';
import ProductRow from './ProductRow';
import ProductGridSkeleton from '../skeleton/Products-Skeleton';
import { Card } from '@/components/ui/card';
import { Home, PackageSearch, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const ProductGrid: React.FC = () => {
  const { data, isLoading, error } = useFetchProducts();

  if (isLoading) {
    return <ProductGridSkeleton />;
  }

  const products = data?.data;

  if (products == null || products.length === 0 || error) {
    return (
      <>
        <main className="container mx-auto px-4 py-16 max-w-4xl">
          <Card className="p-8 flex flex-col items-center justify-center text-center">
            <PackageSearch className="h-24 w-24 text-muted-foreground mb-6" />
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              No Products Available
            </h1>
            <p className="text-muted-foreground max-w-md mb-8">
              We&apos;re currently updating our inventory. Please check back
              later for exciting new products!
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="gap-2">
                <Link href="/">
                  <Home className="h-5 w-5" />
                  Back to Home
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="gap-2"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="h-5 w-5" />
                Refresh Page
              </Button>
            </div>
          </Card>
        </main>
      </>
    );
  }

  // Split products into sections
  const newArrivals = products.slice(0, 10);
  const bestSellers = products.slice(10, 20);
  const specialOffers = products.slice(20);

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-4xl font-bold mb-16 text-center">
        Discover Our Products
      </h2>
      <div className="space-y-20">
        {/* First row */}
        <ProductRow title="New Arrivals" products={newArrivals} />

        {/* Second row - only show if first row has products */}
        {newArrivals.length > 0 && bestSellers.length > 0 && (
          <ProductRow title="Best Sellers" products={bestSellers} />
        )}

        {/* Third row - only show if first and second rows have products */}
        {newArrivals.length > 0 &&
          bestSellers.length > 0 &&
          specialOffers.length > 0 && (
            <ProductRow title="Special Offers" products={specialOffers} />
          )}
      </div>
    </div>
  );
};

export default ProductGrid;

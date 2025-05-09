'use client';
import axios from 'axios';
import { ProductDetail } from './product-detail';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Product, type ApiResponse } from '@/types';
import ProductGridSkeleton from '@/components/custom/skeleton/Products-List';
import { ArrowLeft, ShoppingBag, ShoppingCart } from 'lucide-react';
import { Card } from '@/components/ui/card';

export const ProductList = ({ email }: { email: string }) => {
  const [products, setProducts] = useState<Product[]>([]); // Explicitly type the state
  const [loading, setloading] = useState<boolean>(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setloading(true);
        const response = await axios.post<ApiResponse<Product[]>>(
          '/api/products/cart/fetch',
          {
            email,
          }
        ); // Pass email as an object
        // console.log(response.data.products);
        setloading(false);
        setProducts(response.data.data ?? []); // Update state with fetched products
      } catch (error) {
        console.error('Error fetching products:', error);
        // You can add an alert or toast notification here if needed
      } finally {
        setloading(false);
      }
    };

    fetchProducts();
  }, [email]); // Dependency array listens for changes in email

  if (loading) {
    return <ProductGridSkeleton />;
  }

  // console.log(products);
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-12">
        {!products || products.length === 0 ? (
          <main className="container mx-auto px-4 py-12 max-w-5xl">
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight">Your Cart</h1>
              <p className="text-muted-foreground mt-1">Manage your items</p>
            </div>

            <Card className="p-8 flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
                <ShoppingCart className="h-12 w-12 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">
                Your cart is empty
              </h2>
              <p className="text-muted-foreground max-w-md mb-8">
                Looks like you haven&apos;t added anything to your cart yet.
                Explore our products and find something you&apos;ll love!
              </p>
              <Button asChild size="lg" className="gap-2">
                <Link href="/products/explore">
                  <ShoppingBag className="h-5 w-5" />
                  Start Shopping
                </Link>
              </Button>
            </Card>

            <div className="mt-8">
              <Button variant="outline" asChild className="gap-2">
                <Link href="/">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </main>
        ) : (
          <>
            <h1 className="text-3xl font-bold tracking-tight">Your Cart</h1>
            {products.map((product) => (
              <ProductDetail key={product.id} {...product} />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

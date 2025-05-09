'use client';

import {
  ShoppingCart,
  Eye,
  PackageSearch,
  Home,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import axios, { AxiosError } from 'axios';
import { toast } from '@/hooks/use-toast';
import { useUser } from '@clerk/nextjs';
import ProductGridSkeleton from '@/components/custom/skeleton/Products-List';
import type { ApiResponseCommon, ProductListProps } from '@/types';
import Link from 'next/link';

const ProductList: React.FC<ProductListProps> = ({ products }) => {
  const router = useRouter();
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <ProductGridSkeleton />;
  }

  const handleCart = async (productId: number): Promise<void> => {
    try {
      if (!user?.primaryEmailAddress?.emailAddress) {
        toast({
          title: 'Messahe',
          description: 'User email not found. Please log in.',
          variant: 'destructive',
        });
        return;
      }

      const res = await axios.put<ApiResponseCommon>('/api/products/cart/add', {
        email: user.primaryEmailAddress.emailAddress,
        productId,
      });

      toast({
        title: 'Message',
        description: res.data.message,
      });
    } catch (error: unknown) {
      const errMsg =
        error instanceof AxiosError
          ? error.response?.data?.message || 'Server error occurred.'
          : 'Failed to add product to cart. Please try again.';

      toast({
        title: 'Message',
        description: errMsg,
        variant: 'destructive',
      });
    }
  };

  if (products.length === 0) {
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

  return (
    <div className="grid gap-8 max-w-6xl mx-auto px-4">
      <h1 className="text-3xl font-bold text-center mb-8">
        Our Products In Marketverse
      </h1>
      {products?.map((product) => (
        <Card key={product.productId} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="grid md:grid-cols-[400px,1fr] gap-8">
              <div className="aspect-square overflow-hidden">
                <Image
                  src={
                    product.productImages[0] ||
                    '/placeholder.svg?height=224&width=260'
                  }
                  alt={product.productName}
                  className="h-full w-full object-cover transition-transform hover:scale-105"
                  width={400}
                  height={400}
                  unoptimized={true}
                />
              </div>
              <div className="flex flex-col justify-between p-6">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">{product.productName}</h2>
                  <p className="text-3xl font-bold text-primary">
                    ₹{product.productPrice.toLocaleString()}
                  </p>
                  <p className="text-muted-foreground">
                    {product.productDescription}
                  </p>
                </div>
                <div className="flex gap-4 pt-6">
                  <Button
                    className="flex-1"
                    onClick={() => handleCart(product.productId)}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to cart
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() =>
                      router.push(`/products/${product.productId}`)
                    }
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View details
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )) || []}
    </div>
  );
};

export default ProductList;

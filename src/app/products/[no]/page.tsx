'use client';

import Review from './Review'; // Remove 'type' from the import
import SkeletonLoader from '@/components/custom/skeleton/Product-Skeleton';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Heart } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import type { Product, ApiResponseCommon, ApiResponse } from '@/types';
import NoProductsPage from '@/components/custom/not-found';

const Page = ({ params }: { params: Promise<{ no: string }> }) => {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    const fetch = async (): Promise<void> => {
      try {
        setLoading(true);
        const no: string = (await params).no;
        const num: number = parseInt(no);
        if (isNaN(num)) {
          console.log('Invalid Page');
        }
        const res = await axios.get<ApiResponse<Product>>(
          `/api/products/${num}`
        );
        setProduct(res.data.data ?? null);
        setLoading(false);
      } catch (error: unknown) {
        console.log('Error', error);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [params]);

  const { user, isLoaded } = useUser();
  if (loading || !isLoaded) {
    return <SkeletonLoader />;
  }

  if (!product) {
    return <NoProductsPage />;
  }

  const handleClick = async (productId: number): Promise<void> => {
    try {
      const res = await axios.put<ApiResponseCommon>('/api/products/cart/add', {
        email: user?.primaryEmailAddress?.emailAddress,
        productId,
      });
      toast({
        title: 'Message',
        description: res.data.message,
      });
      console.log(res.data);
    } catch (error: unknown) {
      console.log('Error', error);
    }
  };

  const handleClickWishList = async (productId: number): Promise<void> => {
    try {
      const res = await axios.put<ApiResponseCommon>(
        '/api/products/wishlist/add',
        {
          email: user?.primaryEmailAddress?.emailAddress,
          productId,
        }
      );
      toast({
        title: 'Message',
        description: res.data.message,
      });
      console.log(res.data);
    } catch (error: unknown) {
      console.log('Error', error);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-background mt-20">
        <div className="max-w-6xl mx-auto px-4 py-8 ">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Left Column - Image Carousel */}
            <div className="relative w-full max-w-xl mx-auto">
              <Carousel className="w-full">
                <CarouselContent>
                  {product?.productImages.map(
                    (image: string, index: number) => (
                      <CarouselItem key={index}>
                        <div className="relative w-full h-[540px]">
                          <Image
                            src={image || '/placeholder.svg'}
                            alt={`Product image ${index + 1}`}
                            fill
                            unoptimized={true}
                            className="object-cover rounded-lg"
                            priority={index === 0}
                          />
                        </div>
                      </CarouselItem>
                    )
                  )}
                </CarouselContent>
                <CarouselPrevious className="absolute left-4 top-1/2 " />
                <CarouselNext className="absolute right-4 top-1/2 " />
              </Carousel>
            </div>

            {/* Right Column - Product Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold">{product?.productName}</h1>
                <p className="text-3xl font-bold mt-2">
                  <span className="text-muted-foreground"> Price </span>:{' '}
                  {product?.productPrice.toFixed(2)}
                </p>
              </div>

              <Separator />

              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Description</h2>
                <p className="text-muted-foreground">
                  {product?.productDescription}
                </p>
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-semibold">Seller Information</h2>
                <p className="text-muted-foreground">
                  Contact: {product?.sellerEmail}
                </p>
              </div>

              <Card className="p-6">
                <div className="space-y-4">
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={() => {
                      router.push(`/products/buynow/${product?.productId}`);
                    }}
                  >
                    Buy Now
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full"
                    onClick={() => {
                      handleClick(product.productId);
                    }}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => {
                      handleClickWishList(product.productId);
                    }}
                  >
                    <Heart className="mr-2 h-5 w-5" />
                    Add to Wishlist
                  </Button>
                </div>
              </Card>
            </div>
          </div>

          <Review
            productId={product?.productId}
            email={user?.primaryEmailAddress?.emailAddress || ''}
          />
        </div>
      </div>
    </>
  );
};

export default Page;

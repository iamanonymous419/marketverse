'use client';
import { ImageCarousel } from './image-carousel';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { useUser } from '@clerk/nextjs';
import ProductGridSkeleton from '@/components/custom/skeleton/Products-List';
import type { Product, ApiResponseCommon } from '@/types';

export const ProductDetail = ({
  productId,
  productName,
  productPrice,
  productDescription,
  productImages,
}: Product) => {
  const { user, isLoaded } = useUser();
  const { toast } = useToast();

  if (!isLoaded) {
    return <ProductGridSkeleton />;
  }

  // Remove product from cart
  const handleRemoveFromWishlist = async (): Promise<void> => {
    try {
      const response = await axios.delete<ApiResponseCommon>(
        '/api/products/wishlist/remove',
        {
          data: {
            email: user?.primaryEmailAddress?.emailAddress,
            productId,
          },
        }
      );

      toast({
        title: 'Message',
        description: response.data.message,
      });
    } catch (error: unknown) {
      console.log(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not remove item from cart.',
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
  };

  // Buy Now action
  const handleToCart = async (): Promise<void> => {
    try {
      const res = await axios.put<ApiResponseCommon>('/api/products/cart/add', {
        email: user?.primaryEmailAddress?.emailAddress,
        productId,
      });
      toast({
        title: 'Message',
        description: res.data.message,
      });
      // console.log(res.data);
    } catch (error: unknown) {
      console.log('Error', error);
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="order-1 md:order-1">
          <ImageCarousel productImages={productImages} className="md:m-6" />
        </div>
        <div className="order-2 md:order-2 p-6 flex flex-col justify-between">
          <div>
            <CardHeader className="px-0">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl font-bold">
                    {productName}
                  </CardTitle>
                  <CardDescription className="text-xl font-semibold mt-2">
                    ₹{productPrice}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <Separator className="my-4" />
            <CardContent className="px-0">
              <p className="text-gray-600">{productDescription}</p>
            </CardContent>
          </div>

          {/* Buttons for Cart & Purchase */}
          <div className="mt-8 flex flex-col gap-4">
            <Button
              variant="ghost"
              className="w-full"
              onClick={handleRemoveFromWishlist}
            >
              Remove from Wish:List
            </Button>
            <Button variant="default" className="w-full" onClick={handleToCart}>
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

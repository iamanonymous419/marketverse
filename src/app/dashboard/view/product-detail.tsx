'use client';

import { ImageCarousel } from './image-carousel';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import type { Product, ApiResponseCommon } from '@/types';

export const ProductDetail = ({
  productId,
  productName,
  productPrice,
  productDescription,
  productImages,
}: Product) => {
  const { toast } = useToast();
  const handleDelete = async () => {
    // console.log('Delete product:', productId);
    try {
      const response = await axios.get<ApiResponseCommon>(
        `/api/delete-products/${productId}`
      );
      // console.log(response.data.message);
      toast({
        title: 'Message',
        description: response.data.message,
      });
    } catch (error: unknown) {
      console.error('Error deleting product:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      // You can add an alert or toast notification here if needed
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="order-1 md:order-1">
          <ImageCarousel productImages={productImages} className="md:m-6" />
        </div>
        <div className="order-2 md:order-2 p-6">
          <CardHeader className="px-0">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl font-bold">
                  Product Name: {productName}
                </CardTitle>
                <CardDescription className="text-xl font-semibold mt-2">
                  Product Price: ₹{productPrice}
                </CardDescription>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={handleDelete}
                      className="hover:bg-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Delete this product</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardHeader>
          <Separator className="my-4" />
          <CardContent className="px-0">
            <p className="text-gray-600">{productDescription}</p>
          </CardContent>
        </div>
      </div>
    </Card>
  );
};

'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ShoppingCart, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import { toast } from '@/hooks/use-toast';
import { useClerk } from '@clerk/nextjs';
import type { Product, ApiResponseCommon } from '@/types';

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const router = useRouter();
  const { user } = useClerk();

  // Buy Now action
  const handleToCart = async (productId: number): Promise<void> => {
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
    <Card
      className="relative group transition-all duration-300 hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-56 overflow-hidden rounded-t-lg">
        <Image
          src={
            product.productImages[0] || '/placeholder.svg?height=224&width=260'
          }
          unoptimized={true}
          alt={product.productName}
          layout="fill"
          className={cn(
            'w-full h-full object-cover transition-transform duration-300',
            isHovered && 'scale-110'
          )}
        />
        <div className="absolute inset-0 bg-background/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <CardHeader className="p-4">
        <CardTitle className="text-lg font-semibold line-clamp-1">
          {product.productName}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {product.productDescription}
              </p>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">{product.productDescription}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="mt-3">
          <p className="text-xl font-bold">
            ₹{product.productPrice.toLocaleString()}
          </p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 gap-2">
        <Button
          className="flex-1"
          variant="default"
          onClick={() => handleToCart(product.productId)}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
        <Button
          className="flex-1"
          variant="secondary"
          onClick={() => router.push(`/products/${product.productId}`)}
        >
          <Eye className="mr-2 h-4 w-4" />
          View
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;

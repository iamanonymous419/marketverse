'use client';

import * as React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import type { ImageCarouselProps } from '@/types';

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  productImages,
  className,
}: ImageCarouselProps) => {
  return (
    <Card className={cn('w-full', className)}>
      <CardContent className="p-0">
        <Carousel className="w-full">
          <CarouselContent>
            {productImages.map((src, index) => (
              <CarouselItem key={index}>
                <div className="relative aspect-square md:aspect-[4/3] lg:aspect-[3/2]">
                  {/* Product Image */}
                  <Image
                    src={src || '/placeholder.svg'}
                    alt={`Product image ${index + 1}`}
                    fill
                    className="object-cover rounded-md"
                    quality={80}
                    unoptimized={true}
                    loading="lazy" // ✅ Lazy loading enabled
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />

                  {/* Arrows inside the image container */}
                  <CarouselPrevious className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 p-2 text-white rounded-full hover:bg-black/70" />
                  <CarouselNext className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 p-2 text-white rounded-full hover:bg-black/70" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </CardContent>
    </Card>
  );
};

export default ImageCarousel;

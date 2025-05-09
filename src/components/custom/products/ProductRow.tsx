import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';
import type { Product } from '@/types';

const ProductRow: React.FC<{ products: Product[]; title: string }> = ({
  products,
  title,
}) => {
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const rowRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right'): void => {
    if (rowRef.current) {
      const scrollAmount = 300;
      const newPosition =
        direction === 'left'
          ? scrollPosition - scrollAmount
          : scrollPosition + scrollAmount;

      rowRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth',
      });
      setScrollPosition(newPosition);
    }
  };

  return (
    <div className="relative group">
      <h3 className="text-2xl font-semibold mb-6">{title}</h3>
      <div
        ref={rowRef}
        className="flex overflow-x-auto gap-6 pb-6 px-2 scroll-smooth hide-scrollbar"
      >
        {products.map((product: Product) => (
          <div key={product.id} className="min-w-[280px] flex-shrink-0">
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-background p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 disabled:opacity-0 border"
        disabled={scrollPosition <= 0}
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-background p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 border"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    </div>
  );
};

export default ProductRow;

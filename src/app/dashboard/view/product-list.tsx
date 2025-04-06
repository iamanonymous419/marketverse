'use client';
import axios from 'axios';
import { ProductDetail } from './product-detail';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { ApiResponse, Product } from '@/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BookOpen, HelpCircle, PackageOpen, PlusCircle } from 'lucide-react';

export const ProductList = ({ email }: { email: string }) => {
  const [products, setProducts] = useState<Product[]>([]); // Explicitly the state

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.post<ApiResponse<Product[]>>(
          '/api/get-products',
          { email }
        ); // Pass email as an object
        // console.log(response.data.products);
        setProducts(response.data.data ?? []); // Update state with fetched products
      } catch (error: unknown) {
        console.error('Error fetching products:', error);
        // You can add an alert or toast notification here if needed
      }
    };

    fetchProducts();
  }, [email]); // Dependency array listens for changes in email

  // console.log(products);
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-12">
        {!products || products.length === 0 ? (
          <div className="container mx-auto px-4 py-16 max-w-5xl">
            <Card className="w-full p-6 sm:p-8 shadow-2xl rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#121212]">
              <CardHeader className="space-y-6 text-center">
                <div className="flex justify-center">
                  <PackageOpen className="h-20 w-20 text-primary" />
                </div>
                <CardTitle className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100">
                  Start Selling on MarketVerse
                </CardTitle>
                <CardDescription className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
                  You haven&apos;t listed any products yet. Let&apos;s get
                  started and showcase your items to potential buyers!
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Card className="p-6 bg-gray-50 dark:bg-[#1E1E1E]">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                      Why sell on MarketVerse?
                    </h3>
                    <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                      <li className="flex items-start">
                        <span className="mr-2">•</span> Reach millions of
                        potential customers
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span> Easy-to-use platform for
                        managing your listings
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span> Secure payment
                        processing
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span> 24/7 seller support
                      </li>
                    </ul>
                  </Card>
                  <div className="flex flex-col justify-center space-y-6">
                    <Button
                      asChild
                      size="lg"
                      className="w-full py-6 text-lg rounded-lg"
                    >
                      <Link
                        href="/dashboard/list"
                        className="flex items-center justify-center"
                      >
                        <PlusCircle className="mr-3 h-6 w-6" /> List Your First
                        Product
                      </Link>
                    </Button>
                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        variant="outline"
                        asChild
                        size="lg"
                        className="w-full py-4"
                      >
                        <Link
                          href="/"
                          className="flex items-center justify-center"
                        >
                          <BookOpen className="mr-2 h-5 w-5" /> Seller Guide
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        asChild
                        size="lg"
                        className="w-full py-4"
                      >
                        <Link
                          href="/"
                          className="flex items-center justify-center"
                        >
                          <HelpCircle className="mr-2 h-5 w-5" /> Get Help
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-6">Your Products in Market</h1>
            {products.map((product) => (
              <ProductDetail key={product.id} {...product} />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

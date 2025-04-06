'use client';

import ProductGrid from '@/components/custom/products/ProductGrid';
import { SignInButton, SignUpButton, useAuth, useUser } from '@clerk/nextjs';
import axios from 'axios';
import { useEffect } from 'react';
import { type ApiResponseCommon } from '@/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductGridSkeleton from '@/components/custom/skeleton/Products-List';

const Home = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      const addBuyer = async (): Promise<void> => {
        try {
          const data = {
            userId: user.id,
            email: user.primaryEmailAddress?.emailAddress,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            imageURL: user.imageUrl,
          };

          await axios.post<ApiResponseCommon>('/api/user/add-user', data);
        } catch (error: unknown) {
          console.error('Error adding user:', error);
        }
      };

      addBuyer();
    }
  }, [isLoaded, isSignedIn, user]);

  if (!isLoaded) return <ProductGridSkeleton />;
  if (!isSignedIn) {
    return (
      <>
        <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-black">
          <Card className="w-full max-w-4xl p-6 sm:p-8 shadow-2xl rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#121212]">
            <CardHeader className="space-y-6 text-center">
              <div className="flex justify-center">
                <ShieldCheck className="h-16 sm:h-20 w-16 sm:w-20 text-primary" />
              </div>
              <CardTitle className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100">
                Login Required
              </CardTitle>
              <CardDescription className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
                Please log in to access this page and enjoy all features of{' '}
                <span className="font-semibold">MarketVerse</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="bg-gray-100 dark:bg-[#1E1E1E] p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                  Why log in?
                </h3>
                <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
                  <li>Access your personalized dashboard</li>
                  <li>View your order history and track shipments</li>
                  <li>Save items to your wishlist</li>
                  <li>Receive exclusive offers and discounts</li>
                </ul>
              </div>
              <div className="flex flex-col justify-center space-y-6">
                <SignInButton mode="modal">
                  <Button className="w-full py-6 text-lg rounded-lg bg-primary hover:bg-primary/90 text-secondary">
                    Sign In
                  </Button>
                </SignInButton>
                <div className="text-base sm:text-lg text-center text-gray-700 dark:text-gray-300">
                  Don&apos;t have an account?{' '}
                  <SignUpButton mode="modal">
                    <Button
                      variant="link"
                      className="text-primary font-semibold hover:underline"
                    >
                      Sign up
                    </Button>
                  </SignUpButton>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return <ProductGrid />;
};

export default Home;

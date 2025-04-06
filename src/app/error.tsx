'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCcw, Home, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-black px-4">
      <Card className="w-full max-w-3xl p-6 sm:p-8 shadow-2xl rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#121212]">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-6">
            <AlertTriangle className="h-20 w-20 text-yellow-500" />
          </div>
          <CardTitle className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Oops! Something went wrong
          </CardTitle>
          <CardDescription className="text-lg text-gray-600 dark:text-gray-400">
            We&apos;re sorry, but we encountered an unexpected error. Our team
            has been notified and is working on it.
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
              onClick={() => reset()}
              size="lg"
              className="w-full py-6 text-lg rounded-lg"
            >
              <RefreshCcw className="mr-2 h-5 w-5" /> Try Again
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full py-6 text-lg rounded-lg"
            >
              <Link href="/" className="flex items-center justify-center">
                <Home className="mr-2 h-5 w-5" /> Go to Homepage
              </Link>
            </Button>
          </div>
          <div className="mt-8 text-center">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Need further assistance?
            </h3>
            <Button asChild variant="link" size="lg" className="text-primary">
              <Link
                href="/contact"
                className="flex items-center justify-center"
              >
                <MessageSquare className="mr-2 h-5 w-5" /> Contact Support
              </Link>
            </Button>
          </div>
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <h4 className="font-semibold text-red-500 mb-2">
                Error Details (visible in development only):
              </h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {error.message}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

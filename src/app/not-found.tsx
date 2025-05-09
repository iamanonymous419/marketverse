import type React from 'react';
import Link from 'next/link';
import { Home, Search, ShoppingBag, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function NotFoundPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-black px-4">
      <Card className="w-full max-w-3xl p-6 sm:p-8 shadow-2xl rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#121212]">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="text-9xl font-bold text-gray-200 dark:text-gray-800">
                404
              </div>
              <HelpCircle className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-20 w-20 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Oops! Page Not Found
          </CardTitle>
          <CardDescription className="text-lg text-gray-600 dark:text-gray-400">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
              asChild
              size="lg"
              className="w-full py-6 text-lg rounded-lg"
            >
              <Link href="/" className="flex items-center justify-center">
                <Home className="mr-2 h-5 w-5" /> Go to Homepage
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full py-6 text-lg rounded-lg"
            >
              <Link href="/search" className="flex items-center justify-center">
                <Search className="mr-2 h-5 w-5" /> Search Products
              </Link>
            </Button>
          </div>
          <div className="mt-8 text-center">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
              You might be interested in:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <QuickLinkCard
                icon={<ShoppingBag className="h-6 w-6" />}
                title="New Arrivals"
                href="/new-arrivals"
              />
              <QuickLinkCard
                icon={<ShoppingBag className="h-6 w-6" />}
                title="Best Sellers"
                href="/best-sellers"
              />
              <QuickLinkCard
                icon={<ShoppingBag className="h-6 w-6" />}
                title="Special Offers"
                href="/special-offers"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function QuickLinkCard({
  icon,
  title,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  href: string;
}) {
  return (
    <Link href={href}>
      <Card className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
        <div className="flex flex-col items-center text-center">
          <div className="mb-2 text-primary">{icon}</div>
          <h4 className="font-medium text-gray-800 dark:text-gray-200">
            {title}
          </h4>
        </div>
      </Card>
    </Link>
  );
}

'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Github, Twitter, Youtube, Instagram } from 'lucide-react';
import Link from 'next/link';
import ThemeToggle from './Theme-Toggle';
import axios from 'axios';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type NewsLetterType, NewsLetterSchema } from '../../validation';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import TypedText from './TypedText';
import { type ApiResponseCommon } from '@/types';

const Footer: React.FC = () => {
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NewsLetterType>({
    resolver: zodResolver(NewsLetterSchema),
  });

  const handleClick: SubmitHandler<NewsLetterType> = async (
    data: NewsLetterType
  ): Promise<void> => {
    try {
      const response = await axios.post<ApiResponseCommon>(
        '/api/newsletter',
        data
      );
      toast({
        title: 'Message',
        description: response.data.message,
        action: <ToastAction altText="OK">OK</ToastAction>,
      });
    } catch (error: unknown) {
      console.error('Error:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    } finally {
      reset();
    }
  };

  return (
    <footer className="w-full bg-background text-foreground py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-1">
            <span className="text-2xl">
              <TypedText
                strings={['MarketVerse']}
                typeSpeed={120}
                backSpeed={100}
                loop={true}
              />
            </span>
          </div>

          <div>
            <h3 className="font-medium mb-4">Let us Help You</h3>
            <ul className="space-y-3">
              {['Payment', 'Your Account', 'Order Status', 'View Profile'].map(
                (item: string) => (
                  <li key={item}>
                    <Link
                      href="/"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-4">Seller</h3>
            <ul className="space-y-3">
              {['Sell On MarketVerse', 'Pricing', 'Create A Store'].map(
                (item: string) => (
                  <li key={item}>
                    <Link
                      href="/"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-4">About MarketVerse</h3>
            <ul className="space-y-3">
              {['About Us', 'Careers', 'Press', 'Partners'].map(
                (item: string) => (
                  <li key={item}>
                    <Link
                      href="/"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-4">Subscribe to our newsletter</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Stay updated on new releases and features, guides, and case
              studies.
            </p>
            <form onSubmit={handleSubmit(handleClick)} className="space-y-2">
              <Input
                type="email"
                placeholder="you@domain.com"
                className="bg-muted/50 border-muted-foreground/20"
                id="email-address"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
              <Button type="submit" className="w-full">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mt-16 pt-8 border-t border-muted-foreground/20">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              © 2025 MarketVerse, Inc.
            </span>
            <div className="flex items-center space-x-4 text-muted-foreground">
              <Link href="#" className="hover:text-foreground">
                <Github className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-foreground">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-foreground">
                <Youtube className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-foreground">
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

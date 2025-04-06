import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/custom/Navbar';
import Footer from '@/components/custom/Footer';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from '@/components/ui/toaster';
import Providers from './providers';
import { ApolloProvider } from '@/components/custom/provider/ApolloProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'MarketVerse - The Best Place to Buy and Sell',
  description: 'MarketVerse is the best place to buy and sell products.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <ApolloProvider>
        <ClerkProvider>
          <html lang="en" suppressHydrationWarning>
            <body
              className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                <Navbar />
                {children}
                <Toaster />
                <Footer />
              </ThemeProvider>
            </body>
          </html>
        </ClerkProvider>
      </ApolloProvider>
    </Providers>
  );
}

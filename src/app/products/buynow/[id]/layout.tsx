import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MarketVerse - Buy Now Product',
  description: 'MarketVerse is the best place to buy and sell products.',
};

export default function BuyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}

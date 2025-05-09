import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MarketVerse - Seller Page',
  description: 'MarketVerse is the best place to buy and sell products.',
};

export default function SellerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}

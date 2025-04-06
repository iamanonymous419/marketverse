import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MarketVerse - Product Section',
  description: 'MarketVerse is the best place to buy and sell products.',
};

export default function ProductSectionLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}

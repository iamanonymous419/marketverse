import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MarketVerse - Cart Page',
  description: 'MarketVerse is the best place to buy and sell products.',
};

export default function CartLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}

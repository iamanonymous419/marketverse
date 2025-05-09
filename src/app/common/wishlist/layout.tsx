import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MarketVerse - Wishlist Page',
  description: 'MarketVerse is the best place to buy and sell products.',
};

export default function WishlistLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}

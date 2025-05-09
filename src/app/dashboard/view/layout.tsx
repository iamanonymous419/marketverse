import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MarketVerse - View listed Product',
  description: 'MarketVerse is the best place to buy and sell products.',
};

export default function ViewLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}

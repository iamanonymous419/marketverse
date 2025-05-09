import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MarketVerse - List a Product Page',
  description: 'MarketVerse is the best place to buy and sell products.',
};

export default function ListLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}

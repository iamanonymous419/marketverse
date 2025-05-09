import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MarketVerse - Common Section',
  description: 'MarketVerse is the best place to buy and sell products.',
};

export default function CommonSectionLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}

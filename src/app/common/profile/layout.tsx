import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MarketVerse - Profile Page',
  description: 'MarketVerse is the best place to buy and sell products.',
};

export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}

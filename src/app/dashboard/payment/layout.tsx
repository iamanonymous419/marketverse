import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MarketVerse - Payment Method Page',
  description: 'MarketVerse is the best place to buy and sell products.',
};

export default function SellerPaymentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}

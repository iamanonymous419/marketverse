import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MarketVerse - Payment Page',
  description: 'MarketVerse is the best place to buy and sell products.',
};

export default function PaymentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}

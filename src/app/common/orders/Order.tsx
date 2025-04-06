'use client';

import { useEffect, useState } from 'react';
import { MessageSquare, PackageSearch, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import type { Order, ApiResponseCommon, ApiResponse } from '@/types';

const OrderPage = ({ email }: { email: string }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const getData = async (): Promise<void> => {
      try {
        const response = await axios.get<ApiResponse<Order[]>>(
          `/api/products/order/${email}`
        );
        setOrders(Array.isArray(response.data.data) ? response.data.data : []);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to fetch account data.',
        });
      }
    };

    getData();
  }, [email, toast]);
  // not i an mood to change this

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleCancelOrder = async (orderID: number): Promise<void> => {
    try {
      const response = await axios.get<ApiResponseCommon>(
        `/api/products/order/cancel/${orderID}`
      );
      toast({
        title: 'Message',
        description: response.data.message,
      });
      router.push('/common/orders');
    } catch (error: unknown) {
      console.log(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'server is giving error, plz wait',
      });
    }
  };

  const handleContactSeller = (sellerEmail: string) => {
    toast({
      title: 'Contact Seller',
      description: `Opening chat with ${sellerEmail}`,
    });
  };

  if (orders.length === 0) {
    return (
      <Card className="bg-card">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <PackageSearch className="w-16 h-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">No Orders Found</h2>
          <p className="text-muted-foreground text-center max-w-md">
            It looks like you haven&apos;t placed any orders yet. Start shopping
            to see your orders here!
          </p>
          <Button className="mt-6" onClick={() => (window.location.href = '/')}>
            Start Shopping
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8 md:px-6 md:py-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-primary">Your Orders</h1>
        {orders.map((order) => (
          <Card key={order.orderID} className="bg-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="space-y-1">
                <CardTitle>Order #{order.orderID}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Ordered on {formatDate(order.orderDate)}
                </p>
              </div>
              <Badge
                variant={
                  order.orderStatus === 'pending' ? 'default' : 'secondary'
                }
              >
                {order.orderStatus}
              </Badge>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Product Details</h3>
                  {order.products && (
                    <>
                      <p className="text-lg font-medium">
                        {order.products.productName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.products.productDescription}
                      </p>
                      <p className="text-lg font-bold mt-2">
                        ₹{order.products.productPrice}
                      </p>
                    </>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Shipping Address</h3>
                  <p>{order.address?.fullName ?? 'N/A'}</p>
                  <p>{order.address?.streetName ?? 'N/A'}</p>
                  <p>
                    {order.address?.city ?? 'N/A'},{' '}
                    {order.address?.state ?? 'N/A'}{' '}
                    {order.address?.pincode ?? 'N/A'}
                  </p>
                  <p>Phone: {order.address?.phoneNo ?? 'N/A'}</p>
                </div>
              </div>
              <Separator />
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Seller Information</h3>
                  <p className="text-sm">Email: {order.sellerEmail}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Payment Information</h3>
                  <p className="text-sm">
                    Account Username: {order.paymentAccount.accountUsername}
                  </p>
                  <p className="text-sm">
                    Account Number: {order.paymentAccount.accountNumber}
                  </p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  © {new Date().getFullYear()} MarketVerse. All rights
                  reserved.
                </p>
                <div className="flex gap-2">
                  {/* i will add a realtime chatting with socker io with seller maybe or maybe not let's see for no choice */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleContactSeller(order.sellerEmail)}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Contact Seller
                  </Button>
                  {order.orderStatus === 'pending' && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleCancelOrder(order.orderID)}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel Order
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
export default OrderPage;

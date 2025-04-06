'use client';

import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input'; // Import input component
import type { Address, Payment, Product, ApiResponse } from '@/types';
import NoProductsPage from '@/components/custom/not-found';

const Order = ({ id, email }: { id: number | null; email: string }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [address, setAddress] = useState<Address[]>([]);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [paymentLoading, setPaymentLoading] = useState<boolean>(false);
  const [password, setPassword] = useState<string>(''); // State for password

  const router = useRouter();
  const { toast } = useToast();
  const placeOrderRef = useRef<HTMLDivElement>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  );

  useEffect(() => {
    if (!id || !email) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const [resForProducts, resForAddress, resForPayment] =
          await Promise.all([
            axios.get<ApiResponse<Product>>(`/api/products/${id}`),
            axios.get<ApiResponse<Address[]>>(
              `/api/user/address-user/${email}`
            ),
            axios.get<ApiResponse<Payment>>(`/api/user/payment/${email}`),
          ]);

        setProduct(resForProducts.data.data ?? null);
        setAddress(resForAddress.data.data ?? []);
        setPayment(resForPayment.data.data ?? null);
      } catch (error: unknown) {
        console.error('API Fetch Error:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to fetch data. Please try again later.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, email, toast]);

  useEffect(() => {
    if (selectedAddressId && placeOrderRef.current) {
      placeOrderRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedAddressId]);

  const handleOrder = async (): Promise<void> => {
    if (!product || !selectedAddressId || !payment || !password) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          'Please select an address, enter your payment password, and ensure payment details are available',
      });
      return;
    }

    const selectedAddress: Address | undefined = address.find(
      (addr: Address) => addr.addressID === selectedAddressId
    );

    if (!selectedAddress) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Invalid address selected',
      });
      return;
    }

    try {
      setPaymentLoading(true);
      const response = await axios.post('/api/products/order/', {
        buyerEmail: payment.buyerEmail,
        sellerEmail: product.sellerEmail,
        productId: product.productId,
        addressID: selectedAddress.addressID,
        accountNumber: payment.accountNumber,
        accountUsername: payment.accountUsername,
        productPrice: product.productPrice,
        password, // Include password in request
      });

      if (!response) {
        throw new Error('Failed to create order');
      }

      toast({
        title: 'Message',
        description: response.data.message,
      });
      setPaymentLoading(false);
      router.push('/common/orders');
    } catch (error: unknown) {
      setPaymentLoading(false);
      console.error('Order Placement Error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to place order. Please try again.',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md mx-auto p-6 flex flex-col items-center justify-center text-center space-y-4">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
            <svg
              className="w-full h-full text-muted-foreground animate-pulse"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold">Setting Up Your Order</h2>
          <p className="text-muted-foreground">
            We&apos;re preparing everything to process your order. This will
            only take a moment.
          </p>
          <div className="flex space-x-2 mt-4">
            <div
              className="w-3 h-3 rounded-full bg-primary animate-bounce"
              style={{ animationDelay: '0s' }}
            ></div>
            <div
              className="w-3 h-3 rounded-full bg-primary animate-bounce"
              style={{ animationDelay: '0.2s' }}
            ></div>
            <div
              className="w-3 h-3 rounded-full bg-primary animate-bounce"
              style={{ animationDelay: '0.4s' }}
            ></div>
          </div>
        </Card>
      </div>
    );
  }

  if (!product) {
    return <NoProductsPage />;
  }
  return (
    <div className="min-h-screen bg-background px-4 py-8 md:px-6 md:py-12">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Product Section */}
        {product && (
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-8">
              <div className="relative aspect-video">
                <Image
                  src={product.productImages?.[0] || '/placeholder.svg'}
                  alt={product.productName || 'Product Image'}
                  fill
                  unoptimized={true}
                  className="object-cover rounded-lg"
                />
              </div>
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">{product.productName}</h2>
                <p className="text-3xl font-bold">₹{product.productPrice}</p>
                <p className="text-muted-foreground">
                  {product.productDescription}
                </p>
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Seller: {product.sellerEmail}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Address Section */}
        <Card>
          <CardHeader>
            <CardTitle>Select Delivery Address</CardTitle>
          </CardHeader>
          <CardContent>
            {address.length === 0 ? (
              <Button
                variant="outline"
                className="w-full h-32 border-dashed"
                onClick={() => router.push('/common/address')}
              >
                <Plus className="mr-2" />
                Add New Address
              </Button>
            ) : (
              <RadioGroup
                value={selectedAddressId?.toString()}
                onValueChange={(value: string) =>
                  setSelectedAddressId(Number(value))
                }
              >
                <div className="grid md:grid-cols-2 gap-4">
                  {address.map((address: Address) => (
                    <Label
                      key={address.addressID}
                      className="relative cursor-pointer rounded-lg border p-4 hover:bg-accent [&:has(:checked)]:border-primary"
                    >
                      <RadioGroupItem
                        value={address.addressID.toString()}
                        className="absolute right-4 top-4"
                      />
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <p className="font-semibold">{address.fullName}</p>
                          {address.isDefault && (
                            <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {address.streetName}
                          <br />
                          {address.city}, {address.state} {address.pincode}
                          <br />
                          {address.country}
                          <br />
                          Phone: {address.phoneNo}
                        </p>
                      </div>
                    </Label>
                  ))}
                </div>
              </RadioGroup>
            )}
          </CardContent>
        </Card>

        {/* Payment Section */}

        <Card ref={placeOrderRef}>
          <CardHeader>
            <CardTitle>Payment Account</CardTitle>
          </CardHeader>
          <CardContent>
            {payment ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Username</p>
                  <p className="font-medium">{payment.accountUsername}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Account Number
                  </p>
                  <p className="font-medium">{payment.accountNumber}</p>
                </div>
                <Input
                  type="password"
                  placeholder="Enter payment password"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
                  }
                />
              </div>
            ) : (
              <Button
                variant="outline"
                onClick={() => router.push('/common/payment')}
              >
                Add Payment Details
              </Button>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => router.push('/common/payment')}
            >
              Manage Payment Methods
            </Button>
            <Button
              variant={paymentLoading ? 'ghost' : 'default'}
              onClick={handleOrder}
              disabled={
                !payment || !selectedAddressId || !password || paymentLoading
              }
            >
              {!paymentLoading ? 'Place Order' : 'Placing The Order...'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Order;

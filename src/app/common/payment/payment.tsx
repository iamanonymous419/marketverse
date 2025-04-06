'use client';

import axios from 'axios';
import type React from 'react';
import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Loader2,
  User,
  CreditCard,
  Unlink,
  Link,
  Eye,
  EyeOff,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { PaymentSchema, type PaymentType } from '@/validation'; // Adjust this import path as needed
import type {
  ApiResponseCommon,
  ApiResponse,
  MainProps,
  Payment,
} from '@/types';

const Main: React.FC<MainProps> = ({ email, buyerId }) => {
  const [data, setData] = useState<Payment | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLinking, setIsLinking] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false); // Added showPassword state
  const { toast } = useToast();

  const form = useForm<PaymentType>({
    resolver: zodResolver(PaymentSchema),
    defaultValues: { username: '', password: '' },
  });

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get<ApiResponse<Payment>>(
          `/api/user/payment/${email}`
        );
        // console.log(response.data.data)
        setData(response.data.data || null);
        // console.log(data)
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to fetch account data.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (email) getData();
  }, [email, toast]);

  const handleUnlink = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await axios.delete<ApiResponseCommon>(
        `/api/user/payment/unlink/${data?.accountUsername}`
      );
      toast({
        title: 'Message',
        description: response.data.message,
      });
      setData(null);
    } catch (error: unknown) {
      console.error('Error unlinking account:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to unlink the account. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLink = async (formData: PaymentType): Promise<void> => {
    try {
      setIsLinking(true);
      const value = {
        buyerEmail: email,
        buyerId,
        username: formData.username,
        password: formData.password,
      };
      // console.log(value);
      const response = await axios.post<ApiResponse<Payment>>(
        '/api/user/payment',
        value
      );
      setData(response.data.data ?? null);
      toast({
        title: 'Message',
        description: response.data.message,
      });
      setIsDialogOpen(false);
    } catch (error: unknown) {
      console.error('Error linking account:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to link the account. Please try again.',
      });
    } finally {
      setIsLinking(false);
    }
  };
  // anonymous123456

  if (isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {!data ? (
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="flex flex-col justify-center items-center h-40 space-y-4">
            <p className="text-muted-foreground">No account linked.</p>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Link className="h-4 w-4 mr-2" />
                  Link Account
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Link Account</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleLink)}
                    className="space-y-4 py-4"
                  >
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showPassword ? 'text' : 'password'}
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                                <span className="sr-only">
                                  {showPassword
                                    ? 'Hide password'
                                    : 'Show password'}
                                </span>
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      disabled={isLinking}
                      className="w-full"
                    >
                      {isLinking ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Link className="h-4 w-4 mr-2" />
                      )}
                      Link Account
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full max-w-md mx-auto" key={data.accountNumber}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Linked Account
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <p>
                <span className="font-medium">Username:</span>{' '}
                {data.accountUsername}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <p>
                <span className="font-medium">Account Number:</span>{' '}
                {data.accountNumber}
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="destructive"
              onClick={handleUnlink}
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Unlink className="h-4 w-4 mr-2" />
              )}
              Unlink Account
            </Button>
          </CardFooter>
        </Card>
      )}
    </>
  );
};

export default Main;

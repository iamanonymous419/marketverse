'use client';

import { useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@apollo/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus } from 'lucide-react';
import { addressSchema, type AddressFormValues } from '@/validation';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import type { AddAddressResponse, AddressQl } from '@/types';
import { ADD_ADDRESS_MUTATION } from '@/app/api/graphql/mutations/addressMutations';

export const AddAddressDialog: React.FC<AddressQl> = ({ email, refetch }) => {
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      country: '',
      fullName: '',
      streetName: '',
      city: '',
      state: '',
      pincode: '',
      phoneNo: '',
      isDefault: false,
      email,
    },
  });

  const [addAddress, { loading }] =
    useMutation<AddAddressResponse>(ADD_ADDRESS_MUTATION);

  const onSubmit: SubmitHandler<AddressFormValues> = async (data) => {
    try {
      const { data: response } = await addAddress({
        variables: { input: data },
      });
      toast({
        title: 'Message',
        description: response?.addAddress.message,
      });
      setOpen(false);
      form.reset();
      refetch(); // Refresh the address list
    } catch (error: unknown) {
      console.error('Error submitting form:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Card className="border-2 border-dashed hover:border-primary/60 cursor-pointer transition-colors p-4 md:p-6 rounded-xl shadow-sm hover:shadow-lg">
          <CardContent className="flex flex-col items-center justify-center h-[260px] md:h-[300px] p-4">
            <Plus className="h-10 w-10 md:h-12 md:w-12 mb-3 md:mb-4 text-muted-foreground transition-all duration-200 group-hover:scale-110" />
            <span className="text-lg md:text-xl font-medium text-muted-foreground text-center">
              Add New Address
            </span>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg md:max-w-xl p-5 md:p-6 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg md:text-xl font-semibold">
            Add New Address
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter country" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="streetName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter street name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter city" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter state" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pincode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pincode</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter pincode" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="phoneNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isDefault"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-3">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="text-muted-foreground">
                    Set as default address
                  </FormLabel>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full py-2 md:py-3 text-lg rounded-lg"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Address'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

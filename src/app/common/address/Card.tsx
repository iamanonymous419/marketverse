import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { addressSchema, type AddressFormValues } from '@/validation';
import { toast } from '@/hooks/use-toast';
import type {
  Address,
  UpdateAddressResponse,
  DeleteAddressResponse,
  DefaultUpdateAddressResponse,
} from '@/types';
import { useMutation } from '@apollo/client';
import {
  DELETE_ADDRESS_MUTATION,
  UPDATE_DEFAULT_USER_ADDRESS,
  UPDATE_USER_ADDRESS,
} from '@/app/api/graphql/mutations/addressMutations';

const AddressCard = ({
  address,
  refetch,
}: {
  address: Address;
  refetch: () => void;
}) => {
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      country: address.country,
      fullName: address.fullName,
      streetName: address.streetName ?? '',
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      phoneNo: address.phoneNo,
      isDefault: address.isDefault,
      email: address.email,
      addressID: address.addressID,
    },
  });

  const [updateAddress] =
    useMutation<UpdateAddressResponse>(UPDATE_USER_ADDRESS);
  const [deleteAddress] = useMutation<DeleteAddressResponse>(
    DELETE_ADDRESS_MUTATION
  );
  const [updateDefaultAddress] = useMutation<DefaultUpdateAddressResponse>(
    UPDATE_DEFAULT_USER_ADDRESS
  );

  const onSubmit: SubmitHandler<AddressFormValues> = async (data) => {
    try {
      const { data: response } = await updateAddress({
        variables: { input: data }, // GraphQL requires variables in an object
      });

      toast({
        title: 'Message',
        description: response?.updateAddress?.message,
      });

      setOpen(false);
      form.reset();
      refetch();
    } catch (error: unknown) {
      console.error('Error submitting form:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
      });
    }
  };

  const handleRemove = async (id: number): Promise<void> => {
    try {
      const { data: response } = await deleteAddress({
        variables: { id },
      });

      toast({
        title: 'Message',
        description: response?.deleteAddress.message,
      });
      refetch(); // Refresh the address list
    } catch (error) {
      console.error('Error deleting address:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
      });
    }
  };

  const handleDefault = async (id: number): Promise<void> => {
    try {
      const { data: response } = await updateDefaultAddress({
        variables: {
          email: address.email, // Ensure this is provided
          addressId: id, // Ensure this is provided
          isDefault: true, // Ensure this is provided
        },
      });

      toast({
        title: 'Message',
        description: response?.updateDefaultAddress.message,
      });

      setOpen(false);
      form.reset();
      refetch();
    } catch (error: unknown) {
      console.error('Error updating address:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
      });
    }
  };

  return (
    <Card
      key={address.addressID}
      className="relative bg-white dark:bg-zinc-950"
    >
      {address.isDefault && (
        <div className="absolute top-4 right-4 px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-xs font-medium rounded-full">
          Default
        </div>
      )}
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg">{address.fullName}</h3>
            <p className="text-sm text-muted-foreground">
              {address.streetName}
            </p>
            <p className="text-sm text-muted-foreground">
              {address.city}, {address.state} {address.pincode}
            </p>
            <p className="text-sm text-muted-foreground">{address.country}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Phone: {address.phoneNo}
            </p>
          </div>
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="p-4 flex gap-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" className="h-auto p-0">
              Edit
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg md:max-w-xl p-5 md:p-6 rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-lg md:text-xl font-semibold">
                Update Address
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
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

                <Button
                  type="submit"
                  className="w-full py-2 md:py-3 text-lg rounded-lg"
                >
                  Update Address
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        <span className="text-muted-foreground">|</span>
        <Button
          variant="ghost"
          className="h-auto p-0"
          onClick={() => {
            handleRemove(address.addressID);
          }}
        >
          Remove
        </Button>
        {!address.isDefault && (
          <>
            <span className="text-muted-foreground">|</span>
            <Button
              variant="ghost"
              className="h-auto p-0"
              onClick={() => {
                handleDefault(address.addressID);
              }}
            >
              Set as Default
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default AddressCard;

import React, { useEffect, useState } from 'react';
import { Upload, User, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { ProfileSkeleton } from '@/components/custom/skeleton/Profile-Skeleton';
import { useFetchDataByEmailForBuyer } from '@/service/buyer-detail/fetchDataByEmail';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { updateSchema, type updateType } from '@/validation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import type { ApiResponseCommon } from '@/types';

const Main = ({ email }: { email: string }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isUploading, setUploading] = useState<boolean>(false);

  const { data, isLoading, isError, refetch } =
    useFetchDataByEmailForBuyer(email);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<updateType>({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      age: 0,
      phoneNo: '',
      gender: 'prefer-not-to-say',
      profileImageUrl: '',
      email: email,
    },
  });

  // Update form values when data is loaded
  useEffect(() => {
    if (data?.data) {
      const userData = data.data;
      reset({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        age: userData.age || 0,
        phoneNo: userData.phoneNo || '',
        gender: (userData.gender &&
        ['male', 'female', 'other', 'prefer-not-to-say'].includes(
          userData.gender
        )
          ? userData.gender
          : 'prefer-not-to-say') as
          | 'male'
          | 'female'
          | 'other'
          | 'prefer-not-to-say',
        profileImageUrl: userData.profileImageUrl || '',
        email: email,
      });
    }
  }, [data, reset, email]);
  // i love the above shit yaaaa!!!

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (isError || !data?.data) {
    return <p className="text-xl text-gray-600">No buyer info listed yet.</p>;
  }

  // Extract the first item from the data array and assign it to finalData and it's a good way, but in for seller i use a different way like array map method, but i should use this way for seller too.
  const finalData = data.data;

  const handleUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    if (!event.target.files?.[0]) return;

    try {
      setUploading(true);
      const file: File = event.target.files[0];
      const formData: FormData = new FormData();
      formData.append('file', file);
      formData.append('email', email);

      const response = await axios.put<ApiResponseCommon>(
        '/api/user/upload-image',
        formData
      );
      toast({
        title: 'Message',
        description: response.data.message,
        action: (
          <ToastAction altText="OK" onClick={() => router.refresh()}>
            OK
          </ToastAction>
        ),
      });
      refetch();
    } catch (error: unknown) {
      console.error('Error uploading image:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFormSubmit = async (formData: updateType): Promise<void> => {
    try {
      const response = await axios.put<ApiResponseCommon>(
        '/api/user/update-user',
        formData
      );
      toast({
        title: 'Message',
        description: response.data.message,
        action: (
          <ToastAction altText="OK" onClick={() => router.refresh()}>
            OK
          </ToastAction>
        ),
      });
      setIsOpen(false);
      refetch();
    } catch (error: unknown) {
      console.error('Error submitting form:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Buyer Profile Information</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>Update Profile</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Profile Information</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={handleSubmit(handleFormSubmit)}
              className="space-y-6"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-24 h-24">
                    <AvatarImage
                      src={finalData.profileImageUrl || ''}
                      alt="Profile picture"
                    />
                    <AvatarFallback>
                      {finalData.firstName?.charAt(0)}
                      {finalData.lastName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <label htmlFor="avatar-upload" className="cursor-pointer">
                  <div className="flex items-center space-x-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2 rounded-md">
                    <Upload className="w-4 h-4" />
                    <span>
                      {isUploading ? 'Uploading...' : 'Change Profile Picture'}
                    </span>
                  </div>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleUpload}
                    disabled={isUploading}
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input id="firstName" {...register('firstName')} />
                  {errors.firstName && (
                    <p className="text-sm text-red-500">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input id="lastName" {...register('lastName')} />
                  {errors.lastName && (
                    <p className="text-sm text-red-500">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    {...register('age', { valueAsNumber: true })}
                  />
                  {errors.age && (
                    <p className="text-sm text-red-500">{errors.age.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNo">Phone number</Label>
                  <Input id="phoneNo" type="tel" {...register('phoneNo')} />
                  {errors.phoneNo && (
                    <p className="text-sm text-red-500">
                      {errors.phoneNo.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select
                    onValueChange={(value) =>
                      setValue('gender', value as updateType['gender'])
                    }
                    value={watch('gender')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not-to-say">
                        Prefer not to say
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.gender && (
                    <p className="text-sm text-red-500">
                      {errors.gender.message}
                    </p>
                  )}
                </div>
              </div>

              <Button type="submit" className="w-full">
                Save Changes
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-start">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <Avatar className="w-32 h-32">
                <AvatarImage
                  src={finalData.profileImageUrl || ''}
                  alt="Profile picture"
                />
                <AvatarFallback>
                  {finalData.firstName?.charAt(0)}
                  {finalData.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-x-12">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="text-lg font-medium">
                      {finalData.firstName} {finalData.lastName}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Age</p>
                    <p className="text-lg font-medium">{finalData.age} years</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <p className="text-lg font-medium">{finalData.email}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <p className="text-lg font-medium">{finalData.phoneNo}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Gender</p>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <p className="text-lg font-medium capitalize">
                        {finalData.gender}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Main;

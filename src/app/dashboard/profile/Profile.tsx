import React, { useEffect } from 'react';
import { useState } from 'react';
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
import { useFetchDataByEmail } from '@/service/seller-detail/fetchDataByEmail';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { updateSchema, type updateType } from '@/validation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import type { ApiResponseCommon } from '@/types';

const Profile: React.FC<{ email: string }> = ({ email }) => {
  const router = useRouter();
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

  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isUploading, setUploading] = useState<boolean>(false);
  const { data, isLoading, refetch } = useFetchDataByEmail(email);

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
          : 'prefer-not-to-say') as updateType['gender'],
        profileImageUrl: userData.profileImageUrl || '',
        email: email,
      });
    }
  }, [data, reset, email]);
  // i love the above shit yaaaa!!!

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  // console.log(data.message)
  const handleUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    try {
      setUploading(true);
      const files: FileList | null = event.target.files;
      if (!files) {
        throw new Error('No files selected');
      }
      const file: File = files[0];
      const formData: FormData = new FormData();
      formData.append('file', file);
      formData.append('email', email);

      const response = await axios.put<ApiResponseCommon>(
        '/api/upload',
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
      //   console.log(data)
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

  const handleFormSubmit = async (data: updateType): Promise<void> => {
    // console.log('Form submitted:', data);
    try {
      // Log the form data
      const response = await axios.put<ApiResponseCommon>('/api/update', data);
      toast({
        title: 'Message',
        description: response.data.message,
        action: (
          <ToastAction altText="OK" onClick={() => router.refresh()}>
            OK
          </ToastAction>
        ),
      });
      // Close dialog and reset form
      setIsOpen(false);
      reset();
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

  // for images loading
  const finalData = data?.data;
  // console.log(data)
  return (
    <div className="container mx-auto py-10">
      {/* work on later  */}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Seller Profile Information</h1>
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
                      src={finalData?.profileImageUrl || ''}
                      alt="Profile picture"
                    />
                    <AvatarFallback>
                      {/* {' USER '} */}
                      {finalData?.firstName?.charAt(0) +
                        (finalData?.lastName?.charAt(0) ?? 'U') || 'USER'}
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
                  <Input
                    id="lastName"
                    {...register('lastName')}
                    className={errors.lastName ? 'border-red-500' : ''}
                  />
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
                    className={errors.age ? 'border-red-500' : ''}
                  />
                  {errors.age && (
                    <p className="text-sm text-red-500">{errors.age.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNo">Phone number</Label>
                  <Input
                    id="phoneNo"
                    type="tel"
                    {...register('phoneNo')}
                    className={errors.phoneNo ? 'border-red-500' : ''}
                  />
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
                    <SelectTrigger
                      className={errors.gender ? 'border-red-500' : ''}
                    >
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

      {/* Profile View */}
      {data ? (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-start">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <Avatar className="w-32 h-32">
                  <AvatarImage
                    src={finalData?.profileImageUrl || ''}
                    alt="Profile picture"
                  />
                  <AvatarFallback>
                    {' '}
                    {(finalData?.firstName?.charAt(0) ?? 'U') +
                      (finalData?.lastName?.charAt(0) ?? 'U') || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-x-12">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Full Name</p>
                      <p className="text-lg font-medium">
                        <span className="mr-1">{finalData?.firstName}</span>
                        <span>{finalData?.lastName}</span>
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Age</p>
                      <p className="text-lg font-medium">
                        {finalData?.age} years
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Email</p>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <p className="text-lg font-medium">
                          {finalData?.email}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <p className="text-lg font-medium">
                          {finalData?.phoneNo}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Gender</p>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <p className="text-lg font-medium capitalize">
                          {finalData?.gender}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <p className="text-xl text-gray-600">No Seller data listed yet.</p>
      )}
    </div>
  );
};

export default Profile;

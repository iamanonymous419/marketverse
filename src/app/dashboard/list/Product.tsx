'use client';

import { useState, useCallback } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import type { ApiResponseCommon, ProductFormData, SellerType } from '@/types';
import Image from 'next/image';

const CreateProduct: React.FC<SellerType> = ({ email, sellerId }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const files: File[] = Array.from(e.target.files || []);
    processFiles(files);
  };

  const processFiles = useCallback(
    (files: File[]): void => {
      if (files.length + selectedImages.length > 5) {
        alert('You can only upload up to 5 images');
        return;
      }

      // Filter for only image files
      const imageFiles: File[] = files.filter((file) =>
        file.type.startsWith('image/')
      );

      // Add new images to existing ones
      setSelectedImages((prev) => [...prev, ...imageFiles]);

      // Create preview URLs for new images
      const newPreviewUrls = imageFiles.map((file) =>
        URL.createObjectURL(file)
      );
      setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
    },
    [selectedImages.length]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files: File[] = Array.from(e.dataTransfer.files);
      processFiles(files);
    },
    [processFiles]
  );

  const removeImage = (index: number): void => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const onSubmit: SubmitHandler<ProductFormData> = async (data) => {
    if (selectedImages.length < 3) {
      alert('Please upload at least 3 images');
      return;
    }

    if (selectedImages.length > 5) {
      alert('You can only upload up to 5 images');
      return;
    }

    setIsSubmitting(true);

    const formData: FormData = new FormData();
    formData.append('productName', data.productName);
    formData.append('productPrice', data.productPrice.toLocaleString());
    formData.append('productDescription', data.productDescription);
    formData.append('sellerEmail', email);
    formData.append('sellerID', sellerId);

    selectedImages.forEach((image: File) => {
      formData.append('productImages', image);
    });

    try {
      const response = await axios.post<ApiResponseCommon>(
        '/api/add-product',
        formData
      );
      // console.log(response.data)
      toast({
        title: 'Message',
        description: response.data.message,
      });
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
      setSelectedImages([]);
      setPreviewUrls([]);
      reset();
    } catch (error: unknown) {
      console.error('Error creating product:', error);
      // alert('Failed to list a product')
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>List a New Product</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Other form fields remain the same */}
            <div>
              <Label htmlFor="productName">Product Name</Label>
              <Input
                id="productName"
                {...register('productName', {
                  required: 'Product name is required',
                })}
              />
              {errors.productName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.productName.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="productPrice">Product Price</Label>
              <Input
                id="productPrice"
                type="number"
                step="1"
                {...register('productPrice', {
                  required: 'Product price is required',
                  min: { value: 0, message: 'Price must be greater than 0' },
                  valueAsNumber: true,
                })}
              />
              {errors.productPrice && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.productPrice.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="productDescription">Product Description</Label>
              <Textarea
                id="productDescription"
                {...register('productDescription', {
                  required: 'Product description is required',
                })}
              />
              {errors.productDescription && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.productDescription.message}
                </p>
              )}
            </div>

            {/* Enhanced File Upload Section */}
            <div>
              <Label htmlFor="productImages">
                Product Images (3-5 images required)
              </Label>
              <div
                className={`mt-2 border-2 border-dashed rounded-lg p-6 transition-colors duration-200 ease-in-out relative
                  ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
                  ${selectedImages.length === 0 ? 'h-48' : ''}`}
                onDragEnter={handleDragIn}
                onDragLeave={handleDragOut}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  id="productImages"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageChange}
                />

                {selectedImages.length === 0 ? (
                  <label
                    htmlFor="productImages"
                    className="flex flex-col items-center justify-center h-full cursor-pointer"
                  >
                    <Upload className="w-12 h-12 text-gray-400 mb-3" />
                    <span className="text-gray-600 font-medium">
                      Drop your images here or click to upload
                    </span>
                    <span className="text-gray-500 text-sm mt-2">
                      Support for up to 5 images
                    </span>
                  </label>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {previewUrls.map((url, index) => (
                      <div key={url} className="relative group">
                        <Image
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                          width={180}
                          height={150}
                          unoptimized={true}
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 
                          opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}

                    {selectedImages.length < 5 && (
                      <label
                        htmlFor="productImages"
                        className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col 
                          items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
                      >
                        <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">Add more</span>
                      </label>
                    )}
                  </div>
                )}
              </div>

              {selectedImages.length < 3 && (
                <p className="text-red-500 text-sm mt-1">
                  Please upload at least 3 images
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || selectedImages.length < 3}
              className="w-full"
            >
              {isSubmitting ? 'Creating...' : 'Create Product'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateProduct;

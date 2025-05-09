'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { type ReviewFormData, reviewSchema } from '@/validation';
import axios from 'axios';
import type {
  Review,
  ApiResponse,
  ApiResponseCommon,
  ReviewProps,
} from '@/types';

const Review: React.FC<ReviewProps> = ({ productId, email }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [visibleReviews, setVisibleReviews] = useState<number>(3);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const fetchReviews = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      const res = await axios.get<ApiResponse<Review>>(
        `/api/products/review/${productId}`
      );
      setReviews(Array.isArray(res.data.data) ? res.data.data : []);
      // console.log('Reviews:', reviews);
    } catch (error: unknown) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      reviewMessage: '',
      reviewStar: 0,
      productId,
      email,
    },
  });

  const selectedStars: number = watch('reviewStar');

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const onSubmit = async (data: ReviewFormData): Promise<void> => {
    try {
      const res = await axios.post<ApiResponseCommon>(
        `/api/products/review`,
        data
      );
      toast({ title: 'Message', description: res.data.message });
      setDialogOpen(false);
      reset();
      fetchReviews(); // Refetch reviews after submission
    } catch (error: unknown) {
      console.log(error);
      toast({
        title: 'Error',
        description: 'An error occurred while submitting your review.',
      });
      setDialogOpen(false);
    }
  };

  return (
    <div className="mt-16">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Customer Reviews</h2>
      </div>

      <Card className="mb-8 p-4 border-none">
        <Button
          variant="ghost"
          className="w-full py-6"
          onClick={() => setDialogOpen(true)}
        >
          Write a Product Review
        </Button>
      </Card>

      {loading ? (
        <p className="text-center">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-center text-gray-500">No reviews found.</p>
      ) : (
        <div className="space-y-6">
          {reviews.slice(0, visibleReviews).map((review) => (
            <Card key={review.id} className="p-6">
              <div className="flex items-start gap-4">
                <Avatar>
                  {review.profileImageUrl ? (
                    <AvatarImage
                      src={review.profileImageUrl}
                      alt={`${review.firstName} ${review.lastName}`}
                    />
                  ) : (
                    <AvatarFallback>
                      {review.firstName[0]}
                      {review.lastName ? review.lastName[0] : ''}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {review.firstName} {review.lastName}
                    </span>
                    <span className="text-muted-foreground">
                      {review.reviewDate
                        ? formatDate(review.reviewDate)
                        : 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center mt-1">
                    {[...Array(review.reviewStar)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-primary text-primary"
                      />
                    ))}
                    {[...Array(5 - review.reviewStar)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-muted-foreground" />
                    ))}
                    <span className="ml-2 font-medium">
                      {review.reviewStar} Stars
                    </span>
                  </div>
                  <p className="mt-4">{review.reviewMessage}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {visibleReviews < reviews.length && (
        <Button
          variant="ghost"
          className="mt-6 w-full"
          onClick={() => setVisibleReviews((prev) => prev + 3)}
        >
          Load More Reviews
        </Button>
      )}

      {/* Review Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Textarea
              placeholder="Your Review"
              {...register('reviewMessage')}
            />
            {errors.reviewMessage && (
              <p className="text-red-500 text-sm">
                {errors.reviewMessage.message}
              </p>
            )}

            <div className="flex items-center space-x-2">
              <span>Rating:</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-6 h-6 cursor-pointer ${
                    selectedStars >= star
                      ? 'fill-primary text-primary'
                      : 'text-muted-foreground'
                  }`}
                  onClick={() => setValue('reviewStar', star)}
                />
              ))}
            </div>
            {errors.reviewStar && (
              <p className="text-red-500 text-sm">
                {errors.reviewStar.message}
              </p>
            )}

            <DialogFooter>
              <Button type="submit">Submit Review</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Review;

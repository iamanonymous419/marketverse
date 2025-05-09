import { db } from '@/db';
import { type Review, type ApiResponse } from '@/types';
import { reviews } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ no: string }> }
): Promise<NextResponse<ApiResponse<Review[]>>> {
  try {
    const no: string = (await params).no;
    const num: number = parseInt(no, 10);

    if (isNaN(num)) {
      return NextResponse.json(
        { message: 'Invalid product ID. It must be a number.' },
        { status: 400 }
      );
    }

    const review = await db
      .select()
      .from(reviews)
      .where(eq(reviews.productId, num));

    if (review.length === 0) {
      return NextResponse.json(
        { message: `Product with ID ${num} not found.`, data: review },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        message: 'Success',
        data: review,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Database error:', error);

    if (error instanceof Error) {
      return NextResponse.json(
        { message: 'Internal Server Error', error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Unknown Server Error' },
      { status: 500 }
    );
  }
}

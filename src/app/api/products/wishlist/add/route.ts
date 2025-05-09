import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db'; // Import your Drizzle DB instance
import { buyerProfile } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { type AddToCartRequest, type ApiResponseCommon } from '@/types';

export async function PUT(
  req: NextRequest
): Promise<NextResponse<ApiResponseCommon>> {
  try {
    const body: AddToCartRequest = await req.json();
    const { email, productId } = body;

    if (!email || !productId) {
      return NextResponse.json(
        { message: 'Email and productId are required' },
        { status: 400 }
      );
    }

    // Fetch buyer's wishlist
    const buyer = await db
      .select()
      .from(buyerProfile)
      .where(eq(buyerProfile.email, email))
      .limit(1);

    if (!buyer.length) {
      return NextResponse.json({ message: 'Buyer not found' }, { status: 200 });
    }

    const wishItems: number[] = Array.isArray(buyer[0].wishlistItems)
      ? buyer[0].wishlistItems
      : [];

    // Check if product already exists in the wishlist
    if (wishItems.includes(productId)) {
      return NextResponse.json({
        message: 'Product already in wishlist',
        wishItems,
      });
    }

    // Add productId to wishlist
    wishItems.push(productId);

    // Update the buyer's wishlist in the database
    await db
      .update(buyerProfile)
      .set({ wishlistItems: wishItems })
      .where(eq(buyerProfile.email, email));

    return NextResponse.json({
      message: 'Product added to wishlist',
    });
  } catch (error: unknown) {
    console.log(error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

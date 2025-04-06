import { type NextRequest, NextResponse } from 'next/server';
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
        { status: 200 }
      );
    }

    // Fetch buyer's cart
    const buyer = await db
      .select()
      .from(buyerProfile)
      .where(eq(buyerProfile.email, email))
      .limit(1);

    if (!buyer.length) {
      return NextResponse.json({ message: 'Buyer not found' }, { status: 200 });
    }

    // Ensure cartItems is an array
    const cartItems: number[] = Array.isArray(buyer[0].cartItems)
      ? buyer[0].cartItems
      : [];

    // Check if product already exists in the cart
    if (cartItems.includes(productId)) {
      return NextResponse.json(
        { message: 'Product already in cart' },
        { status: 200 }
      );
    }

    // Add productId to cart
    cartItems.push(productId);

    // Update the buyer's cart in the database
    await db
      .update(buyerProfile)
      .set({ cartItems })
      .where(eq(buyerProfile.email, email));

    return NextResponse.json({ message: 'Product added to cart' });
  } catch (error) {
    console.error('Error adding product to cart:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

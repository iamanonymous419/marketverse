import { type NextRequest, NextResponse } from 'next/server';
import { db } from '@/db'; // Import Drizzle DB instance
import { buyerProfile, products } from '@/db/schema';
import { eq, inArray } from 'drizzle-orm';
import type { ApiResponse, Product } from '@/types';

export async function POST(
  req: NextRequest
): Promise<NextResponse<ApiResponse<Product[]>>> {
  try {
    const { email }: { email: string } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 200 }
      );
    }

    // Fetch buyer's cart items
    const buyer = await db
      .select()
      .from(buyerProfile)
      .where(eq(buyerProfile.email, email))
      .limit(1);

    if (buyer.length === 0) {
      return NextResponse.json({ message: 'Buyer not found' }, { status: 200 });
    }

    const cartItems: number[] = Array.isArray(buyer[0].cartItems)
      ? buyer[0].cartItems
      : [];

    if (!cartItems.length) {
      return NextResponse.json({ message: 'Cart is empty', products: [] });
    }

    // Fetch product details for the cart items
    const cartProducts = await db
      .select()
      .from(products)
      .where(inArray(products.productId, cartItems));

    // console.log(cartProducts);

    return NextResponse.json({ message: 'Cart', data: cartProducts });
  } catch (error: unknown) {
    console.log(error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

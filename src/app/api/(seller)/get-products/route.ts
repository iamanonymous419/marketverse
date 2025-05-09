import { type NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/index';
import { products } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { type Product, type ApiResponse } from '@/types';

export async function POST(
  req: NextRequest
): Promise<NextResponse<ApiResponse<Product[]>>> {
  try {
    // Parse the JSON body
    const body = await req.json();
    const { email }: { email: string } = body;

    // Validate input
    if (!email) {
      return NextResponse.json(
        { message: 'uniqueId is required.' },
        { status: 400 }
      );
    }

    const product = await db
      .select()
      .from(products)
      .where(eq(products.sellerEmail, email));

    // Handle case when seller is not found
    if (product.length === 0) {
      return NextResponse.json(
        { message: 'no product listed' },
        { status: 200 }
      );
    }
    // console.log(product);

    // Return seller details
    return NextResponse.json(
      { message: 'data retrive', data: product },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching seller:', error);
    return NextResponse.json(
      { message: 'Internal Server Error.' },
      { status: 500 }
    );
  }
}

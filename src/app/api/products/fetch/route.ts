import { db } from '@/db';
import { products } from '@/db/schema';
import { NextResponse } from 'next/server';
import { type Product, type ApiResponse } from '@/types';

export async function GET(): Promise<NextResponse<ApiResponse<Product[]>>> {
  try {
    const product = await db
      .select()
      .from(products)
      .then((products) =>
        products.map((product) => ({
          ...product,
          productImages: product.productImages as string[],
        }))
      );

    if (product.length === 0) {
      return NextResponse.json({
        message: 'sorry, no product found in database',
      });
    }

    return NextResponse.json({ message: 'all products found', data: product });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: 'some error occurred in the server', product: null },
      { status: 500 }
    );
  }
}

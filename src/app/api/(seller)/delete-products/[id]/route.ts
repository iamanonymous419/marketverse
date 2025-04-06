import { type NextRequest, NextResponse } from 'next/server';
import { db } from '@/db'; // Adjust the import path if needed
import { products } from '@/db/schema'; // Adjust the schema path if needed
import { eq } from 'drizzle-orm';
import { type ApiResponseCommon } from '@/types';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponseCommon>> {
  const id: string = (await params).id;

  const productId: number = Number(id);
  // console.log('productId', productId);
  // export async function GET(
  //   _req: NextRequest,
  //   { params }: { params: Promise<{ email: string }> }
  // ): Promise<NextResponse<ApiResponse<Address[]>>> {
  //   const email: string = (await params).email;
  //   try {
  try {
    if (isNaN(productId)) {
      return NextResponse.json(
        { message: 'Invalid product ID' },
        { status: 400 }
      );
    }
    const deletedProduct = await db
      .delete(products)
      .where(eq(products.productId, productId));
    // console.log(deletedProduct);
    if (!deletedProduct.rowCount) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Product deleted successfully' },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

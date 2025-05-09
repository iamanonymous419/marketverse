import { type NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/index';
import { desc, eq } from 'drizzle-orm';
import { buyerAddress } from '@/db/schema';
import { Address, type ApiResponse } from '@/types';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ email: string }> }
): Promise<NextResponse<ApiResponse<Address[]>>> {
  const email: string = (await params).email;
  try {
    // Validate input
    if (!email) {
      return NextResponse.json(
        { message: 'email is required.' },
        { status: 200 }
      );
    }

    const address = (
      await db
        .select()
        .from(buyerAddress)
        .where(eq(buyerAddress.email, email))
        .orderBy(desc(buyerAddress.isDefault))
    ).map((addr) => ({
      ...addr,
      createdAt: new Date(addr.createdAt),
      updatedAt: new Date(addr.updatedAt),
    }));
    // console.log(seller);
    if (address.length === 0) {
      return NextResponse.json(
        { message: 'buyer Address not found.', data: address },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: 'success', data: address },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.log(error, 'error occur in code ');
    return NextResponse.json(
      { message: 'error find buyer address' },
      { status: 500 }
    );
  }
}

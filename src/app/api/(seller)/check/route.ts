import { type NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/index';
import { sellersTable } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Parse the JSON body
    const body = await req.json();
    const { id } = body;

    // Validate input
    if (!id) {
      return NextResponse.json(
        { message: 'uniqueId is required.' },
        { status: 400 }
      );
    }
    const seller = await db
      .select()
      .from(sellersTable)
      .where(eq(sellersTable.uniqueId, id))
      .limit(1);

    // Handle case when seller is not found
    if (seller.length === 0) {
      return NextResponse.json(
        { message: 'Seller not found.' },
        { status: 200 }
      );
    }

    // Return seller details
    return NextResponse.json(
      { message: 'Seller found.', isSeller: true },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Error fetching seller:', error);
    return NextResponse.json(
      { message: 'Internal Server Error.' },
      { status: 500 }
    );
  }
}

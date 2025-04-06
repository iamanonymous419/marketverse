import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/index';
import { sellersTable, buyerProfile } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { type ApiResponseCommon } from '@/types';

export async function POST(
  req: NextRequest
): Promise<NextResponse<ApiResponseCommon>> {
  try {
    const body = await req.json();

    const { userId, email, firstName, lastName, username, imageURL } = body;
    // console.log(body);
    // Validate input
    if (!userId || !email || !email || !firstName || !username) {
      return NextResponse.json(
        { message: 'All fields are required.' },
        { status: 400 }
      );
    }
    const existingSeller = await db
      .select()
      .from(sellersTable)
      .where(eq(sellersTable.email, email))
      .limit(1);

    // console.log('existingSeller:', existingSeller);
    if (existingSeller.length > 0) {
      return NextResponse.json(
        { message: 'this email is register for seller' },
        { status: 200 }
      );
    }

    // Check if seller already exists
    const existingBuyer = await db
      .select()
      .from(buyerProfile)
      .where(eq(buyerProfile.email, email))
      .limit(1);

    if (existingBuyer.length > 0) {
      return NextResponse.json(
        { message: 'Buyer id with this email already exists.' },
        { status: 200 }
      );
    }

    const info: typeof buyerProfile.$inferInsert = {
      uniqueId: userId,
      firstName,
      lastName,
      age: 0,
      email,
      username,
      phoneNo: '',
      gender: null,
      profileImageUrl: imageURL,
    };
    await db.insert(buyerProfile).values(info);
    // console.log(typeof buyerProfile);

    return NextResponse.json(
      { message: 'buyer added successfully.' },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Error adding buyer:', error);
    return NextResponse.json(
      { message: 'Internal Server Error.' },
      { status: 500 }
    );
  }
}

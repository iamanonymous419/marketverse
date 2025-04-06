import { type NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/index';
import { sellersTable, sellersInfoTable, buyerProfile } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();

    const { userId, email, firstName, lastName, username, imageURL } = body;
    // console.log(body);
    // Validate input
    if (
      !userId ||
      !email ||
      !email[0]?.emailAddress ||
      !firstName ||
      !username
    ) {
      return NextResponse.json(
        { message: 'All fields are required.' },
        { status: 400 }
      );
    }

    const emailAddress = email[0].emailAddress;

    // Check if seller already exists
    const existingBuyer = await db
      .select()
      .from(buyerProfile)
      .where(eq(buyerProfile.email, emailAddress));

    if (existingBuyer) {
      await db.delete(buyerProfile).where(eq(buyerProfile.email, emailAddress));
    }

    // Check if seller already exists
    const existingSeller = await db
      .select()
      .from(sellersTable)
      .where(eq(sellersTable.email, emailAddress))
      .limit(1);

    if (existingSeller.length > 0) {
      return NextResponse.json(
        { message: 'Seller with this email already exists.' },
        { status: 400 }
      );
    }
    const info: typeof sellersInfoTable.$inferInsert = {
      uniqueId: userId,
      firstName,
      lastName,
      age: 0,
      email: emailAddress,
      username,
      phoneNo: '',
      gender: null,
      profileImageUrl: imageURL,
    };
    await db.insert(sellersInfoTable).values(info);

    // Insert data into sellers table

    await db.insert(sellersTable).values({
      email: emailAddress,
      uniqueId: userId,
      username,
      firstName,
      lastName,
    });

    return NextResponse.json(
      { message: 'Seller added successfully.' },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Error adding seller:', error);
    return NextResponse.json(
      { message: 'Internal Server Error.' },
      { status: 500 }
    );
  }
}

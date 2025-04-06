import { type NextRequest, NextResponse } from 'next/server';
import { db } from '@/db'; // Adjust the import path if needed
import { buyerPayment } from '@/db/schema'; // Adjust the schema path if needed
import { eq } from 'drizzle-orm';
import { type Payment, type ApiResponse } from '@/types';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ email: string }> }
): Promise<NextResponse<ApiResponse<Payment>>> {
  const email: string = (await params).email;

  if (!email)
    return NextResponse.json({ message: 'email is requreid' }, { status: 200 });

  try {
    const result = await db
      .select()
      .from(buyerPayment)
      .where(eq(buyerPayment.buyerEmail, email))
      .limit(1);

    if (result.length === 0)
      return NextResponse.json(
        { message: 'no payment account found', data: result[0] },
        { status: 200 }
      );

    return NextResponse.json(
      { message: 'payment account found', data: result[0] },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
  }

  return NextResponse.json(
    { message: 'some internal error found' },
    { status: 200 }
  );
}

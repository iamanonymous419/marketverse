import { type NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/index';
import { buyerPayment } from '@/db/schema'; // Adjust the schema path if needed
import { eq } from 'drizzle-orm';
import { type ApiResponseCommon } from '@/types';

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
): Promise<NextResponse<ApiResponseCommon>> {
  const username: string = (await params).username;
  try {
    await db
      .delete(buyerPayment)
      .where(eq(buyerPayment.accountUsername, username));
    return NextResponse.json(
      { message: 'payment account unlink' },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.log(error);
  }
  return NextResponse.json(
    { message: 'getting some kind of error' },
    { status: 200 }
  );
}

import { type NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/index';
import { sellersInfoTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { updateSchema } from '@/validation';
import { type ApiResponseCommon } from '@/types';

export async function PUT(
  req: NextRequest
): Promise<NextResponse<ApiResponseCommon>> {
  try {
    // Parse request body
    const data = await req.json().catch(() => null);

    if (!data) {
      return NextResponse.json(
        { message: 'Invalid request body' },
        { status: 400 }
      );
    }

    // Validate input data
    const validationResult = updateSchema.safeParse(data);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          message: 'Validation failed',
          errors: validationResult.error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    // Check if buyer exists
    const existingSeller = await db
      .select()
      .from(sellersInfoTable)
      .where(eq(sellersInfoTable.email, data.email))
      .limit(1);

    if (existingSeller.length === 0) {
      return NextResponse.json({ message: 'Buyer not found' }, { status: 404 });
    }

    // Update buyer profile
    const result = await db
      .update(sellersInfoTable)
      .set({
        firstName: data.firstName,
        lastName: data.lastName,
        age: data.age,
        phoneNo: data.phoneNo,
        gender: data.gender,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(sellersInfoTable.email, data.email))
      .returning();

    if (!result.length) {
      return NextResponse.json({ message: 'Update failed' }, { status: 500 });
    }

    return NextResponse.json(
      {
        message: 'Seller updated successfully',
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Error updating buyer:', error);

    // Handle specific database errors
    if (error instanceof Error) {
      if (error.message.includes('unique constraint')) {
        return NextResponse.json(
          { message: 'This email is already registered' },
          { status: 409 }
        );
      }

      if (error.message.includes('foreign key constraint')) {
        return NextResponse.json(
          { message: 'Invalid reference in the data' },
          { status: 400 }
        );
      }
    }

    // Generic error response
    return NextResponse.json(
      {
        message: 'An unexpected error occurred',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

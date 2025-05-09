// export const dynamic = 'force-static';
import { type NextRequest } from 'next/server';
import { db } from '@/db/index';
import { newsletterTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { type ApiResponseCommon } from '@/types';

export async function POST(
  req: NextRequest
): Promise<NextResponse<ApiResponseCommon>> {
  try {
    const body = await req.json();
    const { email }: { email: string } = body;

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required.' },
        { status: 200 }
      );
    }

    // Check if email already exists
    const existing = await db
      .select()
      .from(newsletterTable)
      .where(eq(newsletterTable.email, email));

    if (existing.length > 0) {
      return NextResponse.json(
        { message: 'Email already subscribed.' },
        { status: 200 }
      );
    }

    await db.insert(newsletterTable).values({ email });
    return NextResponse.json(
      { message: 'Subscription successful!' },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Error subscribing to newsletter:', error);
    return NextResponse.json(
      { message: 'Internal server error.' },
      { status: 500 }
    );
  } finally {
    console.log('Finally the newsletter route is working');
  }
}

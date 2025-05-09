import { db } from '@/db';
import { orders } from '@/db/schema';
import { type ApiResponseCommon } from '@/types';
import transporter from '@/utils/nodemailer';
import { and, eq } from 'drizzle-orm';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
): Promise<NextResponse<ApiResponseCommon>> {
  const Id: string = (await params).orderId;
  const ID: number = parseInt(Id);
  try {
    if (!ID) {
      return NextResponse.json({ message: 'ID is required.' }, { status: 200 });
    }

    //   find the order with the ID
    const order = await db
      .select()
      .from(orders)
      .where(eq(orders.orderId, ID))
      .limit(1);

    const buyerEmail: string = order[0].buyerEmail;

    // set order state to cancelled
    await db
      .update(orders)
      .set({ status: 'delivered' })
      .where(and(eq(orders.status, 'approve'), eq(orders.orderId, ID)))
      .returning();

    // console.log(result);

    // Send email notification
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: buyerEmail,
      subject: 'Your Order Has Been delivered',
      html: `
          <h1>Order delivered</h1>
          <p>Dear Customer,</p>
          <p>Your order (Order ID: <strong>${Id}</strong>) has been successfully delivered.</p>
          <p>The amount has been refunded to your original payment method.</p>
          <p>If you have any questions, please contact our support team.</p>
          <p>Thank you,</p>
          <p><strong>Marketverse Team</strong></p>
        `,
    });

    return NextResponse.json({ message: 'Order delivered' }, { status: 200 });
  } catch (error: unknown) {
    console.log(error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

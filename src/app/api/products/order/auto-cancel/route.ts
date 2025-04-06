import axios from 'axios';
import { and, eq, lt } from 'drizzle-orm';
import { db } from '@/db';
import { orders } from '@/db/schema';
import transporter from '@/utils/nodemailer';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Calculate 24 hours ago
    const oneDayAgo: Date = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    // Find all pending orders older than 24 hours
    const pendingOrders = await db
      .select({
        orderId: orders.orderId,
        buyerEmail: orders.buyerEmail,
        transactionN0: orders.transactionN0,
      })
      .from(orders)
      .where(
        and(
          eq(orders.status, 'pending'),
          lt(orders.orderAt, oneDayAgo.toISOString())
        )
      );

    if (pendingOrders.length === 0) {
      return NextResponse.json(
        { message: 'No pending orders older than 24 hours found.' },
        { status: 200 }
      );
    }

    // Process refunds and cancel each order
    for (const order of pendingOrders) {
      try {
        const { transactionN0, orderId, buyerEmail } = order;

        // Fetch transaction details
        const orderCall = await axios.get(
          `https://marketverse-banking.onrender.com/transaction/transaction/${transactionN0}`
        );

        const transactionData = orderCall.data;

        // Prepare refund data
        const refundData = {
          amount: transactionData.amount,
          senderAccNo: transactionData.receiverAccNo,
          receiverAccNo: transactionData.senderAccNo,
        };

        // Process refund
        await axios.post(
          `https://marketverse-banking.onrender.com/transaction/cancel`,
          refundData
        );

        // Update order status to "cancelled"
        await db
          .update(orders)
          .set({ status: 'cancelled' })
          .where(eq(orders.orderId, orderId));

        // Send email notification
        await transporter.sendMail({
          from: process.env.SMTP_FROM,
          to: buyerEmail,
          subject: 'Your Order Has Been Cancelled',
          html: `
            <h1>Order Cancelled</h1>
            <p>Dear Customer,</p>
            <p>Your order (Order ID: <strong>${orderId}</strong>) has been automatically cancelled as it was not processed within 24 hours.</p>
            <p>The amount has been refunded to your original payment method.</p>
            <p>If you have any questions, please contact our support team.</p>
            <p>Thank you,</p>
            <p><strong>Marketverse Team</strong></p>
          `,
        });

        console.log(`Cancellation email sent to ${buyerEmail}`);
      } catch (refundError) {
        console.error(
          `Failed to process refund for order ${order.orderId}:`,
          refundError
        );
      }
    }

    return NextResponse.json(
      {
        message: `Processed ${pendingOrders.length} order cancellations and refunds.`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing order cancellations:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

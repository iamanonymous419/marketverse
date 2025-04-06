import { db } from '@/db';
import {
  buyerAddress,
  buyerPayment,
  buyerProfile,
  orders,
  paymentAccount,
  products,
  sellersInfoTable,
} from '@/db/schema';
import { type Order, type ApiResponse } from '@/types';
import transporter from '@/utils/nodemailer';
import axios from 'axios';
import { and, eq } from 'drizzle-orm';
import { type NextRequest, NextResponse } from 'next/server';

export async function POST(
  req: NextRequest
): Promise<NextResponse<ApiResponse<Order>>> {
  try {
    const data = await req.json();
    if (!data) {
      return NextResponse.json({ message: 'Invalid data' }, { status: 200 });
    }

    // console.log('data', data);
    const {
      buyerEmail,
      sellerEmail,
      productId,
      addressID,
      accountNumber,
      accountUsername,
      password,
      productPrice,
    } = data;

    // Fetch buyer details
    const buyer = (await db
      .select()
      .from(buyerProfile)
      .where(eq(buyerProfile.email, buyerEmail))
      .limit(1)) as unknown as {
      wishlistItems: { id: number }[];
      cartItems: { id: number }[];
    }[];

    if (!buyer.length)
      return NextResponse.json({ message: 'Buyer not found' }, { status: 200 });

    // console.log('Buyer:', buyer);

    // Fetch seller
    const seller = await db
      .select()
      .from(sellersInfoTable)
      .where(eq(sellersInfoTable.email, sellerEmail))
      .limit(1);

    if (!seller.length)
      return NextResponse.json(
        { message: 'Seller not found' },
        { status: 404 }
      );

    // console.log('Seller:', seller);

    // Check if seller has a payment account
    const sellerPayment = await db
      .select()
      .from(paymentAccount)
      .where(eq(paymentAccount.sellerEmail, sellerEmail))
      .limit(1);

    if (!sellerPayment.length) {
      return NextResponse.json(
        { message: 'Seller payment account not found' },
        { status: 404 }
      );
    }

    // Fetch buyer address
    const address = await db
      .select()
      .from(buyerAddress)
      .where(eq(buyerAddress.addressID, addressID))
      .limit(1);

    if (!address.length)
      return NextResponse.json(
        { message: 'Address not found' },
        { status: 404 }
      );

    // Fetch product details
    const product = await db
      .select()
      .from(products)
      .where(eq(products.productId, productId))
      .limit(1);

    if (!product.length)
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );

    // Validate buyer's payment
    const payment = await db
      .select()
      .from(buyerPayment)
      .where(
        and(
          eq(buyerPayment.accountNumber, accountNumber),
          eq(buyerPayment.accountUsername, accountUsername)
        )
      )
      .limit(1);

    if (!payment.length)
      return NextResponse.json(
        { message: 'Payment not found' },
        { status: 404 }
      );

    // Simulate a payment gateway transaction
    const orderData = {
      senderAccNo: accountNumber,
      senderAccPassword: password,
      receiverAccNo: sellerPayment[0].accountNumber,
      amount: productPrice,
    };

    const orderCall = await axios.post(
      'https://marketverse-banking.onrender.com/transaction/transfer',
      orderData
    );

    if (orderCall.data.message !== 'Transaction successful') {
      return NextResponse.json(
        { message: `Payment failed: ${orderCall.data.message}` },
        { status: 400 }
      );
    }

    // Insert order into database
    const orderId = Math.floor(10000 + Math.random() * 90000);
    const result = await db.insert(orders).values({
      orderId,
      buyerEmail,
      sellerEmail,
      status: 'pending',
      productId,
      addressID,
      accountNumber,
      accountUsername,
      transactionN0: orderCall.data.transaction.transactionNo,
    });

    if (!result.rowCount || result.rowCount === 0) {
      return NextResponse.json(
        { message: 'Order not placed' },
        { status: 500 }
      );
    }

    // fix the below error
    // Update buyer's cart & wishlist
    const updatedCart = buyer[0].cartItems.filter((item) => item !== productId);
    const updatedWishlist = buyer[0].wishlistItems.filter(
      (item) => item !== productId
    );

    // console.log(updatedCart, updatedWishlist, 'here my bio');

    // console.log(updatedCart, updatedWishlist, 'here my bio');
    await db
      .update(buyerProfile)
      .set({ cartItems: updatedCart })
      .where(eq(buyerProfile.email, buyerEmail));
    await db
      .update(buyerProfile)
      .set({ wishlistItems: updatedWishlist })
      .where(eq(buyerProfile.email, buyerEmail));

    // Send email notification
    const mailOptions = {
      from: process.env.EMAIL_USER || 'default@example.com',
      to: buyerEmail,
      subject: 'Order Confirmation',
      html: `
        <h1>Order Confirmation</h1>
        <p>Your order ID is <strong>${orderId}</strong>.</p>
        <p>Product: ${product[0].productName}</p>
        <p>Price: ₹${productPrice}</p>
        <p>Status: <strong>Pending</strong></p>
        <p>We will update you once the seller confirms the order.</p>
        <p>Best regards,<br>MarketVerse Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json(
      { message: 'Order placed successfully!' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

// will check or later

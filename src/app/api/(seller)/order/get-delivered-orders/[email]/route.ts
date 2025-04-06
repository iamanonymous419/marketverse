import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { buyerAddress, buyerPayment, orders, products } from '@/db/schema';
import { and, eq } from 'drizzle-orm';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ email: string }> }
): Promise<NextResponse> {
  const sellerEmail = (await params).email;
  try {
    if (!sellerEmail) {
      return NextResponse.json(
        { message: 'Buyer email is required.' },
        { status: 200 }
      );
    }

    const findOrders = await db
      .select()
      .from(orders)
      .where(
        and(eq(orders.sellerEmail, sellerEmail), eq(orders.status, 'delivered'))
      );
    console.log(findOrders);
    if (!findOrders || findOrders.length === 0) {
      return NextResponse.json(
        { message: 'No orders found for this buyer.', data: [] },
        { status: 200 }
      );
    }

    const buyerEmail = findOrders[0].buyerEmail;

    // Fetch orders for the buyer
    const buyerOrders = await db
      .select({
        orderID: orders.orderId,
        orderStatus: orders.status,
        orderDate: orders.orderAt,
        sellerEmail: orders.sellerEmail,
        buyerEmail: orders.buyerEmail,
        address: {
          fullName: buyerAddress.fullName,
          streetName: buyerAddress.streetName,
          city: buyerAddress.city,
          state: buyerAddress.state,
          pincode: buyerAddress.pincode,
          phoneNo: buyerAddress.phoneNo,
        },
        products: {
          productName: products.productName,
          productPrice: products.productPrice,
          productDescription: products.productDescription,
        },
        paymentAccount: {
          accountUsername: buyerPayment.accountUsername,
          accountNumber: buyerPayment.accountNumber,
        },
      })
      .from(orders)
      .where(
        and(eq(orders.buyerEmail, buyerEmail), eq(orders.status, 'delivered'))
      )
      .leftJoin(products, eq(orders.productId, products.productId))
      .leftJoin(buyerAddress, eq(orders.addressID, buyerAddress.addressID))
      .leftJoin(
        buyerPayment,
        eq(orders.accountNumber, buyerPayment.accountNumber)
      );

    if (!buyerOrders.length) {
      return NextResponse.json(
        { message: 'No orders found for this buyer.', data: [] },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: 'orders are successfully fetch', data: buyerOrders },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: 'some error occur in server' },
      { status: 500 }
    );
  }
}

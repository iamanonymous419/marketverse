import { type NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/index';
import { paymentAccount } from '@/db/schema';
import axios from 'axios';
import { type AccountData, type ApiResponse } from '@/types';

export async function POST(
  req: NextRequest
): Promise<NextResponse<ApiResponse<AccountData>>> {
  const body = await req.json();
  const { username, password, sellerId, sellerEmail } = body;

  if (!username || !password)
    return NextResponse.json({ message: 'all field are needed' });
  if (!sellerEmail || !sellerId)
    return NextResponse.json({ message: 'all field are needed' });

  try {
    const data = await axios.post(
      'https://marketverse-banking.onrender.com/auth/login',
      body
    );

    const finalData = await data.data;
    if (!data.data.success) {
      return NextResponse.json({
        message: 'plz given correct username and password',
      });
    }
    // console.log(data.data);
    // console.log(data.data.user.accountNumber);

    const insertData: typeof paymentAccount.$inferInsert = {
      accountUsername: finalData.user.username,
      accountNumber: finalData.user.accountNumber,
      sellerId,
      sellerEmail,
    };

    await db.insert(paymentAccount).values(insertData);
    const responseData: AccountData = {
      accountUsername: finalData.user.username,
      accountNumber: finalData.user.accountNumber,
      sellerId,
      sellerEmail,
    };
    return NextResponse.json({
      message: 'payment account link successfully',
      data: responseData,
    });
  } catch (error: unknown) {
    console.log(error);
  }

  return NextResponse.json({ message: 'working' });
}

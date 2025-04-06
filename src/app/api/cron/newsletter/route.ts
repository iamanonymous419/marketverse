// app/api/cron/newsletter/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/db/index';
import { newsletterTable } from '@/db/schema';
import cron from 'node-cron';

// Configure nodemailer
import transporter from '@/utils/nodemailer';

// Function to send weekly newsletter
async function sendWeeklyNewsletter() {
  try {
    // Fetch all subscribers from the database
    const subscribers = await db.select().from(newsletterTable);

    // Your newsletter content
    const mailOptions = {
      from: process.env.SMTP_FROM,
      subject: 'Weekly Newsletter from Marketverse',
      html: `
        <h1>Welcome to Our Weekly Newsletter!</h1>
        <p>Here are this week's updates...</p>
        <!-- Add your newsletter content here -->
      `,
    };

    // Send email to each subscriber
    for (const subscriber of subscribers) {
      await transporter.sendMail({
        ...mailOptions,
        to: subscriber.email,
      });

      console.log(`Newsletter sent to ${subscriber.email}`);
    }

    return { success: true, message: 'Newsletters sent successfully' };
  } catch (error: unknown) {
    console.error('Error sending newsletters:', error);
    return { success: false, message: 'error.message ' };
  }
}

// Schedule the task to run every Monday at 10 AM
cron.schedule(
  '0 10 * * 1',
  async () => {
    await sendWeeklyNewsletter();
  },
  {
    timezone: 'UTC',
  }
);

// API route handler
export async function GET() {
  try {
    const result = await sendWeeklyNewsletter();
    return NextResponse.json(result);
  } catch (error: unknown) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: ' error.message' },
      { status: 500 }
    );
  }
}

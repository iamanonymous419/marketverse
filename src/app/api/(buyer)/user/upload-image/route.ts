import cloudinary from '@/utils/cloudinary';
import { type NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/index';
import { buyerProfile } from '@/db/schema';
import { eq } from 'drizzle-orm';
import sharp from 'sharp';
import { type ApiResponseCommon, type CloudinaryUploadResponse } from '@/types';

export async function PUT(
  request: NextRequest
): Promise<NextResponse<ApiResponseCommon>> {
  try {
    const formData: FormData = await request.formData();
    const file: FormDataEntryValue | null = formData.get('file');
    const email: FormDataEntryValue | null = formData.get('email');

    if (!file) {
      return NextResponse.json(
        { message: 'No file uploaded' },
        { status: 400 }
      );
    }

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { message: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Type guard for file
    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { message: 'No valid file uploaded' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const fileBuffer: ArrayBuffer = await file.arrayBuffer();
    const buffer: Buffer<ArrayBufferLike> = Buffer.from(fileBuffer);

    // Process image with Sharp
    const processedImageBuffer: Buffer<ArrayBufferLike> = await sharp(buffer)
      .resize(800, 800, {
        // Resize to maximum dimensions while maintaining aspect ratio
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({
        // Convert to JPEG and compress
        quality: 80,
        mozjpeg: true,
      })
      .toBuffer();

    // Convert processed buffer to base64
    const base64String: string = processedImageBuffer.toString('base64');
    const uploadString: string = `data:image/jpeg;base64,${base64String}`;

    // Upload to Cloudinary
    const result: CloudinaryUploadResponse = await cloudinary.uploader.upload(
      uploadString,
      {
        folder: 'profile_images',
        transformation: [
          { quality: 'auto' }, // Let Cloudinary optimize quality
          { fetch_format: 'auto' }, // Auto-select best format
        ],
      }
    );

    // Update database with new image URL
    await db
      .update(buyerProfile)
      .set({ profileImageUrl: result.secure_url })
      .where(eq(buyerProfile.email, email))
      .returning();

    return NextResponse.json(
      {
        message: 'File uploaded and compressed successfully',
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Upload error:', error);
    return NextResponse.json(
      {
        error: 'Upload failed',
        message:
          error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}

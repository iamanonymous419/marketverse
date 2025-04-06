import cloudinary from '@/utils/cloudinary';
import { type NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/index';
import { products } from '@/db/schema';
import sharp from 'sharp';
import { type ApiResponseCommon } from '@/types';
import { type UploadApiResponse } from 'cloudinary';

export async function POST(
  req: NextRequest
): Promise<NextResponse<ApiResponseCommon>> {
  try {
    const body = await req.formData();

    // Get all product images from the request
    const productImages: File[] = body.getAll('productImages') as File[];
    if (!productImages?.length) {
      return NextResponse.json(
        { message: 'No images provided' },
        { status: 400 }
      );
    }

    // Validate other fields (keeping your existing validation)
    const rawPrice: FormDataEntryValue | null = body.get('productPrice');
    const productPrice: number = Number(rawPrice);

    if (isNaN(productPrice) || productPrice <= 0) {
      return NextResponse.json(
        { message: 'Invalid product price. Price must be a positive number.' },
        { status: 400 }
      );
    }

    if (
      !body.get('productName') ||
      !rawPrice ||
      !body.get('productDescription') ||
      !body.get('sellerID')
    ) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    function generateFiveDigitCode(): number {
      return Math.floor(10000 + Math.random() * 90000);
    }
    const productId: number = generateFiveDigitCode();

    // Modified image upload process with compression
    const uploadPromises: Promise<string>[] = productImages.map(
      async (image: File): Promise<string> => {
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);
        // Compress the image using Sharp
        const compressedImageBuffer: Buffer = await sharp(buffer)
          .resize(1080, 1080, {
            // Resize to maximum dimensions while maintaining aspect ratio
            fit: 'inside',
            withoutEnlargement: true,
          })
          .jpeg({
            // Convert to JPEG and compress
            quality: 80, // Adjust quality (0-100)
            mozjpeg: true, // Use mozjpeg compression
          })
          .toBuffer();

        // Convert compressed buffer to base64
        const base64String: string = compressedImageBuffer.toString('base64');
        const uploadString: string = `data:image/jpeg;base64,${base64String}`;

        // Upload to Cloudinary with additional optimization options
        const result: UploadApiResponse = await cloudinary.uploader.upload(
          uploadString,
          {
            folder: 'products',
            transformation: [
              { quality: 'auto:good' }, // Let Cloudinary optimize quality
              { fetch_format: 'auto' }, // Automatically choose best format
              { strip: true }, // Strip unnecessary metadata
            ],
            resource_type: 'image',
          }
        );

        return result.secure_url;
      }
    );

    const uploadedImages: string[] = await Promise.all(uploadPromises);

    // Prepare and insert product data (keeping your existing code)
    const info: typeof products.$inferInsert = {
      productName: body.get('productName') as string,
      productId,
      sellerId: body.get('sellerID') as string,
      sellerEmail: body.get('sellerEmail') as string,
      productPrice: Math.floor(productPrice),
      productDescription: body.get('productDescription') as string,
      productImages: uploadedImages,
    };

    await db.insert(products).values(info);

    return NextResponse.json(
      { message: 'Product successfully listed in MarketVerse' },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Error uploading product:', error);
    return NextResponse.json(
      { message: 'Failed to upload product' },
      { status: 500 }
    );
  }
}

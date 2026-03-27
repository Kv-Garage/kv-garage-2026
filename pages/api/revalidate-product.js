import { NextRequest, NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    // Revalidate the specific product page
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/revalidate?path=/shop/${productId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return NextResponse.json({ success: true, message: 'Product revalidated' });
  } catch (error) {
    console.error('Revalidation failed:', error);
    return NextResponse.json({ error: 'Revalidation failed' }, { status: 500 });
  }
}
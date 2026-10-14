import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import ShoeModel from '@/models/Shoe';
import { INITIAL_SHOES } from '@/data/shoes';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const conn = await connectToDatabase();

    if (conn) {
      const shoe = await ShoeModel.findOne({ id }).lean();
      if (shoe) {
        return NextResponse.json({ success: true, data: shoe });
      }
    }

    const localShoe = INITIAL_SHOES.find((s) => s.id === id);
    if (localShoe) {
      return NextResponse.json({ success: true, data: localShoe });
    }

    return NextResponse.json(
      { success: false, error: 'Shoe not found' },
      { status: 404 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error fetching shoe' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { author, rating, title, comment, fitFeedback } = body;

    const newReview = {
      id: `rev-${Date.now()}`,
      author: author || 'Shoe Fanatic',
      rating: Number(rating) || 5,
      date: 'Just now',
      title: title || 'Great fit',
      comment: comment || 'Very comfortable shoes.',
      verified: true,
      fitFeedback: fitFeedback || 'True to Size',
    };

    const conn = await connectToDatabase();
    if (conn) {
      const updated = await ShoeModel.findOneAndUpdate(
        { id },
        {
          $push: { reviews: newReview },
          $inc: { reviewCount: 1 },
        },
        { new: true }
      );
      if (updated) {
        return NextResponse.json({ success: true, data: newReview });
      }
    }

    // In-memory update
    const shoe = INITIAL_SHOES.find((s) => s.id === id);
    if (shoe) {
      shoe.reviews.unshift(newReview as any);
      shoe.reviewCount += 1;
    }

    return NextResponse.json({ success: true, data: newReview });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to submit review' },
      { status: 500 }
    );
  }
}

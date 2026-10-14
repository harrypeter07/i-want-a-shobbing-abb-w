import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import ShoeModel from '@/models/Shoe';
import { INITIAL_SHOES } from '@/data/shoes';

export async function POST() {
  try {
    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json({
        success: true,
        message: 'Operating in in-memory mode (MongoDB not connected). Data is ready!',
        count: INITIAL_SHOES.length,
      });
    }

    await ShoeModel.deleteMany({});
    const inserted = await ShoeModel.insertMany(INITIAL_SHOES);

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${inserted.length} shoes to MongoDB!`,
      count: inserted.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Seeding failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return POST();
}

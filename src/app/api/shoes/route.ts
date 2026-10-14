import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import ShoeModel from '@/models/Shoe';
import { INITIAL_SHOES } from '@/data/shoes';
import { Shoe } from '@/types/shoe';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const gender = searchParams.get('gender');
    const search = searchParams.get('search')?.toLowerCase();
    const sort = searchParams.get('sort') || 'featured';
    const tag = searchParams.get('tag');

    // Attempt MongoDB connection
    const conn = await connectToDatabase();
    let shoes: Shoe[] = [];

    if (conn) {
      try {
        const count = await ShoeModel.countDocuments();
        if (count === 0) {
          await ShoeModel.insertMany(INITIAL_SHOES);
        }

        const query: any = {};
        if (category && category !== 'All') {
          query.category = category;
        }
        if (brand && brand !== 'All') {
          query.brand = brand;
        }
        if (gender && gender !== 'All') {
          query.$or = [{ gender: gender }, { gender: 'Unisex' }];
        }
        if (tag && tag !== 'All') {
          query.tag = tag;
        }
        if (search) {
          query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { brand: { $regex: search, $options: 'i' } },
            { category: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
          ];
        }

        let sortOption: any = {};
        if (sort === 'price-low') sortOption.price = 1;
        else if (sort === 'price-high') sortOption.price = -1;
        else if (sort === 'rating') sortOption.rating = -1;
        else if (sort === 'newest') sortOption.releaseYear = -1;

        const dbShoes = await ShoeModel.find(query).sort(sortOption).lean();
        shoes = dbShoes.map((s: any) => ({
          ...s,
          id: s.id || s._id.toString(),
        })) as Shoe[];
      } catch (dbErr) {
        console.warn('DB query error, falling back to local dataset:', dbErr);
        shoes = filterAndSortInMemory(INITIAL_SHOES, { category, brand, gender, search, sort, tag });
      }
    } else {
      shoes = filterAndSortInMemory(INITIAL_SHOES, { category, brand, gender, search, sort, tag });
    }

    return NextResponse.json({
      success: true,
      count: shoes.length,
      data: shoes,
      source: conn ? 'mongodb' : 'in-memory',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch shoes' },
      { status: 500 }
    );
  }
}

function filterAndSortInMemory(
  allShoes: Shoe[],
  params: {
    category?: string | null;
    brand?: string | null;
    gender?: string | null;
    search?: string | null;
    sort?: string | null;
    tag?: string | null;
  }
) {
  let result = [...allShoes];

  if (params.category && params.category !== 'All') {
    result = result.filter((s) => s.category.toLowerCase() === params.category?.toLowerCase());
  }

  if (params.brand && params.brand !== 'All') {
    result = result.filter((s) => s.brand.toLowerCase() === params.brand?.toLowerCase());
  }

  if (params.gender && params.gender !== 'All') {
    result = result.filter(
      (s) => s.gender === params.gender || s.gender === 'Unisex'
    );
  }

  if (params.tag && params.tag !== 'All') {
    result = result.filter((s) => s.tag === params.tag);
  }

  if (params.search) {
    const q = params.search.toLowerCase();
    result = result.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.brand.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
    );
  }

  if (params.sort === 'price-low') {
    result.sort((a, b) => a.price - b.price);
  } else if (params.sort === 'price-high') {
    result.sort((a, b) => b.price - a.price);
  } else if (params.sort === 'rating') {
    result.sort((a, b) => b.rating - a.rating);
  } else if (params.sort === 'reviews') {
    result.sort((a, b) => b.reviewCount - a.reviewCount);
  } else if (params.sort === 'newest') {
    result.sort((a, b) => (b.releaseYear || 2025) - (a.releaseYear || 2025));
  }

  return result;
}

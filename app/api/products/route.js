import { NextResponse } from 'next/server';
import { getProducts } from '@/lib/supabase';
export async function GET(req) {
  const sp = new URL(req.url).searchParams;
  const items = await getProducts(Math.max(0, +sp.get('offset') || 0), Math.min(20, +sp.get('limit') || 10));
  return NextResponse.json(items, { headers: { 'Cache-Control': 'public, max-age=300, s-maxage=300, stale-while-revalidate=600' } });
}

import { NextResponse as R } from 'next/server';
import { admin } from '@/lib/supabase';
export async function POST(req) {
  const { name, phone, address, items } = await req.json();
  if (!name || !phone || !address || !items?.length) return R.json({ error: 'سب خانے بھریں' }, { status: 400 });
  const sb = admin();
  const { data } = await sb.from('products').select('id,price').in('id', items.map((i) => i.id));
  const price = Object.fromEntries((data || []).map((p) => [p.id, p.price])); // قیمت سرور سے، کلائنٹ پر بھروسہ نہیں
  const total = items.reduce((s, i) => s + (price[i.id] || 0) * Math.max(1, +i.qty || 1), 0);
  await sb.from('orders').insert({ customer_name: name, phone, address, total, items });
  return R.json({ ok: true, total });
}

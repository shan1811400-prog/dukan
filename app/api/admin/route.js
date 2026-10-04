import { NextResponse as R } from 'next/server';
import { admin, userFrom } from '@/lib/supabase';
async function guard(req) { const u = await userFrom(req); return u && u.email === process.env.ADMIN_EMAIL; }
export async function GET(req) {
  if (!(await guard(req))) return R.json({ error: 'آپ ایڈمن نہیں' }, { status: 403 });
  const sb = admin();
  const [v, o, p] = await Promise.all([
    sb.from('vendors').select('*'),
    sb.from('orders').select('*').order('created_at', { ascending: false }).limit(100),
    sb.from('products').select('id,name,price,vendor_id').order('created_at', { ascending: false }).limit(200),
  ]);
  return R.json({ vendors: v.data || [], orders: o.data || [], products: p.data || [] });
}
export async function POST(req) {
  if (!(await guard(req))) return R.json({ error: 'آپ ایڈمن نہیں' }, { status: 403 });
  const { action, id, value } = await req.json(), sb = admin();
  if (action === 'approve') await sb.from('vendors').update({ is_approved: true }).eq('id', id);
  if (action === 'block') await sb.from('vendors').update({ is_approved: false }).eq('id', id);
  if (action === 'rename') await sb.from('vendors').update({ shop_name: value }).eq('id', id);
  if (action === 'deleteVendor') await sb.from('vendors').delete().eq('id', id);
  if (action === 'setPrice') await sb.from('products').update({ price: +value }).eq('id', id);
  if (action === 'deleteProduct') await sb.from('products').delete().eq('id', id);
  return R.json({ ok: 1 });
}

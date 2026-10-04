import { NextResponse as R } from 'next/server';
import { admin, userFrom } from '@/lib/supabase';
import { toWebp } from '@/lib/compress';
export const runtime = 'nodejs';
const err = (m, s = 400) => R.json({ error: m }, { status: s });

export async function GET(req) {
  const u = await userFrom(req); if (!u) return err('login', 401);
  const sb = admin();
  const { data: vendor } = await sb.from('vendors').select('*').eq('id', u.id).maybeSingle();
  const { data: products } = await sb.from('products').select('id,name,price,thumbnail_url,category,description').eq('vendor_id', u.id).order('created_at', { ascending: false });
  return R.json({ vendor, products: products || [] });
}

export async function POST(req) {
  const u = await userFrom(req); if (!u) return err('login', 401);
  const sb = admin(), fd = await req.formData(), kind = fd.get('kind');
  if (kind === 'register') {
    await sb.from('vendors').upsert({ id: u.id, shop_name: fd.get('shop_name'), phone: fd.get('phone') });
    return R.json({ ok: 1 });
  }
  const { data: v } = await sb.from('vendors').select('is_approved').eq('id', u.id).maybeSingle();
  if (!v?.is_approved) return err('آپ کی دکان ابھی منظور نہیں ہوئی', 403);
  let pid = fd.get('id');
  if (kind === 'edit') {
    const { data: own } = await sb.from('products').select('id').eq('id', pid).eq('vendor_id', u.id).maybeSingle();
    if (!own) return err('یہ آپ کی پروڈکٹ نہیں', 403);
  }
  const row = { name: fd.get('name'), price: +fd.get('price'), category: fd.get('category'), description: fd.get('description') };
  let kb, fullUrl;
  const file = fd.get('file');
  if (file && file.size) {
    if (!file.type.startsWith('image/')) return err('صرف تصویر چنیں');
    const buf = Buffer.from(await file.arrayBuffer());
    const [full, th] = await Promise.all([toWebp(buf, { maxBytes: 150 * 1024, width: 1200 }), toWebp(buf, { maxBytes: 20 * 1024, width: 400 })]);
    const key = `${u.id}/${Date.now()}`, o = { contentType: 'image/webp', cacheControl: '31536000' }, st = sb.storage.from('products');
    await Promise.all([st.upload(key + '.webp', full, o), st.upload(key + '-t.webp', th, o)]);
    row.thumbnail_url = st.getPublicUrl(key + '-t.webp').data.publicUrl;
    fullUrl = st.getPublicUrl(key + '.webp').data.publicUrl; kb = Math.round(full.length / 1024);
  }
  if (kind === 'edit') await sb.from('products').update(row).eq('id', pid);
  else {
    const { data, error } = await sb.from('products').insert({ ...row, vendor_id: u.id }).select('id').single();
    if (error) return err(error.message);
    pid = data.id;
    const sizes = (fd.get('sizes') || '').split(',').map((s) => s.trim()).filter(Boolean);
    if (sizes.length) await sb.from('product_variants').insert(sizes.map((size) => ({ product_id: pid, size, color: fd.get('color'), stock: +fd.get('stock') || 0 })));
  }
  if (fullUrl) { await sb.from('product_images').delete().eq('product_id', pid); await sb.from('product_images').insert({ product_id: pid, image_url_webp: fullUrl }); }
  return R.json({ ok: 1, kb });
}

export async function DELETE(req) {
  const u = await userFrom(req); if (!u) return err('login', 401);
  await admin().from('products').delete().eq('id', new URL(req.url).searchParams.get('id')).eq('vendor_id', u.id);
  return R.json({ ok: 1 });
}

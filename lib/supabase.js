import { createClient } from '@supabase/supabase-js';
export const admin = () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
export async function userFrom(req) {
  const t = (req.headers.get('authorization') || '').replace('Bearer ', '');
  const { data } = await admin().auth.getUser(t);
  return data?.user || null;
}
export async function getProducts(offset = 0, limit = 10) {
  const { data } = await admin().from('products').select('id,name,price,thumbnail_url,category')
    .order('created_at', { ascending: false }).order('id', { ascending: false }).range(offset, offset + limit - 1);
  return data || [];
}

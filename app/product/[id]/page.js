import { admin } from '@/lib/supabase';
import AddToCart from '@/components/AddToCart';
export const revalidate = 300;
export default async function Product({ params }) {
  const { data: p } = await admin().from('products').select('*, product_images(image_url_webp), product_variants(size,color,stock)').eq('id', params.id).maybeSingle();
  if (!p) return <p className="pad">پروڈکٹ نہیں ملی 😕</p>;
  const sizes = [...new Set((p.product_variants || []).filter((v) => v.stock > 0).map((v) => v.size))];
  return (
    <div className="pd">
      <img src={p.product_images?.[0]?.image_url_webp || p.thumbnail_url} alt={p.name} fetchPriority="high" />
      <div>
        <h1>{p.name}</h1>
        <h2 style={{ color: '#d6125e', margin: '8px 0' }}>Rs. {p.price}</h2>
        <p style={{ margin: '8px 0 16px', lineHeight: 1.6 }}>{p.description}</p>
        <AddToCart p={{ id: p.id, name: p.name, price: p.price, thumbnail_url: p.thumbnail_url }} sizes={sizes} />
      </div>
    </div>
  );
}

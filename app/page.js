import { getProducts } from '@/lib/supabase';
import Card from '@/components/Card';
import Feed from '@/components/Feed';
export const revalidate = 300;
const cats = ['👗 کپڑے', '👟 جوتے', '📱 موبائل', '🏠 گھر', '💄 بیوٹی', '🎁 تحفے'];
export default async function Home() {
  const first = await getProducts(0, 5); // شروع میں صرف 5
  return (
    <main>
      <section className="hero"><h1>🎉 ہر چیز، ایک ہی جگہ!</h1><p>بھروسے مند دکانداروں سے تیز ڈیلیوری اور بہترین قیمتیں</p></section>
      <div className="chips">{cats.map((c) => <span key={c}>{c}</span>)}</div>
      <div className="grid">{first.map((p, i) => <Card key={p.id} p={p} priority={i < 2} />)}</div>
      <Feed start={5} />
    </main>
  );
}

'use client';
import { useEffect, useState } from 'react';
import Auth from '@/components/Auth';
import { call } from '@/lib/client';
export default function Vendor() { return <Auth title="🏪 دکاندار لاگ ان" signup>{(t, out) => <Panel t={t} out={out} />}</Auth>; }
function Panel({ t, out }) {
  const [d, setD] = useState(null), [f, setF] = useState(null), [m, setM] = useState('');
  const load = () => call(t, '/api/vendor').then(setD);
  useEffect(() => { load(); }, []);
  async function send(fd) {
    setM('⏳ تصویر خود چھوٹی ہو کر اپلوڈ ہو رہی ہے، انتظار کریں...');
    const r = await call(t, '/api/vendor', { method: 'POST', body: fd });
    setM(r.error ? '❌ ' + r.error : '✅ محفوظ ہو گیا' + (r.kb ? ` (تصویر ${r.kb}KB)` : ''));
    if (!r.error) { setF(null); load(); }
  }
  const sub = (kind, id) => (e) => { e.preventDefault(); const fd = new FormData(e.target); fd.append('kind', kind); id && fd.append('id', id); send(fd); };
  if (!d) return <p className="pad">⏳</p>;
  return (
    <div className="pad">
      <button className="btn r" onClick={out}>🚪 باہر نکلیں</button>
      {m && <div className="msg">{m}</div>}
      {!d.vendor && <form className="box" onSubmit={sub('register')}><h2>🏪 اپنی دکان کا نام لکھیں</h2>
        <label>دکان کا نام</label><input name="shop_name" required /><label>فون نمبر</label><input name="phone" required />
        <button className="btn g">✅ دکان بنائیں</button></form>}
      {d.vendor && !d.vendor.is_approved && <div className="msg">⏳ آپ کی دکان ایڈمن کی منظوری کا انتظار کر رہی ہے۔</div>}
      {d.vendor?.is_approved && !f && <>
        <h2>{d.vendor.shop_name}</h2>
        <button className="btn g" onClick={() => setF({})}>➕ نئی پروڈکٹ ڈالیں</button>
        {d.products.map((p) => (
          <div className="item" key={p.id}><b>{p.name}</b> — Rs. {p.price}
            <div className="row"><button className="btn o" onClick={() => setF(p)}>✏️ تبدیل کریں</button>
              <button className="btn r" onClick={async () => { if (confirm('پکا ہٹانا ہے؟')) { await call(t, '/api/vendor?id=' + p.id, { method: 'DELETE' }); load(); } }}>🗑️ ہٹائیں</button></div></div>))}
      </>}
      {f && <form className="box" onSubmit={sub(f.id ? 'edit' : 'add', f.id)}>
        <h2>{f.id ? '✏️ پروڈکٹ تبدیل کریں' : '➕ نئی پروڈکٹ'}</h2>
        <label>📸 تصویر (جتنی بڑی ہو، خود چھوٹی ہو جائے گی)</label><input name="file" type="file" accept="image/*" />
        <label>نام</label><input name="name" defaultValue={f.name} required />
        <label>قیمت (روپے)</label><input name="price" type="number" defaultValue={f.price} required />
        <label>قسم</label><select name="category" defaultValue={f.category}><option>کپڑے</option><option>جوتے</option><option>موبائل</option><option>گھر</option><option>بیوٹی</option><option>تحفے</option></select>
        <label>تفصیل</label><textarea name="description" defaultValue={f.description} />
        {!f.id && <><label>سائز (کاما سے الگ: S,M,L)</label><input name="sizes" /><label>رنگ</label><input name="color" /><label>کتنے پیس موجود ہیں؟</label><input name="stock" type="number" /></>}
        <button className="btn g">💾 محفوظ کریں</button><button type="button" className="btn r" onClick={() => setF(null)}>↩️ واپس</button>
      </form>}
    </div>
  );
}

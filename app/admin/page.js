'use client';
import { useEffect, useState } from 'react';
import Auth from '@/components/Auth';
import { call } from '@/lib/client';
export default function Admin() { return <Auth title="👑 ایڈمن لاگ ان" signup>{(t, out) => <Panel t={t} out={out} />}</Auth>; }
function Panel({ t, out }) {
  const [d, setD] = useState(null), [tab, setTab] = useState('v');
  const load = () => call(t, '/api/admin').then(setD);
  useEffect(() => { load(); }, []);
  const act = async (action, id, value) => { await call(t, '/api/admin', { method: 'POST', body: JSON.stringify({ action, id, value }) }); load(); };
  if (!d) return <p className="pad">⏳</p>;
  if (d.error) return <div className="pad"><div className="msg">❌ {d.error}</div><button className="btn r" onClick={out}>🚪 باہر نکلیں</button></div>;
  return (
    <div className="pad">
      <div className="tabs"><button className="btn" onClick={() => setTab('v')}>🏪 دکانیں</button><button className="btn p" onClick={() => setTab('o')}>📦 آرڈرز</button><button className="btn o" onClick={() => setTab('p')}>🛍️ پروڈکٹس</button></div>
      {tab === 'v' && d.vendors.map((v) => (
        <div className="item" key={v.id}><b>{v.shop_name}</b> · {v.phone} · {v.is_approved ? '✅ منظور' : '⏳ انتظار'}
          <div className="row">
            {v.is_approved ? <button className="btn r" onClick={() => act('block', v.id)}>⛔ بلاک</button> : <button className="btn g" onClick={() => act('approve', v.id)}>✅ منظور کریں</button>}
            <button className="btn o" onClick={() => { const n = prompt('نیا نام؟', v.shop_name); n && act('rename', v.id, n); }}>✏️ نام بدلیں</button>
            <button className="btn r" onClick={() => confirm('دکان اور اس کی ساری پروڈکٹس ہٹانی ہیں؟') && act('deleteVendor', v.id)}>🗑️</button></div></div>))}
      {tab === 'o' && (d.orders.length ? d.orders.map((o) => (
        <div className="item" key={o.id}><b>#{o.id} {o.customer_name}</b> · 📞 {o.phone}<br />📍 {o.address}<br />💰 Rs. {o.total} · {(o.items || []).map((i) => `${i.name}×${i.qty}`).join('، ')}</div>)) : <p>ابھی کوئی آرڈر نہیں</p>)}
      {tab === 'p' && d.products.map((p) => (
        <div className="item" key={p.id}><b>{p.name}</b> — Rs. {p.price}
          <div className="row"><button className="btn o" onClick={() => { const n = prompt('نئی قیمت؟', p.price); n && act('setPrice', p.id, n); }}>✏️ قیمت بدلیں</button>
            <button className="btn r" onClick={() => confirm('ہٹانی ہے؟') && act('deleteProduct', p.id)}>🗑️ ہٹائیں</button></div></div>))}
      <button className="btn r" onClick={out}>🚪 باہر نکلیں</button>
    </div>
  );
}

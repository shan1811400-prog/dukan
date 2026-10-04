'use client';
import { useState } from 'react';
export default function AddToCart({ p, sizes }) {
  const [size, setSize] = useState(sizes[0] || ''), [ok, setOk] = useState(false);
  function add() {
    const c = JSON.parse(localStorage.getItem('cart') || '[]');
    const k = c.find((x) => x.id === p.id && x.size === size);
    k ? k.qty++ : c.push({ id: p.id, name: p.name, price: p.price, thumb: p.thumbnail_url, size, qty: 1 });
    localStorage.setItem('cart', JSON.stringify(c)); setOk(true);
  }
  return (<>
    {sizes.length > 0 && <><label>📏 سائز چنیں</label><select value={size} onChange={(e) => setSize(e.target.value)}>{sizes.map((s) => <option key={s}>{s}</option>)}</select></>}
    <button className="btn p" onClick={add}>🛒 کارٹ میں ڈالیں</button>
    {ok && <a className="btn g" href="/cart">✅ ڈال دیا — کارٹ دیکھیں</a>}
  </>);
}

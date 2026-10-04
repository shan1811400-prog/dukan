'use client';
import { useEffect, useState } from 'react';
export default function Cart() {
  const [c, setC] = useState([]), [m, setM] = useState('');
  useEffect(() => setC(JSON.parse(localStorage.getItem('cart') || '[]')), []);
  const save = (n) => { setC(n); localStorage.setItem('cart', JSON.stringify(n)); };
  const total = c.reduce((s, i) => s + i.price * i.qty, 0);
  async function order(e) {
    e.preventDefault(); const f = Object.fromEntries(new FormData(e.target));
    const r = await (await fetch('/api/order', { method: 'POST', body: JSON.stringify({ ...f, items: c }) })).json();
    if (r.error) return setM('❌ ' + r.error);
    save([]); setM('🎉 آرڈر مل گیا! ہم جلد فون کریں گے۔');
  }
  return (
    <div className="pad">
      <h2>🛒 آپ کا کارٹ</h2>
      {m && <div className="msg">{m}</div>}
      {c.map((i, k) => (
        <div className="item" key={k}><b>{i.name}</b> {i.size && `(${i.size})`}<br />Rs. {i.price} × {i.qty}
          <div className="row"><button className="btn g" onClick={() => { c[k].qty++; save([...c]); }}>➕ ایک اور</button>
            <button className="btn r" onClick={() => save(c.filter((_, j) => j !== k))}>🗑️ ہٹائیں</button></div></div>
      ))}
      {c.length > 0 && (<>
        <h3>کل: Rs. {total}</h3>
        <form className="box" onSubmit={order}>
          <label>آپ کا نام</label><input name="name" required />
          <label>فون نمبر</label><input name="phone" type="tel" required />
          <label>مکمل پتہ</label><textarea name="address" required />
          <button className="btn g">✅ آرڈر کریں (کیش آن ڈیلیوری)</button>
        </form></>)}
      {!c.length && !m && <p>کارٹ خالی ہے</p>}
    </div>
  );
}

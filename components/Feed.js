'use client';
import { useEffect, useRef, useState } from 'react';
import Card from './Card';
// شروع کے 5 سرور سے آ چکے؛ سائٹ کھلنے کے بعد scroll پر 10-10 خود لوڈ ہوتے ہیں
export default function Feed({ start = 5 }) {
  const [items, setItems] = useState([]);
  const [done, setDone] = useState(false);
  const off = useRef(start), busy = useRef(false), end = useRef(null);
  async function more() {
    if (busy.current) return; busy.current = true;
    try {
      const d = await (await fetch(`/api/products?offset=${off.current}&limit=10`)).json();
      setItems((x) => [...x, ...d]); off.current += d.length;
      if (d.length < 10) setDone(true);
    } catch (e) {} finally { busy.current = false; }
  }
  useEffect(() => {
    let io;
    const go = () => { io = new IntersectionObserver((e) => e[0].isIntersecting && more(), { rootMargin: '700px' }); end.current && io.observe(end.current); };
    document.readyState === 'complete' ? go() : window.addEventListener('load', go, { once: true });
    return () => { window.removeEventListener('load', go); io && io.disconnect(); };
  }, []);
  return (<>
    <div className="grid">{items.map((p) => <Card key={p.id} p={p} />)}</div>
    {!done && <div ref={end} className="grid">{[0, 1].map((i) => <div className="sk" key={i}><i /></div>)}</div>}
  </>);
}

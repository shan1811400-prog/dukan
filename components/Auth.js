'use client';
import { useEffect, useState } from 'react';
import { sb } from '@/lib/client';
export default function Auth({ title, signup, children }) {
  const [s, setS] = useState(null), [ready, setReady] = useState(false), [msg, setMsg] = useState('');
  useEffect(() => {
    sb.auth.getSession().then(({ data }) => { setS(data.session); setReady(true); });
    const { data } = sb.auth.onAuthStateChange((_, x) => setS(x));
    return () => data.subscription.unsubscribe();
  }, []);
  async function go(kind, e) {
    const f = Object.fromEntries(new FormData(e.target.form));
    const { error } = kind === 'in' ? await sb.auth.signInWithPassword(f) : await sb.auth.signUp(f);
    setMsg(error ? '❌ ' + error.message : kind === 'up' ? '✅ اکاؤنٹ بن گیا، اب "لاگ ان" دبائیں' : '');
  }
  if (!ready) return <p className="pad">⏳</p>;
  if (s) return children(s.access_token, () => sb.auth.signOut());
  return (
    <form className="box"><h2>{title}</h2>{msg && <div className="msg">{msg}</div>}
      <label>ای میل</label><input name="email" type="email" required />
      <label>پاس ورڈ</label><input name="password" type="password" required />
      <button type="button" className="btn" onClick={(e) => go('in', e)}>🔑 لاگ ان</button>
      {signup && <button type="button" className="btn o" onClick={(e) => go('up', e)}>🆕 نیا اکاؤنٹ بنائیں</button>}
    </form>
  );
}

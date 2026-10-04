import { createClient } from '@supabase/supabase-js';
export const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
export const call = (t, url, o = {}) => fetch(url, { ...o, headers: { ...(o.headers || {}), Authorization: 'Bearer ' + t } }).then((r) => r.json());

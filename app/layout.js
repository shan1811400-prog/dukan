const css = `*{box-sizing:border-box;margin:0}
body{font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;background:#fff8f0;color:#1f1b2e;-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}
header{position:sticky;top:0;z-index:5;display:flex;justify-content:space-between;align-items:center;padding:12px 16px;background:#fff;box-shadow:0 2px 10px #0001}
header b{font-size:20px;background:linear-gradient(90deg,#ff3d81,#ff9a3d);-webkit-background-clip:text;background-clip:text;color:transparent}
.cartb{background:#7c3aed;color:#fff;padding:8px 14px;border-radius:99px;font-weight:700}
.hero{padding:30px 18px;color:#fff;background:linear-gradient(135deg,#7c3aed,#ff3d81 60%,#ff9a3d)}
.hero h1{font-size:28px;line-height:1.15}.hero p{margin-top:8px;opacity:.95}
.chips{display:flex;gap:8px;overflow-x:auto;padding:14px 16px}
.chips span{flex:none;padding:8px 14px;border-radius:99px;font-weight:600;font-size:14px;color:#fff}
.chips span:nth-child(5n+1){background:#ff3d81}.chips span:nth-child(5n+2){background:#7c3aed}.chips span:nth-child(5n+3){background:#10b981}.chips span:nth-child(5n+4){background:#f59e0b}.chips span:nth-child(5n){background:#0ea5e9}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:12px 16px}
@media(min-width:700px){.grid{grid-template-columns:repeat(4,1fr)}}
.card{display:block;background:#fff;border-radius:18px;overflow:hidden;box-shadow:0 4px 14px #7c3aed22}
.card img,.sk i{display:block;width:100%;aspect-ratio:1;object-fit:cover;background:#f1e9ff}
.card h3{font-size:14px;font-weight:600;padding:8px 10px 0;height:42px;overflow:hidden}
.card b{display:inline-block;margin:6px 10px 12px;padding:4px 10px;border-radius:99px;background:#ffe8f1;color:#d6125e}
.sk i{animation:p 1.2s infinite;border-radius:18px}@keyframes p{50%{opacity:.5}}
.pad{padding:16px}.box{max-width:480px;margin:16px auto;padding:18px;background:#fff;border-radius:18px;box-shadow:0 4px 14px #0001}
input,select,textarea{width:100%;padding:14px;margin:6px 0 12px;border:2px solid #e5dcf7;border-radius:12px;font-size:16px;font-family:inherit}
label{font-weight:700;font-size:15px}
.btn{display:block;width:100%;padding:15px;margin:8px 0;border:0;border-radius:14px;font-size:17px;font-weight:700;color:#fff;background:#7c3aed;cursor:pointer;text-align:center}
.btn.g{background:#10b981}.btn.r{background:#ef4444}.btn.o{background:#f59e0b}.btn.p{background:#ff3d81}
.row{display:flex;gap:8px}.row .btn{margin:4px 0}
.item{background:#fff;border-radius:14px;padding:12px;margin:10px 0;box-shadow:0 2px 8px #0001}
.tabs{display:flex;gap:8px;margin-bottom:8px}.tabs .btn{margin:0}
.pd{display:grid;gap:16px;padding:16px}@media(min-width:700px){.pd{grid-template-columns:1fr 1fr}}
.pd img{width:100%;border-radius:18px;aspect-ratio:1;object-fit:cover}
.msg{padding:12px;border-radius:12px;background:#fff3cd;margin:8px 0;font-weight:600}`;
export const metadata = { title: 'Marketplace', description: 'Colorful shopping from trusted vendors' };
export const viewport = { width: 'device-width', initialScale: 1 };
export default function Root({ children }) {
  return (
    <html lang="ur">
      <head><style dangerouslySetInnerHTML={{ __html: css }} /></head>
      <body><header><a href="/"><b>🛍️ MARKETPLACE</b></a><a className="cartb" href="/cart">🛒 کارٹ</a></header>{children}</body>
    </html>
  );
}

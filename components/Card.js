export default function Card({ p, priority }) {
  return (
    <a className="card" href={`/product/${p.id}`}>
      <img src={p.thumbnail_url} alt={p.name} width="400" height="400" loading={priority ? 'eager' : 'lazy'} decoding="async" fetchPriority={priority ? 'high' : 'auto'} />
      <h3>{p.name}</h3><b>Rs. {p.price}</b>
    </a>
  );
}

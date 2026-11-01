// Ghép đường dẫn với base của site (/OSCP/) để link chạy đúng trên GitHub Pages.
export function url(path = ''): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const clean = path.replace(/^\//, '');
  if (!clean) return `${base}/`;
  const withSlash = /\.[a-z0-9]+$/i.test(clean) || clean.includes('#') ? clean : clean.replace(/\/?$/, '/');
  return `${base}/${withSlash}`;
}

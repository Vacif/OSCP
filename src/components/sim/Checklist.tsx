import { useEffect, useState } from 'react';

export interface CheckItem {
  label: string;
  hint?: string;
}

interface Props {
  title?: string;
  storageKey: string;
  items: CheckItem[];
}

// Danh sách việc cần làm, nhớ trạng thái trong trình duyệt của người học.
export default function Checklist({ title, storageKey, items }: Props) {
  const key = `oscp-check-${storageKey}`;
  const [done, setDone] = useState<boolean[]>(() => items.map(() => false));

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) setDone(items.map((_, i) => Boolean(arr[i])));
      }
    } catch {
      /* không có localStorage thì thôi */
    }
  }, [key, items.length]);

  function toggle(i: number) {
    setDone((prev) => {
      const next = prev.map((v, j) => (j === i ? !v : v));
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch {
        /* bỏ qua */
      }
      return next;
    });
  }

  const n = done.filter(Boolean).length;

  return (
    <div className="sim checklist">
      <p className="sim-title">
        {title ?? 'Danh sách kiểm tra'} · {n}/{items.length}
      </p>
      <ul>
        {items.map((it, i) => (
          <li key={i}>
            <label className={done[i] ? 'is-done' : ''}>
              <input type="checkbox" checked={done[i]} onChange={() => toggle(i)} />
              <span>
                {it.label}
                {it.hint && <span className="check-hint">{it.hint}</span>}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

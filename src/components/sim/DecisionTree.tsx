import { useState } from 'react';

export type TreeNode =
  | { q: string; options: { label: string; next: string }[] }
  | { result: string; tone: 'good' | 'bad' | 'warn' };

interface Props {
  title?: string;
  start: string;
  nodes: Record<string, TreeNode>;
}

// Cây quyết định: trả lời từng câu hỏi để đi tới kết luận.
export default function DecisionTree({ title, start, nodes }: Props) {
  const [path, setPath] = useState<{ id: string; answer?: string }[]>([{ id: start }]);
  const current = nodes[path[path.length - 1].id];

  function choose(label: string, next: string) {
    setPath((p) => [...p.slice(0, -1), { ...p[p.length - 1], answer: label }, { id: next }]);
  }

  return (
    <div className="sim dtree">
      {title && <p className="sim-title">{title}</p>}
      <ol className="dtree-path">
        {path.slice(0, -1).map((p, i) => {
          const n = nodes[p.id];
          return (
            <li key={i}>
              <span className="dtree-q">{'q' in n ? n.q : ''}</span>
              <span className="dtree-a">{p.answer}</span>
            </li>
          );
        })}
      </ol>
      {'q' in current ? (
        <div className="dtree-now">
          <p className="dtree-question">{current.q}</p>
          <div className="sim-controls">
            {current.options.map((o) => (
              <button key={o.label} type="button" className="btn" onClick={() => choose(o.label, o.next)}>
                {o.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className={`dtree-result ${current.tone}`} aria-live="polite">
          {current.result}
        </div>
      )}
      {path.length > 1 && (
        <div className="sim-controls">
          <button type="button" className="btn" onClick={() => setPath((p) => p.slice(0, -1).map((x, i, arr) => (i === arr.length - 1 ? { id: x.id } : x)))}>
            ← Lùi một bước
          </button>
          <button type="button" className="btn" onClick={() => setPath([{ id: start }])}>
            Làm lại
          </button>
        </div>
      )}
    </div>
  );
}

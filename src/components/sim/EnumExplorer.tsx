import { useState } from 'react';

export interface EnumCmd {
  cmd: string;
  // Mỗi dòng output; dòng nào "đáng chú ý" thì đánh dấu hit=true.
  output: { text: string; hit?: boolean }[];
  finding: string;
  tone?: 'good' | 'warn' | 'bad';
}

interface Props {
  title?: string;
  intro?: string;
  prompt?: string;
  items: EnumCmd[];
}

// Trình khám phá liệt kê: bấm một lệnh để "chạy", xem output mẫu với dòng quan trọng
// được tô sáng và giải thích vì sao nó đáng chú ý. Dữ liệu là mẫu, không chạy gì thật.
export default function EnumExplorer({ title, intro, prompt = 'kali@lab:~$', items }: Props) {
  const [open, setOpen] = useState<number | null>(0);
  const [ran, setRan] = useState<Set<number>>(new Set([0]));

  function run(i: number) {
    setOpen(open === i ? null : i);
    setRan((s) => new Set(s).add(i));
  }

  return (
    <div className="sim enumx">
      {title && <p className="sim-title">{title}</p>}
      {intro && <p className="enumx-intro">{intro}</p>}
      <ol className="enumx-list">
        {items.map((it, i) => (
          <li key={i} className={open === i ? 'open' : ''}>
            <button type="button" className="enumx-cmd" onClick={() => run(i)} aria-expanded={open === i}>
              <span className="enumx-caret" aria-hidden="true">{open === i ? '▾' : '▸'}</span>
              <span className="enumx-prompt">{prompt}</span>
              <code>{it.cmd}</code>
              {ran.has(i) && <span className="enumx-ran" aria-hidden="true">✓</span>}
            </button>
            {open === i && (
              <div className="enumx-result">
                <pre className="enumx-out">
                  {it.output.map((l, j) => (
                    <span key={j} className={l.hit ? 'enumx-hit' : ''}>
                      {l.text || ' '}
                      {'\n'}
                    </span>
                  ))}
                </pre>
                <p className={`enumx-finding ${it.tone ?? 'warn'}`}>
                  <strong>Đáng chú ý:</strong> {it.finding}
                </p>
              </div>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

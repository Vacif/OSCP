import { useState } from 'react';

export interface CodeStep {
  line: number;
  vars: Record<string, string>;
  out?: string;
  note: string;
}

interface Props {
  title?: string;
  lang?: string;
  code: string;
  steps: CodeStep[];
}

// Chạy từng dòng code giả lập: tô sáng dòng đang chạy, hiện giá trị biến và kết quả in ra.
export default function CodeStepper({ title, lang = 'python', code, steps }: Props) {
  const [cur, setCur] = useState(0);
  const lines = code.replace(/^\n/, '').replace(/\s+$/, '').split('\n');
  const step = steps[cur];
  const output = steps
    .slice(0, cur + 1)
    .map((s) => s.out)
    .filter((o): o is string => o !== undefined);

  return (
    <div className="sim cstep">
      {title && <p className="sim-title">{title}</p>}
      <div className="cstep-grid">
        <pre className="cstep-code" aria-label={`Mã ${lang}`}>
          {lines.map((l, i) => (
            <div key={i} className={`cstep-line ${i + 1 === step.line ? 'on' : ''}`}>
              <span className="cstep-no">{i + 1}</span>
              <code>{l || ' '}</code>
            </div>
          ))}
        </pre>
        <div className="cstep-side">
          <p className="cstep-h">Biến</p>
          <table className="cstep-vars">
            <tbody>
              {Object.keys(step.vars).length === 0 && (
                <tr>
                  <td colSpan={2} className="muted">
                    (chưa có)
                  </td>
                </tr>
              )}
              {Object.entries(step.vars).map(([k, v]) => (
                <tr key={k}>
                  <td>
                    <code>{k}</code>
                  </td>
                  <td>
                    <code>{v}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="cstep-h">Màn hình</p>
          <pre className="cstep-out">{output.join('\n') || ' '}</pre>
        </div>
      </div>
      <div className="sim-note" aria-live="polite">
        <strong>
          Bước {cur + 1}/{steps.length}, dòng {step.line}.
        </strong>{' '}
        {step.note}
      </div>
      <div className="sim-controls">
        <button type="button" className="btn" onClick={() => setCur((c) => c - 1)} disabled={cur === 0}>
          ← Lùi
        </button>
        <button type="button" className="btn primary" onClick={() => setCur((c) => c + 1)} disabled={cur >= steps.length - 1}>
          Tiếp →
        </button>
        <button type="button" className="btn" onClick={() => setCur(0)} disabled={cur === 0}>
          Từ đầu
        </button>
      </div>
    </div>
  );
}

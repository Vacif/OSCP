import { useState } from 'react';

export interface WalkStep {
  phase: string;
  title: string;
  cmd?: string;
  prompt?: string;
  output?: { text: string; hit?: boolean }[];
  takeaway: string;
  tone?: 'good' | 'warn' | 'bad';
}

interface Props {
  title?: string;
  steps: WalkStep[];
}

// Trình xem walkthrough: hé lộ từng bước của một chuỗi tấn công hư cấu, kèm lệnh,
// output mẫu và bài học rút ra. Dữ liệu là giả, chỉ để minh hoạ cách ráp kỹ thuật.
export default function Walkthrough({ title, steps }: Props) {
  const [cur, setCur] = useState(0);
  const atEnd = cur >= steps.length - 1;

  // Danh sách phase duy nhất, theo thứ tự, để vẽ thanh tiến trình.
  const phases: string[] = [];
  for (const s of steps) if (!phases.includes(s.phase)) phases.push(s.phase);
  const curPhase = steps[cur].phase;

  return (
    <div className="sim walk">
      {title && <p className="sim-title">{title}</p>}
      <ol className="walk-phases" aria-label="Các giai đoạn">
        {phases.map((p) => {
          const firstIdx = steps.findIndex((s) => s.phase === p);
          const done = cur > steps.map((s) => s.phase).lastIndexOf(p);
          const active = p === curPhase;
          return (
            <li key={p} className={`${active ? 'on' : ''} ${done ? 'done' : ''}`}>
              <button type="button" onClick={() => setCur(firstIdx)} title={`Tới giai đoạn: ${p}`}>
                {p}
              </button>
            </li>
          );
        })}
      </ol>

      <ol className="walk-steps">
        {steps.slice(0, cur + 1).map((s, i) => {
          const active = i === cur;
          return (
            <li key={i} className={`walk-step ${active ? 'active' : 'past'}`}>
              <div className="walk-head">
                <span className="walk-badge">{s.phase}</span>
                <strong>{s.title}</strong>
              </div>
              {s.cmd && (
                <pre className="walk-cmd">
                  <span className="walk-prompt">{s.prompt ?? 'kali@lab:~$'}</span> {s.cmd}
                </pre>
              )}
              {s.output && (
                <pre className="walk-out">
                  {s.output.map((l, j) => (
                    <span key={j} className={l.hit ? 'walk-hit' : ''}>
                      {l.text || ' '}
                      {'\n'}
                    </span>
                  ))}
                </pre>
              )}
              <p className={`walk-take ${s.tone ?? ''}`}>
                <span className="walk-take-label">Rút ra</span>
                {s.takeaway}
              </p>
            </li>
          );
        })}
      </ol>

      <div className="sim-controls">
        <button type="button" className="btn" onClick={() => setCur((c) => Math.max(0, c - 1))} disabled={cur === 0}>
          ← Lùi
        </button>
        <button type="button" className="btn primary" onClick={() => setCur((c) => Math.min(steps.length - 1, c + 1))} disabled={atEnd}>
          {atEnd ? 'Đã hết' : 'Bước tiếp →'}
        </button>
        <button type="button" className="btn" onClick={() => setCur(0)} disabled={cur === 0}>
          Từ đầu
        </button>
        <span className="walk-count">
          Bước {cur + 1}/{steps.length}
        </span>
      </div>
    </div>
  );
}

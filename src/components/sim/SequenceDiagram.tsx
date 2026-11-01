import { useId, useState } from 'react';

export interface SeqStep {
  from: number;
  to: number;
  label: string;
  note: string;
  tone?: 'normal' | 'good' | 'bad' | 'muted';
}

export interface SeqScenario {
  name: string;
  steps: SeqStep[];
}

interface Props {
  title?: string;
  actors: string[];
  steps?: SeqStep[];
  scenarios?: SeqScenario[];
}

const ROW = 54;
const TOP = 64;

// Sơ đồ tuần tự: mỗi cột là một máy, mỗi hàng là một thông điệp. Bấm "Tiếp" để hiện từng bước.
export default function SequenceDiagram({ title, actors, steps, scenarios }: Props) {
  const all: SeqScenario[] = scenarios ?? [{ name: '', steps: steps ?? [] }];
  const [sc, setSc] = useState(0);
  const [cur, setCur] = useState(0);
  const uid = useId().replace(/:/g, '');
  const list = all[sc].steps;
  const step = list[cur];

  const width = Math.max(420, actors.length * 180);
  const gap = width / actors.length;
  const x = (i: number) => gap * i + gap / 2;
  const height = TOP + list.length * ROW + 20;

  function pickScenario(i: number) {
    setSc(i);
    setCur(0);
  }

  return (
    <div className="sim seq">
      {title && <p className="sim-title">{title}</p>}
      {all.length > 1 && (
        <div className="tabs" role="group" aria-label="Chọn tình huống">
          {all.map((s, i) => (
            <button key={s.name} type="button" className="btn" aria-pressed={i === sc} onClick={() => pickScenario(i)}>
              {s.name}
            </button>
          ))}
        </div>
      )}
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={title ?? 'Sơ đồ tuần tự'}>
        <defs>
          {['normal', 'good', 'bad', 'muted', 'active'].map((t) => (
            <marker
              key={t}
              id={`${uid}-${t}`}
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M0,0 L10,5 L0,10 z" className={`seq-head ${t}`} />
            </marker>
          ))}
        </defs>
        {actors.map((a, i) => (
          <g key={a}>
            <line x1={x(i)} y1={44} x2={x(i)} y2={height - 8} className="seq-life" />
            <rect x={x(i) - 70} y={8} width={140} height={34} rx={8} className="seq-actor" />
            <text x={x(i)} y={30} textAnchor="middle" className="seq-actor-text">
              {a}
            </text>
          </g>
        ))}
        {list.slice(0, cur + 1).map((s, i) => {
          const y = TOP + i * ROW + 22;
          const active = i === cur;
          const tone = active ? 'active' : 'past';
          const marker = active ? 'active' : s.tone ?? 'normal';
          if (s.from === s.to) {
            return (
              <g key={i} className={`seq-row ${tone}`}>
                <rect x={x(s.from) - 80} y={y - 16} width={160} height={28} rx={6} className={`seq-self ${s.tone ?? ''}`} />
                <text x={x(s.from)} y={y + 3} textAnchor="middle" className="seq-label">
                  {s.label}
                </text>
              </g>
            );
          }
          const x1 = x(s.from);
          const x2 = x(s.to);
          const dir = x2 > x1 ? 1 : -1;
          return (
            <g key={i} className={`seq-row ${tone}`}>
              <line
                x1={x1 + dir * 4}
                y1={y}
                x2={x2 - dir * 6}
                y2={y}
                className={`seq-arrow ${s.tone ?? 'normal'}`}
                markerEnd={`url(#${uid}-${marker})`}
              />
              <text x={(x1 + x2) / 2} y={y - 8} textAnchor="middle" className="seq-label">
                {s.label}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="sim-note" aria-live="polite">
        <strong>
          Bước {cur + 1}/{list.length}.
        </strong>{' '}
        {step?.note}
      </div>
      <div className="sim-controls">
        <button type="button" className="btn" onClick={() => setCur((c) => Math.max(0, c - 1))} disabled={cur === 0}>
          ← Lùi
        </button>
        <button
          type="button"
          className="btn primary"
          onClick={() => setCur((c) => Math.min(list.length - 1, c + 1))}
          disabled={cur >= list.length - 1}
        >
          Tiếp →
        </button>
        <button type="button" className="btn" onClick={() => setCur(0)} disabled={cur === 0}>
          Từ đầu
        </button>
      </div>
    </div>
  );
}

import { useState } from 'react';

export interface MapNode {
  id: string;
  label: string;
  sub?: string;
  x: number;
  y: number;
  w?: number;
  h?: number;
  detail: string;
  tone?: 'accent' | 'warn' | 'muted';
}

export interface MapEdge {
  from: string;
  to: string;
  label?: string;
  dashed?: boolean;
}

export interface MapZone {
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

interface Props {
  title?: string;
  width?: number;
  height?: number;
  nodes: MapNode[];
  edges?: MapEdge[];
  zones?: MapZone[];
  hint?: string;
}

const DW = 150;
const DH = 50;

// Điểm trên cạnh hình chữ nhật mà đường nối từ tâm đi ra cắt qua.
function edgePoint(n: MapNode, tx: number, ty: number) {
  const w = (n.w ?? DW) / 2 + 4;
  const h = (n.h ?? DH) / 2 + 4;
  const dx = tx - n.x;
  const dy = ty - n.y;
  if (dx === 0 && dy === 0) return { x: n.x, y: n.y };
  const s = Math.min(Math.abs(w / (dx || 1e-9)), Math.abs(h / (dy || 1e-9)));
  return { x: n.x + dx * s, y: n.y + dy * s };
}

// Sơ đồ khái niệm: bấm vào từng ô để xem giải thích.
export default function ConceptMap({
  title,
  width = 640,
  height = 360,
  nodes,
  edges = [],
  zones = [],
  hint = 'Bấm vào một ô trong sơ đồ để xem giải thích.',
}: Props) {
  const [sel, setSel] = useState<string | null>(null);
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const selected = sel ? byId[sel] : null;

  return (
    <div className="sim cmap">
      {title && <p className="sim-title">{title}</p>}
      <svg viewBox={`0 0 ${width} ${height}`} role="group" aria-label={title ?? 'Sơ đồ'}>
        <defs>
          <marker id="cmap-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" className="cmap-head" />
          </marker>
        </defs>
        {zones.map((z) => (
          <g key={z.label}>
            <rect x={z.x} y={z.y} width={z.w} height={z.h} rx={12} className="cmap-zone" />
            <text x={z.x + 12} y={z.y + 20} className="cmap-zone-text">
              {z.label}
            </text>
          </g>
        ))}
        {edges.map((e, i) => {
          const a = byId[e.from];
          const b = byId[e.to];
          if (!a || !b) return null;
          const p1 = edgePoint(a, b.x, b.y);
          const p2 = edgePoint(b, a.x, a.y);
          const on = sel === e.from || sel === e.to;
          return (
            <g key={i} className={`cmap-edge ${on ? 'on' : ''}`}>
              <line
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                strokeDasharray={e.dashed ? '5 5' : undefined}
                markerEnd="url(#cmap-arrow)"
              />
              {e.label && (
                <text x={(p1.x + p2.x) / 2} y={(p1.y + p2.y) / 2 - 6} textAnchor="middle" className="cmap-edge-text">
                  {e.label}
                </text>
              )}
            </g>
          );
        })}
        {nodes.map((n) => {
          const w = n.w ?? DW;
          const h = n.h ?? DH;
          const active = sel === n.id;
          return (
            <g
              key={n.id}
              className={`cmap-node ${n.tone ?? ''} ${active ? 'active' : ''}`}
              role="button"
              tabIndex={0}
              aria-pressed={active}
              aria-label={n.label}
              onClick={() => setSel(active ? null : n.id)}
              onKeyDown={(ev) => {
                if (ev.key === 'Enter' || ev.key === ' ') {
                  ev.preventDefault();
                  setSel(active ? null : n.id);
                }
              }}
            >
              <rect x={n.x - w / 2} y={n.y - h / 2} width={w} height={h} rx={8} />
              <text x={n.x} y={n.sub ? n.y - 3 : n.y + 5} textAnchor="middle" className="cmap-label">
                {n.label}
              </text>
              {n.sub && (
                <text x={n.x} y={n.y + 14} textAnchor="middle" className="cmap-sub">
                  {n.sub}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <div className="sim-note" aria-live="polite">
        {selected ? (
          <>
            <strong>{selected.label}.</strong> {selected.detail}
          </>
        ) : (
          <span className="muted">{hint}</span>
        )}
      </div>
    </div>
  );
}

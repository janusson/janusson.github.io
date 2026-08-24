/**
 * MorphologicalDriftPlot.tsx
 *
 * Interactive 2D drift-time map for ion mobility mass spectrometry (TWIMS-MS).
 *
 *   x-axis: m/z (mass-to-charge ratio)
 *   y-axis: drift time (ms)
 *   color:  morphological regime — 1D chains, rings, or compact spheres
 *   radius: relative ion intensity (square-root scaled)
 *
 * One regime is always active (chains by default on mount): its points stay
 * highlighted — larger radius, higher opacity — while the others fade. A
 * fixed-height info panel beneath the chart shows the active regime's
 * structural description, so switching regimes never shifts the page layout.
 * Clicking a data point activates its regime; hovering simply emphasizes it.
 *
 * The dataset is passed via the `data` prop ({ mz, driftTime, nuclearity,
 * morphology, intensity }[]) so Python-extracted arrays can be wired straight
 * in; when the prop is omitted, a built-in POMo demo dataset (DEFAULT_DATA)
 * is rendered. Scales are computed with d3; the markup is declarative React,
 * which keeps the component SSR-safe and testable.
 *
 * Hydration note: rendered in MDX as a React island, e.g.
 * <MorphologicalDriftPlot client:visible />
 */

import * as d3 from "d3";
import { useEffect, useMemo, useRef, useState } from "react";

/* ════════════════════════════════════════════════════════════════
   Types & regime metadata
   ════════════════════════════════════════════════════════════════ */

export type Morphology = "chain" | "ring" | "sphere";

export interface DriftDatum {
  mz: number;
  driftTime: number;
  nuclearity: number;
  /** "chain" | "ring" | "sphere" (loosely matched; falls back to nuclearity). */
  morphology?: Morphology | string;
  intensity: number;
}

interface NormalizedPoint extends DriftDatum {
  morph: Morphology;
}

export interface MorphMeta {
  /** Full toggle label. */
  label: string;
  /** Short name used in the chart's regime band labels. */
  short: string;
  /** Accent color (Kanagawa-inspired). */
  color: string;
  /** Structural one-liner rendered in the info panel. */
  description: string;
}

export const MORPH_META: Record<Morphology, MorphMeta> = {
  chain: {
    label: "1D Chains (n = 2–3)",
    short: "1D Chain",
    color: "#c4b28a", // Dragon Yellow
    description:
      "Extended 1D oligomer — high collisional drag, so its drift time is anomalously long for its mass.",
  },
  ring: {
    label: "Rings (n = 4–5)",
    short: "Cyclic Ring",
    color: "#658594", // Dragon Blue
    description: "Cyclization collapses the chain into a ring — a discrete drop in arrival time.",
  },
  sphere: {
    label: "Compact Spheres (n ≥ 6)",
    short: "Compact Sphere",
    color: "#87a987", // Dragon Green
    description:
      "Dense, near-spherical building block that templates the final gigantic cluster assemblies.",
  },
};

const MORPH_ORDER: Morphology[] = ["chain", "ring", "sphere"];

/** Representative nuclearity used to draw each regime's structural glyph. */
const REPRESENTATIVE_N: Record<Morphology, number> = { chain: 3, ring: 5, sphere: 7 };

const MONO_FONT = "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";

/* ════════════════════════════════════════════════════════════════
   Default POMo demo dataset
   ────────────────────────────────────────────────────────────────
   Monoanion condensation series [HMo_n O_{3n+1}]⁻, matching the m/z
   and drift-time values used elsewhere on the site. Regime slopes are
   deliberately distinct: chains (steep), rings (discrete drop), spheres
   (shallow), reflecting cyclization and compaction.
   ════════════════════════════════════════════════════════════════ */

const MZ_OFFSETS = [-0.55, -0.36, -0.18, 0, 0.18, 0.36, 0.55];
const DT_OFFSETS = [-0.17, -0.09, -0.03, 0.05, 0.09, 0.13, 0.17];

interface Level {
  n: number;
  mz: number;
  t: number;
  morph: Morphology;
}

const LEVELS: Level[] = [
  { n: 2, mz: 304.88, t: 2.85, morph: "chain" },
  { n: 3, mz: 448.81, t: 3.65, morph: "chain" },
  { n: 4, mz: 592.75, t: 3.75, morph: "ring" },
  { n: 5, mz: 736.69, t: 4.1, morph: "ring" },
  { n: 6, mz: 880.62, t: 4.3, morph: "sphere" },
  { n: 7, mz: 1024.56, t: 4.6, morph: "sphere" },
  { n: 8, mz: 1168.5, t: 4.9, morph: "sphere" },
];

export const DEFAULT_DATA: DriftDatum[] = LEVELS.flatMap((level, levelIndex) =>
  MZ_OFFSETS.map((dmz, k) => ({
    mz: +(level.mz + dmz).toFixed(2),
    driftTime: +(level.t + DT_OFFSETS[k]).toFixed(2),
    nuclearity: level.n,
    morphology: level.morph,
    // Deterministic: abundance falls with nuclearity, peaks mid-envelope.
    intensity: Math.max(
      22,
      Math.round(94 - levelIndex * 6 - Math.abs(k - 3) * 7 + (k % 3 === 1 ? 4 : 0)),
    ),
  })),
);

/* ════════════════════════════════════════════════════════════════
   Helpers
   ════════════════════════════════════════════════════════════════ */

/** Maps a datum onto a canonical morphology, tolerating variant spellings. */
function classify(datum: DriftDatum): Morphology {
  const raw = String(datum.morphology ?? "").toLowerCase();
  if (["chain", "chains", "1d", "linear", "oligomer"].includes(raw)) return "chain";
  if (["ring", "rings", "cycle", "cyclic"].includes(raw)) return "ring";
  if (["sphere", "spheres", "compact", "cluster", "globular"].includes(raw)) return "sphere";
  return datum.nuclearity <= 3 ? "chain" : datum.nuclearity <= 5 ? "ring" : "sphere";
}

/** Measures the wrapper's rendered width so the chart adapts to its container. */
function useContainerWidth(): [React.RefObject<HTMLDivElement | null>, number] {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(700); // SSR-safe default.

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) setWidth(entry.contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, width];
}

/* ════════════════════════════════════════════════════════════════
   Structural glyph — approximate oligomer representation
   ════════════════════════════════════════════════════════════════ */

function atomPositions(morph: Morphology, n: number): Array<[number, number]> {
  if (morph === "chain") {
    return n === 2
      ? [
          [-5, 0],
          [5, 0],
        ]
      : [
          [-8, 0],
          [0, -4],
          [8, 0],
        ];
  }
  if (morph === "ring") {
    const k = Math.min(Math.max(n, 4), 6);
    return Array.from({ length: k }, (_, i) => {
      const angle = (Math.PI * 2 * i) / k - Math.PI / 2;
      return [Math.cos(angle) * 7.5, Math.sin(angle) * 7.5] as [number, number];
    });
  }
  // Sphere: hexagonal packing. n = 6 renders the hexagon ring; n ≥ 7 adds a core atom.
  const neighbors = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI * 2 * i) / 6;
    return [Math.cos(angle) * 6.5, Math.sin(angle) * 6.5] as [number, number];
  });
  return n === 6 ? neighbors : [[0, 0], ...neighbors];
}

function atomBonds(morph: Morphology, n: number, count: number): Array<[number, number]> {
  const bonds: Array<[number, number]> = [];
  if (morph === "chain") {
    for (let i = 0; i < count - 1; i++) bonds.push([i, i + 1]);
  } else if (morph === "ring") {
    for (let i = 0; i < count; i++) bonds.push([i, (i + 1) % count]);
  } else if (n === 6) {
    for (let i = 1; i < count; i++) bonds.push([i, (i % (count - 1)) + 1]);
  } else {
    for (let i = 1; i < count; i++) {
      bonds.push([0, i]);
      bonds.push([i, (i % (count - 1)) + 1]);
    }
  }
  return bonds;
}

function StructureGlyph({
  morphology,
  nuclearity,
  color,
  size = 38,
}: {
  morphology: Morphology;
  nuclearity: number;
  color: string;
  size?: number;
}) {
  const positions = atomPositions(morphology, nuclearity);
  const bonds = atomBonds(morphology, nuclearity, positions.length);

  return (
    <svg
      viewBox="-13 -13 26 26"
      width={size}
      height={size}
      aria-hidden="true"
      className="shrink-0"
      style={{ color }}
    >
      {bonds.map(([a, b], i) => (
        <line
          key={i}
          x1={positions[a][0]}
          y1={positions[a][1]}
          x2={positions[b][0]}
          y2={positions[b][1]}
          stroke="currentColor"
          strokeWidth={1.1}
          strokeOpacity={0.45}
        />
      ))}
      {positions.map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={3.4}
          fill="currentColor"
          fillOpacity={0.92}
          stroke="none"
        />
      ))}
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════════
   Component
   ════════════════════════════════════════════════════════════════ */

export interface MorphologicalDriftPlotProps {
  data?: DriftDatum[];
  className?: string;
}

export default function MorphologicalDriftPlot({ data, className }: MorphologicalDriftPlotProps) {
  const [wrapperRef, width] = useContainerWidth();
  // One regime is always active — "1D Chains" on mount — so the info panel
  // starts populated and the highlighted points never clear.
  const [active, setActive] = useState<Morphology>("chain");
  const [hovered, setHovered] = useState<NormalizedPoint | null>(null);

  const points = useMemo<NormalizedPoint[]>(() => {
    const source = data && data.length > 0 ? data : DEFAULT_DATA;
    return source
      .filter(
        (d) =>
          Number.isFinite(d.mz) &&
          Number.isFinite(d.driftTime) &&
          Number.isFinite(d.nuclearity) &&
          Number.isFinite(d.intensity),
      )
      .map((d) => ({ ...d, morph: classify(d) }));
  }, [data]);

  // Responsive geometry (SSR renders at the default 700px width).
  const W = Math.max(280, Math.round(width));
  const H = Math.min(440, Math.max(300, Math.round(W * 0.58)));
  const MARGIN = { top: 26, right: 20, bottom: 44, left: 56 };
  const innerW = W - MARGIN.left - MARGIN.right;
  const innerH = H - MARGIN.top - MARGIN.bottom;

  const scales = useMemo(() => {
    const mzExtent = d3.extent(points, (d) => d.mz);
    const dtExtent = d3.extent(points, (d) => d.driftTime);
    const iExtent = d3.extent(points, (d) => d.intensity);

    const xScale = d3
      .scaleLinear()
      .domain(mzExtent[0] !== undefined ? mzExtent : [0, 1000])
      .nice()
      .range([MARGIN.left, W - MARGIN.right]);
    const yScale = d3
      .scaleLinear()
      .domain(dtExtent[0] !== undefined ? dtExtent : [0, 10])
      .nice()
      .range([H - MARGIN.bottom, MARGIN.top]);

    const lo = iExtent[0] ?? 0;
    const hi = iExtent[1] ?? 100;
    const rScale = d3
      .scaleSqrt()
      .domain(lo === hi ? [lo - 1, lo + 1] : [lo, hi])
      .range([2.4, 7.5]);

    // Adaptive regime bands along x: boundaries sit between adjacent regimes.
    const byMorph = (m: Morphology) => points.filter((p) => p.morph === m).map((p) => p.mz);
    const chainMax = d3.max(byMorph("chain"));
    const ringMin = d3.min(byMorph("ring"));
    const ringMax = d3.max(byMorph("ring"));
    const sphereMin = d3.min(byMorph("sphere"));

    const edges: Array<number | null> = [
      null,
      chainMax !== undefined && ringMin !== undefined ? (chainMax + ringMin) / 2 : null,
      ringMax !== undefined && sphereMin !== undefined ? (ringMax + sphereMin) / 2 : null,
      null,
    ];
    const bands = MORPH_ORDER.map((morph, i) => {
      const x0 = edges[i] ?? MARGIN.left;
      const x1 = edges[i + 1] ?? W - MARGIN.right;
      return { morph, x0, x1 };
    }).filter((band) => band.x1 > band.x0);

    return { xScale, yScale, rScale, xTicks: xScale.ticks(7), yTicks: yScale.ticks(6), bands };
  }, [points, W, H]);

  const activate = (morph: Morphology) => setActive(morph);

  const counts = useMemo(
    () =>
      MORPH_ORDER.reduce<Record<Morphology, number>>(
        (acc, morph) => ({ ...acc, [morph]: points.filter((p) => p.morph === morph).length }),
        { chain: 0, ring: 0, sphere: 0 },
      ),
    [points],
  );

  const activeMeta = MORPH_META[active];

  return (
    <div
      className={`w-full max-w-none my-6 rounded-xl border border-kanagawa-wave bg-kanagawa-sidebar/60 text-kanagawa-text p-4 sm:p-6 shadow-lg shadow-black/25 ${
        className ?? ""
      }`}
    >
      <style>{`
        .morph-point {
          transition: r 0.22s ease, fill-opacity 0.22s ease, stroke-opacity 0.22s ease,
            stroke-width 0.22s ease;
        }
        .morph-grid {
          stroke: var(--color-kanagawa-wave);
          stroke-opacity: 0.28;
          stroke-dasharray: 2 4;
        }
        .morph-axis-line { stroke: var(--color-kanagawa-wave); stroke-opacity: 0.6; }
        .morph-axis-text {
          fill: var(--color-kanagawa-muted);
          font-family: ${MONO_FONT};
          font-size: 10px;
        }
        .morph-axis-label {
          fill: var(--color-kanagawa-muted);
          font-family: ${MONO_FONT};
          font-size: 11px;
          letter-spacing: 0.04em;
        }
        .morph-band-label {
          font-family: ${MONO_FONT};
          font-size: 9px;
          letter-spacing: 0.08em;
        }
        @media (prefers-reduced-motion: reduce) {
          .morph-point { transition: none; }
        }
      `}</style>

      {/* ── Header ── */}
      <div className="mb-1 flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
        <h3 className="mt-0 text-lg font-semibold text-kanagawa-gold">
          Morphological Drift Map: Chains → Rings → Spheres
        </h3>
        <span className="mt-1 select-none rounded border border-kanagawa-accent/40 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-kanagawa-accent">
          Interactive
        </span>
      </div>
      <p className="mt-0 mb-4 font-mono text-xs text-kanagawa-text/70">
        TWIMS arrival-time landscape | m/z vs drift time (t<sub>D</sub>) | color = morphology,
        circle area ∝ intensity
      </p>

      {/* ── Regime selector ── */}
      <div
        className="flex flex-wrap items-center gap-2 mb-4"
        role="radiogroup"
        aria-label="Morphology regime"
      >
        {MORPH_ORDER.map((morph) => {
          const meta = MORPH_META[morph];
          const on = morph === active;
          return (
            <button
              key={morph}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => activate(morph)}
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11.5px] font-mono cursor-pointer select-none transition-colors duration-200"
              style={{
                borderColor: on ? meta.color : "var(--color-kanagawa-wave)",
                color: on ? meta.color : "var(--color-kanagawa-muted)",
                background: on ? `${meta.color}14` : "transparent",
              }}
            >
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ background: meta.color, opacity: on ? 1 : 0.35 }}
                aria-hidden="true"
              />
              {meta.label}
              <span className="tabular-nums opacity-70">{counts[morph]}</span>
            </button>
          );
        })}
      </div>

      {/* ── Chart ── */}
      <div ref={wrapperRef} className="select-none" style={{ touchAction: "manipulation" }}>
        <div className="morph-chart relative bg-kanagawa-sidebar border border-kanagawa-wave rounded-lg overflow-hidden">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="block w-full h-auto"
            role="img"
            aria-label="Scatter plot of drift time versus m/z, colored by morphology: 1D chains, rings, and compact spheres"
          >
            {/* Regime bands */}
            {scales.bands.map((band) => (
              <g key={band.morph}>
                <rect
                  x={band.x0}
                  y={MARGIN.top}
                  width={band.x1 - band.x0}
                  height={innerH}
                  fill={MORPH_META[band.morph].color}
                  opacity={0.05}
                />
                <text
                  x={(band.x0 + band.x1) / 2}
                  y={MARGIN.top + 13}
                  textAnchor="middle"
                  className="morph-band-label"
                  fill={MORPH_META[band.morph].color}
                  opacity={0.75}
                >
                  {MORPH_META[band.morph].short}
                </text>
              </g>
            ))}

            {/* Grid */}
            {scales.xTicks.map((tick) => (
              <line
                key={`gx-${tick}`}
                className="morph-grid"
                x1={scales.xScale(tick)}
                x2={scales.xScale(tick)}
                y1={MARGIN.top}
                y2={H - MARGIN.bottom}
              />
            ))}
            {scales.yTicks.map((tick) => (
              <line
                key={`gy-${tick}`}
                className="morph-grid"
                x1={MARGIN.left}
                x2={W - MARGIN.right}
                y1={scales.yScale(tick)}
                y2={scales.yScale(tick)}
              />
            ))}

            {/* Data points */}
            {points.map((point, i) => {
              const meta = MORPH_META[point.morph];
              const on = point.morph === active;
              const isHover = hovered === point;
              return (
                <circle
                  key={i}
                  className="morph-point"
                  cx={scales.xScale(point.mz)}
                  cy={scales.yScale(point.driftTime)}
                  r={scales.rScale(point.intensity) * (on ? 1.15 : 0.8)}
                  fill={meta.color}
                  fillOpacity={isHover ? 1 : on ? 0.85 : 0.12}
                  stroke={meta.color}
                  strokeOpacity={isHover ? 1 : on ? 0.35 : 0.15}
                  strokeWidth={isHover ? 1.6 : 0.7}
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => setHovered(point)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => activate(point.morph)}
                />
              );
            })}

            {/* Axes */}
            <g>
              <line
                className="morph-axis-line"
                x1={MARGIN.left}
                y1={H - MARGIN.bottom}
                x2={W - MARGIN.right}
                y2={H - MARGIN.bottom}
              />
              <line
                className="morph-axis-line"
                x1={MARGIN.left}
                y1={MARGIN.top}
                x2={MARGIN.left}
                y2={H - MARGIN.bottom}
              />
              {scales.xTicks.map((tick) => (
                <g key={`tx-${tick}`} transform={`translate(${scales.xScale(tick)}, 0)`}>
                  <line
                    className="morph-axis-line"
                    y1={H - MARGIN.bottom}
                    y2={H - MARGIN.bottom + 5}
                  />
                  <text className="morph-axis-text" y={H - MARGIN.bottom + 16} textAnchor="middle">
                    {scales.xScale.tickFormat(7)(tick)}
                  </text>
                </g>
              ))}
              {scales.yTicks.map((tick) => (
                <g key={`ty-${tick}`} transform={`translate(0, ${scales.yScale(tick)})`}>
                  <line className="morph-axis-line" x1={MARGIN.left - 5} x2={MARGIN.left} />
                  <text
                    className="morph-axis-text"
                    x={MARGIN.left - 8}
                    dy="0.32em"
                    textAnchor="end"
                  >
                    {scales.yScale.tickFormat(6)(tick)}
                  </text>
                </g>
              ))}
              <text
                className="morph-axis-label"
                x={MARGIN.left + innerW / 2}
                y={H - 4}
                textAnchor="middle"
              >
                m/z
              </text>
              <text
                className="morph-axis-label"
                transform={`translate(13, ${MARGIN.top + innerH / 2}) rotate(-90)`}
                textAnchor="middle"
              >
                Drift Time (ms)
              </text>
            </g>

            {/* Empty state */}
            {points.length === 0 && (
              <text
                className="morph-axis-text"
                x={MARGIN.left + innerW / 2}
                y={MARGIN.top + innerH / 2}
                textAnchor="middle"
              >
                No data points to display
              </text>
            )}
          </svg>
        </div>
      </div>

      {/* ── Info panel (fixed height → switching regimes never shifts the page) ── */}
      <div
        className="mt-4 flex h-28 items-center gap-3.5 rounded-lg border border-kanagawa-wave bg-kanagawa-bg p-3.5"
        aria-live="polite"
      >
        <div className="hidden shrink-0 sm:block">
          <StructureGlyph
            morphology={active}
            nuclearity={REPRESENTATIVE_N[active]}
            color={activeMeta.color}
            size={46}
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
            <h4 className="m-0 text-[14px] font-semibold text-kanagawa-text">{activeMeta.label}</h4>
            <span className="font-mono text-[10px] uppercase tracking-widest text-kanagawa-muted">
              {counts[active]} data points
            </span>
          </div>
          <p className="m-0 mt-1 text-xs leading-snug text-kanagawa-text/85">
            {activeMeta.description}
          </p>
        </div>
      </div>

      <p className="mt-3 mb-0 select-none font-mono text-[10px] text-kanagawa-muted">
        Click a regime or any data point to inspect it — the panel below keeps your selection
      </p>
    </div>
  );
}

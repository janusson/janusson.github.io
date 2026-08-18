/**
 * ExperimentalLoopArchitecture.tsx
 *
 * Interactive schematic of the automated microfluidic ESI-TWIMS-MS platform:
 *
 *   [Reagent Wells] → [Robotic Autosampler] → [Reaction Mixing Loop]
 *        → [ESI Source] → [TWIMS Cell] → [TOF Mass Analyzer]
 *
 * The info panel always shows one stage — "Reagent Wells" by default on
 * mount. Hovering, focusing, or clicking a node switches the panel to that
 * stage, and the selection is sticky: the pointer leaving a node never
 * clears it. Clicking (or pressing Enter/Space) toggles a "pin" marker on
 * the node.
 *
 * Layout is responsive: stages flow horizontally when the container is wide
 * enough, and stack vertically on narrow containers. Colors are drawn from the
 * site-wide Kanagawa design tokens (`var(--color-kanagawa-*)`) defined in
 * src/styles/global.css, so the diagram stays consistent with the theme.
 *
 * Hydration note: rendered in MDX as a React island, e.g.
 * <ExperimentalLoopArchitecture client:visible />
 */

import { useCallback, useEffect, useRef, useState } from "react";

/* ════════════════════════════════════════════════════════════════
   Stage definitions
   ════════════════════════════════════════════════════════════════ */

interface StageDef {
  /** Stable identifier, also used to pick the SVG glyph. */
  id: string;
  /** Zero-padded stage number shown on the node and in the panel. */
  index: string;
  /** Full stage name shown in the info panel. */
  name: string;
  /** Compact node label (kept short so it fits the SVG node). */
  short: string;
  /** Small caption rendered beneath the node label. */
  sub: string;
  /** Pipeline phase shown as a tag in the info panel. */
  category: string;
  /** Explanation shown in the info panel. */
  description: string;
}

const STAGES: StageDef[] = [
  {
    id: "reagent-wells",
    index: "01",
    name: "Reagent Wells",
    short: "Reagent Wells",
    sub: "stock reservoirs",
    category: "Preparation",
    description:
      "Holds the stock solutions that seed the reaction — ammonium molybdate, acid, and " +
      "fractional D\u2082O/solvent modifiers. Each reagent stream is metered programmatically, " +
      "so every run starts from identical, reproducible conditions.",
  },
  {
    id: "autosampler",
    index: "02",
    name: "Robotic Autosampler",
    short: "Autosampler",
    sub: "robotic injection",
    category: "Sampling",
    description:
      "Continuously withdraws micro-aliquots of the reaction mixture on a timed schedule and " +
      "injects them straight into the ESI source — sampling the evolving equilibria at defined " +
      "reaction ages without disturbing them.",
  },
  {
    id: "mixing-loop",
    index: "03",
    name: "Reaction Mixing Loop",
    short: "Mixing Loop",
    sub: "residence time",
    category: "Reaction",
    description:
      "Acid and molybdate streams merge here, triggering the fast, concurrent condensation " +
      "equilibria. Loop volume and flow rate fix the residence time, so each aliquot carries " +
      "the assembly \u201Cage\u201D at the moment it is sampled.",
  },
  {
    id: "esi-source",
    index: "04",
    name: "ESI Source",
    short: "ESI Source",
    sub: "soft ionization",
    category: "Ionization",
    description:
      "Soft electrospray ionization transfers intact polyanions from solution into the gas " +
      "phase. Charged microdroplets desolvate, gently liberating labile intermediates without " +
      "fragmenting them.",
  },
  {
    id: "twims-cell",
    index: "05",
    name: "TWIMS Cell",
    short: "TWIMS Cell",
    sub: "shape separation",
    category: "Separation",
    description:
      "Separates isobaric ions by collision cross section (shape): a travelling electrical " +
      "wave pulls ions through a buffer-gas-filled cell, so extended chains experience more " +
      "drag than compact spheres of identical m/z.",
  },
  {
    id: "tof-analyzer",
    index: "06",
    name: "TOF Mass Analyzer",
    short: "TOF Analyzer",
    sub: "high-res m/z",
    category: "Detection",
    description:
      "A time-of-flight analyzer converts flight time into m/z at high resolution, resolving " +
      "the complex polyisotopic envelopes. Combined with drift time, each injection yields the " +
      "full 3D m/z–drift-time–intensity map.",
  },
];

/* ════════════════════════════════════════════════════════════════
   Shared constants
   ════════════════════════════════════════════════════════════════ */

const MONO_FONT = "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";

/** Container width below which the pipeline stacks vertically. */
const STACK_BREAKPOINT = 640;

// Horizontal (desktop) geometry — viewBox width is 6 nodes + 5 gaps.
const NODE_W = 124;
const NODE_H = 96;
const H_GAP = 48;
const H_VIEW_W = 6 * NODE_W + 5 * H_GAP; // 984
const H_VIEW_H = 260;

// Vertical (stacked) geometry.
const V_VIEW_W = 340;
const V_NODE_W = 200;
const V_GAP = 52;
const V_VIEW_H = 16 + 6 * NODE_H + 5 * V_GAP + 16; // 868

/* ════════════════════════════════════════════════════════════════
   Minimalist stage glyphs (drawn in currentColor, ±13 units)
   ════════════════════════════════════════════════════════════════ */

function StageIcon({ id }: { id: string }) {
  const stroke = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  const dot = { fill: "currentColor", stroke: "none" };

  switch (id) {
    case "reagent-wells":
      // Three stock vials.
      return (
        <g {...stroke}>
          <rect x="-13" y="-8" width="7" height="16" rx="2.5" />
          <rect x="-3.5" y="-12" width="7" height="20" rx="2.5" />
          <rect x="6" y="-8" width="7" height="16" rx="2.5" />
        </g>
      );
    case "autosampler":
      // Syringe with plunger and dispensed droplets.
      return (
        <g {...stroke}>
          <rect x="-3.5" y="-7" width="7" height="14" rx="2" />
          <line x1="0" y1="-7" x2="0" y2="-13" />
          <line x1="-3.5" y1="1.5" x2="-3.5" y2="6" />
          <line x1="3.5" y1="1.5" x2="3.5" y2="6" />
          <line x1="-3.5" y1="6" x2="3.5" y2="6" />
          <circle cx="7.5" cy="9.5" r="1.6" {...dot} />
          <circle cx="10.5" cy="6" r="1.1" {...dot} />
        </g>
      );
    case "mixing-loop":
      // Residence-time coil inside a reactor tube.
      return (
        <g {...stroke}>
          <rect x="-12" y="-8" width="24" height="16" rx="5" />
          <path d="M -7.5 2 C -6.2 -1.2 -3.8 -1.2 -2.5 2 C -1.2 5.2 1.2 5.2 2.5 2 C 3.8 -1.2 6.2 -1.2 7.5 2" />
        </g>
      );
    case "esi-source":
      // Taylor cone with spray plume and droplets.
      return (
        <g {...stroke}>
          <path d="M 0 9 L -5.5 -2.5 L 5.5 -2.5 Z" />
          <line x1="0" y1="9" x2="0" y2="12.5" />
          <path d="M -2 -6 L -4.5 -9.5 M 0 -6.5 L 0 -11 M 2 -6 L 4.5 -9.5" />
          <circle cx="6" cy="0.5" r="1.3" {...dot} />
          <circle cx="8.5" cy="3.5" r="0.9" {...dot} />
        </g>
      );
    case "twims-cell":
      // Buffer-gas cell with ring electrodes and a travelling wave beneath.
      return (
        <g {...stroke}>
          <rect x="-12" y="-9" width="24" height="18" rx="4" />
          <line x1="-6" y1="-7" x2="-6" y2="7" opacity={0.7} />
          <line x1="0" y1="-7" x2="0" y2="7" opacity={0.7} />
          <line x1="6" y1="-7" x2="6" y2="7" opacity={0.7} />
          <path d="M -9 13 C -6 11 -3.5 15 0 13 C 3.5 11 6 15 9 13" opacity={0.85} />
        </g>
      );
    case "tof-analyzer":
      // Reflectron flight path into a detector.
      return (
        <g {...stroke}>
          <path d="M -12 5.5 L -1 -6.5" />
          <path d="M 4.5 -9.5 L 9 -3.5" />
          <path d="M 2.2 -7.5 L 6.7 -1.5" opacity={0.6} />
          <path d="M -1 -6.5 L -5.5 5.5" />
          <rect
            x="-10.5"
            y="4.5"
            width="7"
            height="6.5"
            rx="1"
            fill="currentColor"
            stroke="none"
            opacity={0.4}
          />
        </g>
      );
    default:
      return null;
  }
}

/* ════════════════════════════════════════════════════════════════
   Geometry helpers
   ════════════════════════════════════════════════════════════════ */

/** Filled triangle pointing from (x1,y1) toward (x2,y2), stopping `tipMargin` short. */
function arrowPoints(x1: number, y1: number, x2: number, y2: number, tipMargin = 5): string {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const reach = Math.hypot(x2 - x1, y2 - y1) - tipMargin;
  const tx = x1 + Math.cos(angle) * reach;
  const ty = y1 + Math.sin(angle) * reach;
  const back = 8;
  const half = 4.2;
  const bx = tx - Math.cos(angle) * back;
  const by = ty - Math.sin(angle) * back;
  const px = Math.cos(angle + Math.PI / 2) * half;
  const py = Math.sin(angle + Math.PI / 2) * half;
  const fmt = (v: number) => v.toFixed(2);
  return `${fmt(tx)},${fmt(ty)} ${fmt(bx + px)},${fmt(by + py)} ${fmt(bx - px)},${fmt(by - py)}`;
}

/* ════════════════════════════════════════════════════════════════
   Sub-components
   ════════════════════════════════════════════════════════════════ */

interface StageNodeProps {
  stage: StageDef;
  x: number;
  y: number;
  w: number;
  active: boolean;
  pinned: boolean;
  onActivate: (id: string) => void;
  onTogglePin: (id: string) => void;
}

function StageNode({ stage, x, y, w, active, pinned, onActivate, onTogglePin }: StageNodeProps) {
  const cx = x + w / 2;
  const iconCy = y + 30;
  const labelY = y + 68;
  const subY = y + 84;

  const handleKeyDown = (event: React.KeyboardEvent<SVGGElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onTogglePin(stage.id);
    }
  };

  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={`${stage.name} — ${stage.category}`}
      aria-pressed={pinned}
      className="loa-node"
      style={{ cursor: "pointer", outline: "none", WebkitTapHighlightColor: "transparent" }}
      onMouseEnter={() => onActivate(stage.id)}
      onFocus={() => onActivate(stage.id)}
      onClick={() => onTogglePin(stage.id)}
      onKeyDown={handleKeyDown}
    >
      <title>{`${stage.name} — ${stage.category}`}</title>

      <rect
        className="loa-node-rect"
        x={x}
        y={y}
        width={w}
        height={NODE_H}
        rx={10}
        fill={active ? "var(--color-kanagawa-accent)" : "var(--color-kanagawa-bg)"}
        fillOpacity={active ? 0.12 : 1}
        stroke={active ? "var(--color-kanagawa-accent)" : "var(--color-kanagawa-muted)"}
        strokeOpacity={active ? 1 : 0.85}
        strokeWidth={active ? 1.6 : 1.2}
        style={{ transition: "stroke 0.25s ease, fill 0.25s ease, fill-opacity 0.25s ease" }}
      />

      {/* Stage number chip */}
      <text
        x={x + 11}
        y={y + 16}
        fontFamily={MONO_FONT}
        fontSize={8.5}
        fill={active ? "var(--color-kanagawa-accent)" : "var(--color-kanagawa-muted)"}
        style={{ transition: "fill 0.25s ease" }}
      >
        {stage.index}
      </text>

      {/* Pinned indicator */}
      {pinned && (
        <circle
          cx={x + w - 11}
          cy={y + 11}
          r={3}
          fill="var(--color-kanagawa-gold)"
          style={{ transition: "fill 0.25s ease" }}
        >
          <title>Pinned</title>
        </circle>
      )}

      {/* Glyph */}
      <g transform={`translate(${cx}, ${iconCy})`}>
        <circle r={17} fill="var(--color-kanagawa-muted)" opacity={0.14} />
        <g
          color={active ? "var(--color-kanagawa-gold)" : "var(--color-kanagawa-text)"}
          style={{ transition: "color 0.25s ease" }}
        >
          <StageIcon id={stage.id} />
        </g>
      </g>

      {/* Labels */}
      <text
        x={cx}
        y={labelY}
        textAnchor="middle"
        fontFamily={MONO_FONT}
        fontSize={11.5}
        fill={active ? "var(--color-kanagawa-gold)" : "var(--color-kanagawa-text)"}
        style={{ transition: "fill 0.25s ease" }}
      >
        {stage.short}
      </text>
      <text
        x={cx}
        y={subY}
        textAnchor="middle"
        fontFamily={MONO_FONT}
        fontSize={9}
        fill={active ? "var(--color-kanagawa-accent)" : "var(--color-kanagawa-text)"}
        opacity={active ? 1 : 0.72}
        style={{ transition: "fill 0.25s ease" }}
      >
        {stage.sub}
      </text>
    </g>
  );
}

interface ConnectorProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  active: boolean;
}

function Connector({ x1, y1, x2, y2, active }: ConnectorProps) {
  return (
    <g style={{ transition: "opacity 0.25s ease" }}>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="var(--color-kanagawa-muted)"
        strokeOpacity={0.7}
        strokeWidth={1.4}
      />
      <line
        className="loa-flow"
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="var(--color-kanagawa-accent)"
        strokeWidth={1.4}
        strokeDasharray="3 9"
        opacity={active ? 0.95 : 0.55}
      />
      <polygon
        points={arrowPoints(x1, y1, x2, y2)}
        fill="var(--color-kanagawa-accent)"
        opacity={active ? 1 : 0.7}
      />
    </g>
  );
}

/** Measures the wrapper's rendered width so the layout adapts to its container, not the viewport. */
function useContainerWidth(): [React.RefObject<HTMLDivElement | null>, number] {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(H_VIEW_W); // SSR-safe default: render the horizontal layout first.

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
   Component
   ════════════════════════════════════════════════════════════════ */

export default function ExperimentalLoopArchitecture() {
  const [wrapperRef, width] = useContainerWidth();
  // The panel always shows a stage — the first one by default on mount.
  // Hovering or focusing switches it; leaving the node never clears it.
  const [activeId, setActiveId] = useState<string>(STAGES[0].id);
  const [pinnedId, setPinnedId] = useState<string | null>(null);

  const activate = useCallback((id: string) => setActiveId(id), []);

  // Clicking toggles the pin marker; it always shows the clicked stage.
  const togglePin = useCallback((id: string) => {
    setPinnedId((current) => (current === id ? null : id));
    setActiveId(id);
  }, []);

  const wide = width >= STACK_BREAKPOINT;
  const viewBox = wide ? `0 0 ${H_VIEW_W} ${H_VIEW_H}` : `0 0 ${V_VIEW_W} ${V_VIEW_H}`;

  // Stage placements for the active orientation.
  const placements = STAGES.map((stage, i) => {
    if (wide) {
      const x = i * (NODE_W + H_GAP);
      return { stage, x, y: (H_VIEW_H - NODE_H) / 2, w: NODE_W };
    }
    const y = 16 + i * (NODE_H + V_GAP);
    return { stage, x: (V_VIEW_W - V_NODE_W) / 2, y, w: V_NODE_W };
  });

  // Connectors between consecutive stages.
  const connectors = placements.slice(0, -1).map((from, i) => {
    const to = placements[i + 1];
    if (wide) {
      return {
        key: from.stage.id,
        active: to.stage.id === activeId,
        x1: from.x + NODE_W,
        y1: H_VIEW_H / 2,
        x2: to.x,
        y2: H_VIEW_H / 2,
      };
    }
    return {
      key: from.stage.id,
      active: to.stage.id === activeId,
      x1: V_VIEW_W / 2,
      y1: from.y + NODE_H,
      x2: V_VIEW_W / 2,
      y2: to.y,
    };
  });

  const activeStage = STAGES.find((stage) => stage.id === activeId) ?? STAGES[0];

  return (
    <div className="w-full max-w-none my-6 rounded-xl border border-kanagawa-wave bg-kanagawa-sidebar/60 text-kanagawa-text p-4 sm:p-6 shadow-lg shadow-black/25">
      <style>{`
        @keyframes loa-dash { to { stroke-dashoffset: -12; } }
        .loa-flow { animation: loa-dash 1.1s linear infinite; }
        @keyframes loa-panel { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: none; } }
        .loa-panel-card { animation: loa-panel 0.28s ease; }
        .loa-node:focus-visible .loa-node-rect {
          stroke: var(--color-kanagawa-accent);
          stroke-width: 1.8;
          stroke-dasharray: 4 3;
        }
        @media (prefers-reduced-motion: reduce) {
          .loa-flow { animation: none; }
          .loa-panel-card { animation: none; }
        }
      `}</style>

      {/* ── Header ── */}
      <div className="mb-1 flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
        <h3 className="mt-0 text-lg font-semibold text-kanagawa-gold">
          Automated ESI-TWIMS-MS Platform
        </h3>
        <span className="mt-1 select-none rounded border border-kanagawa-accent/40 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-kanagawa-accent">
          Interactive
        </span>
      </div>
      <p className="mt-0 mb-4 font-mono text-xs text-kanagawa-text/70">
        Inline microfluidic synthesis → electrospray ionization → travelling-wave ion mobility →
        time-of-flight MS
      </p>

      {/* ── Pipeline schematic ── */}
      <div ref={wrapperRef} className="select-none" style={{ touchAction: "manipulation" }}>
        <svg
          viewBox={viewBox}
          className="block w-full h-auto"
          role="group"
          aria-label="Automated experimental pipeline schematic: reagent wells to robotic autosampler to reaction mixing loop to ESI source to TWIMS cell to TOF mass analyzer"
        >
          {connectors.map((connector) => (
            <Connector
              key={connector.key}
              x1={connector.x1}
              y1={connector.y1}
              x2={connector.x2}
              y2={connector.y2}
              active={connector.active}
            />
          ))}
          {placements.map(({ stage, x, y, w }) => (
            <StageNode
              key={stage.id}
              stage={stage}
              x={x}
              y={y}
              w={w}
              active={stage.id === activeId}
              pinned={stage.id === pinnedId}
              onActivate={activate}
              onTogglePin={togglePin}
            />
          ))}
        </svg>
      </div>

      {/* ── Info panel ── */}
      <div
        className="mt-4 min-h-22 rounded-lg border border-kanagawa-wave bg-kanagawa-bg p-3.5 sm:p-4"
        aria-live="polite"
      >
        <div key={activeStage.id} className="loa-panel-card flex flex-col gap-2">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <div className="flex items-baseline gap-2.5">
              <span className="font-mono text-[11px] text-kanagawa-gold tabular-nums">
                STAGE {activeStage.index}/06
              </span>
              <h4 className="m-0 text-[15px] font-semibold text-kanagawa-text">
                {activeStage.name}
              </h4>
            </div>
            <span className="rounded border border-kanagawa-wave px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-kanagawa-muted">
              {activeStage.category}
            </span>
          </div>
          <p className="m-0 text-sm leading-relaxed text-kanagawa-text/85">
            {activeStage.description}
          </p>
        </div>
      </div>

      <p className="mt-3 mb-0 select-none font-mono text-[10px] text-kanagawa-muted">
        Hover, tap, or Tab through the stages — the panel keeps your last selection. Click (or press
        Enter) to pin a stage.
      </p>
    </div>
  );
}

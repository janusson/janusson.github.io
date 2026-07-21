import { useEffect, useRef, useState, useCallback } from "react";
import * as d3 from "d3";

// ═════════════════════════════════════════════════════════════
//  Hardcoded experimental dataset — polyoxomolybdate (POMo)
//  TWIMS speciation intermediates
// ═════════════════════════════════════════════════════════════

const DATA = [
  // ── Monoanions (z = −1) ──
  {
    id: "Mo1",
    formula: "[HMoO\u2084]\u207B",
    expMz: 162.1,
    calcMz: 160.94,
    driftTime: 1.87,
    step: 1,
    band: "monoanion",
    note: "Mononuclear starting oxoanion",
  },
  {
    id: "Mo2",
    formula: "[HMo\u2082O\u2087]\u207B",
    expMz: 303.69,
    calcMz: 304.88,
    driftTime: 2.64,
    step: 2,
    band: "monoanion",
    note: "Dimeric condensation product",
  },
  {
    id: "Mo3",
    formula: "[HMo\u2083O\u2081\u2080]\u207B",
    expMz: 447.35,
    calcMz: 448.81,
    driftTime: 3.41,
    step: 3,
    band: "monoanion",
    note: "Trimeric chain intermediate",
  },
  {
    id: "Mo4",
    formula: "[HMo\u2084O\u2081\u2083]\u207B",
    expMz: 592.04,
    calcMz: 592.75,
    driftTime: 4.07,
    step: 4,
    band: "monoanion",
    note: "Tetrameric intermediate",
  },
  {
    id: "Mo5",
    formula: "[HMo\u2085O\u2081\u2086]\u207B",
    expMz: 736.76,
    calcMz: 736.69,
    driftTime: 4.4,
    step: 5,
    band: "monoanion",
    note: "Pentameric intermediate",
  },
  {
    id: "Mo6",
    formula: "[HMo\u2086O\u2081\u2089]\u207B",
    expMz: 879.5,
    calcMz: 880.62,
    driftTime: 4.84,
    step: 6,
    band: "monoanion",
    note: "Lindqvist cluster precursor core",
  },
  {
    id: "Mo7",
    formula: "[HMo\u2087O\u2082\u2082]\u207B",
    expMz: 1023.24,
    calcMz: 1024.56,
    driftTime: 5.39,
    step: 7,
    band: "monoanion",
    note: "Heptameric assembly",
  },
  {
    id: "Mo8",
    formula: "[HMo\u2088O\u2082\u2085]\u207B",
    expMz: 1167.98,
    calcMz: 1168.49,
    driftTime: 6.27,
    step: 8,
    band: "monoanion",
    note: "Octameric assembly",
  },
  {
    id: "Mo9",
    formula: "[HMo\u2089O\u2082\u2088]\u207B",
    expMz: 1310.78,
    calcMz: 1312.43,
    driftTime: 6.93,
    step: 9,
    band: "monoanion",
    note: "Nonameric assembly",
  },
  {
    id: "Mo10",
    formula: "[HMo\u2081\u2080O\u2083\u2081]\u207B",
    expMz: 1449.05,
    calcMz: 1456.37,
    driftTime: 7.81,
    step: 10,
    band: "monoanion",
    note: "Decameric assembly",
  },
  {
    id: "Mo11",
    formula: "[HMo\u2081\u2081O\u2083\u2084]\u207B",
    expMz: 1593.95,
    calcMz: 1600.3,
    driftTime: 8.14,
    step: 11,
    band: "monoanion",
    note: "Undecameric assembly",
  },
  {
    id: "Mo12",
    formula: "[HMo\u2081\u2082O\u2083\u2087]\u207B",
    expMz: 1746.08,
    calcMz: 1744.24,
    driftTime: 8.69,
    step: 12,
    band: "monoanion",
    note: "Keggin shell boundary intermediate",
  },

  // ── Dianions (z = −2) ──
  {
    id: "Mo2_di",
    formula: "[Mo\u2082O\u2087]\u00B2\u207B",
    expMz: 152.39,
    calcMz: 151.94,
    driftTime: 1.65,
    step: 2,
    band: "dianion",
    note: "Doubly charged dimer",
  },
  {
    id: "Mo6_di",
    formula: "[Mo\u2086O\u2081\u2089]\u00B2\u207B",
    expMz: 439.7,
    calcMz: 439.81,
    driftTime: 2.31,
    step: 6,
    band: "dianion",
    note: "Doubly charged Lindqvist core",
  },
  {
    id: "Mo12_di",
    formula: "[Mo\u2081\u2082O\u2083\u2087]\u00B2\u207B",
    expMz: 870.5,
    calcMz: 871.61,
    driftTime: 3.85,
    step: 12,
    band: "dianion",
    note: "Doubly charged Keggin intermediate",
  },

  // ── Deuterated Aquated Solvates (z = −2, D₂O matrix) ──
  {
    id: "Mo4_solv",
    formula: "[MoO\u2084(MoO\u2083)\u2083(D\u2082O)\u2083]\u00B2\u207B",
    expMz: 325.78,
    calcMz: 325.91,
    driftTime: 2.31,
    step: 4,
    band: "solvate",
    note: "Aquated tetrameric pre-condensation complex",
  },
  {
    id: "Mo5_solv",
    formula: "[MoO\u2084(MoO\u2083)\u2084(D\u2082O)\u2083]\u00B2\u207B",
    expMz: 398.73,
    calcMz: 397.88,
    driftTime: 2.42,
    step: 5,
    band: "solvate",
    note: "Aquated pentameric pre-condensation complex",
  },
  {
    id: "Mo12_solv",
    formula: "[MoO\u2084(MoO\u2083)\u2081\u2081(D\u2082O)\u2083]\u00B2\u207B",
    expMz: 902.87,
    calcMz: 901.66,
    driftTime: 3.74,
    step: 12,
    band: "solvate",
    note: "Heavy deuterated Keggin solvate sphere",
  },

  // ── Borosilicate Leaching Artifact ──
  {
    id: "BMo12",
    formula: "[BMo\u2081\u2082O\u2084\u2081H\u2084]\u207B",
    expMz: 1825.83,
    calcMz: 1825.83,
    driftTime: 8.85,
    step: 0,
    band: "artifact",
    note: "Boromolybdate Keggin leached from borosilicate glass",
  },
];

// ═════════════════════════════════════════════════════════════
//  Chart constants
// ═════════════════════════════════════════════════════════════

const MARGIN = { top: 25, right: 30, bottom: 58, left: 72 };
const VIEWBOX_W = 800;
const VIEWBOX_H = 500;
const INNER_W = VIEWBOX_W - MARGIN.left - MARGIN.right;
const INNER_H = VIEWBOX_H - MARGIN.top - MARGIN.bottom;

const BAND_COLORS = {
  monoanion: "#e6c384", // Carp Yellow (Kanagawa gold)
  dianion: "#7e9cd8", // Crystal Blue (Kanagawa accent)
  solvate: "#2dd4bf", // Teal
  artifact: "#f87171", // Warning red
};

const SUBS = [
  "",
  "\u2081",
  "\u2082",
  "\u2083",
  "\u2084",
  "\u2085",
  "\u2086",
  "\u2087",
  "\u2088",
  "\u2089",
  "\u2081\u2080",
  "\u2081\u2081",
  "\u2081\u2082",
];

function formatNuclearity(n) {
  return `Mo${SUBS[n]}`;
}

// ═════════════════════════════════════════════════════════════
//  Sub-components
// ═════════════════════════════════════════════════════════════

function InspectionCard({ node, onClose }) {
  if (!node) return null;
  const delta = node.expMz - node.calcMz;
  const deltaSign = delta >= 0 ? "+" : "";
  const deltaStr = `${deltaSign}${delta.toFixed(2)}`;
  const deltaColor = delta < 0 ? "text-emerald-400" : "text-rose-400";

  return (
    <div className="samm-inspect mt-4 p-4 rounded-lg border border-kanagawa-wave bg-kanagawa-sidebar text-xs font-mono relative">
      <button
        onClick={onClose}
        className="absolute top-2 right-3 text-kanagawa-muted hover:text-kanagawa-text text-sm leading-none"
        aria-label="Close inspection card"
      >
        ✕
      </button>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1.5 pr-4">
        <div className="text-kanagawa-muted">Assigned Formula</div>
        <div className="col-span-1 sm:col-span-2 text-kanagawa-text font-semibold">
          {node.formula}
        </div>

        <div className="text-kanagawa-muted">Exp. Base Peak m/z</div>
        <div className="text-kanagawa-gold tabular-nums">{node.expMz.toFixed(2)}</div>

        <div className="text-kanagawa-muted">Calculated m/z</div>
        <div className="tabular-nums">{node.calcMz.toFixed(2)}</div>

        <div className="text-kanagawa-muted">Mass Error (ΔDa)</div>
        <div className={`tabular-nums ${deltaColor}`}>{deltaStr}</div>

        <div className="text-kanagawa-muted">Drift Time (ms)</div>
        <div className="text-kanagawa-accent tabular-nums">{node.driftTime.toFixed(2)}</div>

        <div className="text-kanagawa-muted">Structural Notes</div>
        <div className="col-span-1 sm:col-span-2 italic text-kanagawa-text">{node.note}</div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
//  Helper: draw a diamond path centered at (cx, cy)
// ═════════════════════════════════════════════════════════════
function diamondPath(cx, cy, size) {
  return `M${cx},${cy - size} L${cx + size},${cy} L${cx},${cy + size} L${cx - size},${cy} Z`;
}

function trianglePath(cx, cy, size) {
  return `M${cx},${cy - size} L${cx + size},${cy + size * 0.75} L${cx - size},${cy + size * 0.75} Z`;
}

function crossPath(cx, cy, size) {
  const t = size * 0.35;
  return [
    `M${cx - t},${cy - size} L${cx + t},${cy - size}`,
    `L${cx + t},${cy - t} L${cx + size},${cy - t}`,
    `L${cx + size},${cy + t} L${cx + t},${cy + t}`,
    `L${cx + t},${cy + size} L${cx - t},${cy + size}`,
    `L${cx - t},${cy + t} L${cx - size},${cy + t}`,
    `L${cx - size},${cy - t} L${cx - t},${cy - t} Z`,
  ].join(" ");
}

// ═════════════════════════════════════════════════════════════
//  Main component
// ═════════════════════════════════════════════════════════════

export default function SammSpeciationExplorer() {
  const svgRef = useRef(null);
  const containerRef = useRef(null);

  const [visibleBands, setVisibleBands] = useState({
    monoanion: true,
    dianion: true,
    solvate: true,
    artifact: true,
  });
  const [nuclearityStep, setNuclearityStep] = useState(12);
  const [selectedNode, setSelectedNode] = useState(null);

  const toggleBand = useCallback((band) => {
    setVisibleBands((prev) => ({ ...prev, [band]: !prev[band] }));
    setSelectedNode(null);
  }, []);

  // ═════════════════════════════════════════════════════════
  //  D3 rendering — runs on mount and whenever state changes
  // ═════════════════════════════════════════════════════════
  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    // ── Clear previous render ──
    d3.select(svgEl).selectAll("*").remove();

    const svg = d3
      .select(svgEl)
      .attr("viewBox", `0 0 ${VIEWBOX_W} ${VIEWBOX_H}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    const chart = svg.append("g").attr("transform", `translate(${MARGIN.left},${MARGIN.top})`);

    // Clip path for trendlines
    chart
      .append("defs")
      .append("clipPath")
      .attr("id", "samm-clip")
      .append("rect")
      .attr("width", INNER_W)
      .attr("height", INNER_H);

    // ── Scales ──
    const xScale = d3.scaleLinear().domain([0, 2000]).range([0, INNER_W]);
    const yScale = d3.scaleLinear().domain([1, 10]).range([INNER_H, 0]);

    // ── Axes ──
    chart
      .append("g")
      .attr("transform", `translate(0,${INNER_H})`)
      .call(d3.axisBottom(xScale).ticks(10).tickSizeOuter(0).tickFormat(d3.format("d")));

    chart
      .append("g")
      .call(d3.axisLeft(yScale).ticks(9).tickSizeOuter(0).tickFormat(d3.format(".1f")));

    // Axis labels
    chart
      .append("text")
      .attr("class", "samm-axis-label")
      .attr("x", INNER_W / 2)
      .attr("y", INNER_H + 44)
      .attr("text-anchor", "middle")
      .attr("fill", "#727169")
      .attr("font-family", "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace")
      .attr("font-size", "11px")
      .text("Mass-to-Charge (m/z)");

    chart
      .append("text")
      .attr("class", "samm-axis-label")
      .attr("x", -INNER_H / 2)
      .attr("y", -54)
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .attr("fill", "#727169")
      .attr("font-family", "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace")
      .attr("font-size", "11px")
      .text("Drift Time t\u209B (ms)");

    // ── Grid lines ──
    const gridStyle = { stroke: "#2d4f67", "stroke-opacity": 0.18, "stroke-dasharray": "3,3" };
    chart
      .append("g")
      .selectAll("line")
      .data(xScale.ticks(10))
      .enter()
      .append("line")
      .attr("x1", (d) => xScale(d))
      .attr("x2", (d) => xScale(d))
      .attr("y1", 0)
      .attr("y2", INNER_H)
      .attr("stroke", gridStyle.stroke)
      .attr("stroke-opacity", gridStyle["stroke-opacity"])
      .attr("stroke-dasharray", gridStyle["stroke-dasharray"]);
    chart
      .append("g")
      .selectAll("line")
      .data(yScale.ticks(9))
      .enter()
      .append("line")
      .attr("x1", 0)
      .attr("x2", INNER_W)
      .attr("y1", (d) => yScale(d))
      .attr("y2", (d) => yScale(d))
      .attr("stroke", gridStyle.stroke)
      .attr("stroke-opacity", gridStyle["stroke-opacity"])
      .attr("stroke-dasharray", gridStyle["stroke-dasharray"]);

    // ── Filter visible data ──
    const activeData = DATA.filter((d) => visibleBands[d.band]);

    // ── Trendlines (charge-band corridors) ──
    const trendGroup = chart.append("g").attr("clip-path", "url(#samm-clip)");

    function drawTrendline(band, data, color) {
      const sorted = data.filter((d) => d.band === band).sort((a, b) => a.expMz - b.expMz);
      if (sorted.length < 2) return;
      const lineGen = d3
        .line()
        .x((d) => xScale(d.expMz))
        .y((d) => yScale(d.driftTime))
        .curve(d3.curveMonotoneX);
      trendGroup
        .append("path")
        .datum(sorted)
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-width", 2.2)
        .attr("stroke-opacity", 0.4)
        .attr("stroke-dasharray", "6,5")
        .attr("d", lineGen);
    }

    if (visibleBands.monoanion) drawTrendline("monoanion", DATA, BAND_COLORS.monoanion);
    if (visibleBands.dianion) drawTrendline("dianion", DATA, BAND_COLORS.dianion);

    // ── Shaded corridor between monoanion & dianion bands ──
    if (visibleBands.monoanion && visibleBands.dianion) {
      const mono = DATA.filter((d) => d.band === "monoanion").sort((a, b) => a.expMz - b.expMz);
      const di = DATA.filter((d) => d.band === "dianion").sort((a, b) => a.expMz - b.expMz);
      if (mono.length >= 2 && di.length >= 2) {
        const areaGen = d3
          .area()
          .x((d) => xScale(d.expMz))
          .y0((d) => yScale(d.driftTime))
          .y1((_, i) => {
            const diPoint = di[Math.min(i, di.length - 1)];
            return yScale(diPoint.driftTime);
          })
          .curve(d3.curveMonotoneX);

        // Build combined data for area: use mono x-range, extend with di if needed
        const areaData = mono.map((m, i) => ({
          ...m,
          _diY: di[Math.min(i, di.length - 1)]?.driftTime,
        }));
        trendGroup
          .append("path")
          .datum(areaData)
          .attr("fill", BAND_COLORS.dianion)
          .attr("fill-opacity", 0.06)
          .attr("stroke", "none")
          .attr(
            "d",
            areaGen.y0((d) => yScale(d.driftTime)).y1((d) => yScale(d._diY ?? d.driftTime)),
          );
      }
    }

    // ── Nodes ──
    const nodeGroup = chart.append("g");

    const nodeSelection = nodeGroup
      .selectAll("g.samm-node")
      .data(activeData)
      .enter()
      .append("g")
      .attr("class", (d) => `samm-node samm-node-${d.band}`)
      .attr("data-id", (d) => d.id)
      .style("cursor", "pointer");

    // Determine node opacity based on stepper
    function nodeOpacity(d) {
      if (d.band !== "monoanion") return { core: 0.9, ring: 0.35, label: 1 };
      if (d.step <= nuclearityStep) {
        const isCurrent = d.step === nuclearityStep;
        return { core: 0.95, ring: isCurrent ? 0.8 : 0.35, label: 1 };
      }
      return { core: 0.15, ring: 0.06, label: 0.2 };
    }

    function nodeRadius(d) {
      if (d.band !== "monoanion") return { core: 5, ring: 7 };
      if (d.step <= nuclearityStep) {
        const isCurrent = d.step === nuclearityStep;
        return { core: isCurrent ? 6.5 : 5, ring: isCurrent ? 9.5 : 7 };
      }
      return { core: 3.5, ring: 5 };
    }

    // Draw nodes with band-appropriate markers
    nodeSelection.each(function (d) {
      const g = d3.select(this);
      const cx = xScale(d.expMz);
      const cy = yScale(d.driftTime);
      const op = nodeOpacity(d);
      const rad = nodeRadius(d);
      const color = BAND_COLORS[d.band];

      if (d.band === "diamond" || d.band === "dianion") {
        // Diamond marker
        g.append("path")
          .attr("class", "samm-node-core")
          .attr("d", diamondPath(cx, cy, rad.core + 1))
          .attr("fill", color)
          .attr("fill-opacity", op.core)
          .attr("stroke", "#1f1f28")
          .attr("stroke-width", 1.5);
      } else if (d.band === "solvate") {
        // Triangle marker
        g.append("path")
          .attr("class", "samm-node-core")
          .attr("d", trianglePath(cx, cy, rad.core + 1))
          .attr("fill", color)
          .attr("fill-opacity", op.core)
          .attr("stroke", "#1f1f28")
          .attr("stroke-width", 1.5);
      } else if (d.band === "artifact") {
        // Cross marker
        g.append("path")
          .attr("class", "samm-node-core")
          .attr("d", crossPath(cx, cy, rad.core + 1))
          .attr("fill", color)
          .attr("fill-opacity", op.core)
          .attr("stroke", "#fca5a5")
          .attr("stroke-width", 1.5);
      } else {
        // Circle (monoanion default)
        g.append("circle")
          .attr("class", "samm-node-ring")
          .attr("cx", cx)
          .attr("cy", cy)
          .attr("r", rad.ring)
          .attr("fill", "none")
          .attr("stroke", color)
          .attr("stroke-width", 2)
          .attr("stroke-opacity", op.ring);
        g.append("circle")
          .attr("class", "samm-node-core")
          .attr("cx", cx)
          .attr("cy", cy)
          .attr("r", rad.core)
          .attr("fill", color)
          .attr("fill-opacity", op.core)
          .attr("stroke", "#1f1f28")
          .attr("stroke-width", 1.5);
      }

      // ID label
      let labelText = d.id.replace("_di", "\u00B2\u207B").replace("_solv", "\u00B7solv");
      g.append("text")
        .attr("class", "samm-node-label")
        .attr("x", cx)
        .attr("y", cy - 12)
        .attr("text-anchor", "middle")
        .attr("fill", color)
        .attr("fill-opacity", op.label)
        .attr("font-family", "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace")
        .attr("font-size", "9px")
        .attr("font-weight", "600")
        .text(labelText);
    });

    // ── Interactivity ──
    nodeSelection.on("click", (_event, d) => {
      setSelectedNode(d);
    });

    nodeSelection.on("mouseenter", function () {
      d3.select(this)
        .select(".samm-node-ring")
        ?.transition()
        .duration(150)
        .attr("r", 11)
        .attr("stroke-opacity", 0.8);
      d3.select(this)
        .select(".samm-node-core")
        ?.transition()
        .duration(150)
        .attr("stroke", "#e6c384")
        .attr("stroke-width", 2);
    });

    nodeSelection.on("mouseleave", function () {
      d3.select(this)
        .select(".samm-node-ring")
        ?.transition()
        .duration(150)
        .attr("r", 7)
        .attr("stroke-opacity", 0.35);
      d3.select(this)
        .select(".samm-node-core")
        ?.transition()
        .duration(150)
        .attr("stroke", "#1f1f28")
        .attr("stroke-width", 1.5);
    });

    // ── Legend ──
    const legend = chart.append("g").attr("transform", `translate(${INNER_W - 170}, 8)`);

    const legendItems = [
      { band: "monoanion", label: "Monoanions (−1)", marker: "circle" },
      { band: "dianion", label: "Dianions (−2)", marker: "diamond" },
      { band: "solvate", label: "D₂O Solvates", marker: "triangle" },
      { band: "artifact", label: "Borosilicate", marker: "cross" },
    ];

    legendItems.forEach((item, i) => {
      const lg = legend.append("g").attr("transform", `translate(0, ${i * 17})`);
      const cy = 6;
      const color = BAND_COLORS[item.band];

      if (item.marker === "diamond") {
        lg.append("path")
          .attr("d", diamondPath(7, cy, 4.5))
          .attr("fill", color);
      } else if (item.marker === "triangle") {
        lg.append("path")
          .attr("d", trianglePath(7, cy, 4.5))
          .attr("fill", color);
      } else if (item.marker === "cross") {
        lg.append("path")
          .attr("d", crossPath(7, cy, 4.5))
          .attr("fill", color);
      } else {
        lg.append("circle").attr("cx", 7).attr("cy", cy).attr("r", 4.5).attr("fill", color);
      }
      lg.append("text")
        .attr("x", 16)
        .attr("y", cy + 3.5)
        .attr("fill", "#727169")
        .attr("font-family", "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace")
        .attr("font-size", "9px")
        .text(item.label);
    });

    // ── D3 axis text styling ──
    svg
      .selectAll(".tick text")
      .attr("fill", "#727169")
      .attr("font-family", "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace")
      .attr("font-size", "10px");
    svg.selectAll(".tick line").attr("stroke", "#2d4f67").attr("stroke-opacity", 0.5);
    svg.selectAll(".domain").attr("stroke", "#2d4f67").attr("stroke-opacity", 0.7);
  }, [visibleBands, nuclearityStep]);

  // ═════════════════════════════════════════════════════════
  //  ResizeObserver — updates SVG container height for aspect
  // ═════════════════════════════════════════════════════════
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        // Maintain ~8:5 aspect ratio
        const h = Math.max(380, w * (VIEWBOX_H / VIEWBOX_W));
        el.style.minHeight = `${h}px`;
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // ═════════════════════════════════════════════════════════
  //  Render
  // ═════════════════════════════════════════════════════════
  return (
    <div className="samm-container bg-kanagawa-bg text-kanagawa-text p-4 sm:p-6 rounded-xl border border-kanagawa-wave my-6 w-full max-w-none">
      {/* Header */}
      <h3 className="text-lg font-semibold text-kanagawa-gold mb-1">
        2D Drift Time Matrix Spectrometry — Polyoxomolybdate Speciation
      </h3>
      <p className="text-xs font-mono text-kanagawa-muted mb-4">
        Travelling Wave Ion Mobility Spectrometry (TWIMS) | m/z vs Drift Time (t<sub>D</sub>)
      </p>

      {/* ── Controls ── */}
      <div className="samm-controls flex flex-wrap items-center gap-3 sm:gap-4 mb-4 text-xs font-mono">
        {/* Filter toggles */}
        {[
          { band: "monoanion", label: "Monoanions (−1)", colorClass: "text-kanagawa-gold" },
          { band: "dianion", label: "Dianions (−2)", colorClass: "text-kanagawa-accent" },
          { band: "solvate", label: "D₂O Solvates", colorClass: "text-teal-400" },
          { band: "artifact", label: "Borosilicate", colorClass: "text-red-400" },
        ].map(({ band, label, colorClass }) => (
          <label
            key={band}
            className="inline-flex items-center gap-1.5 cursor-pointer select-none"
            style={{ opacity: visibleBands[band] ? 1 : 0.45 }}
          >
            <input
              type="checkbox"
              checked={visibleBands[band]}
              onChange={() => toggleBand(band)}
              className="accent-current"
            />
            <span className={colorClass}>{label}</span>
          </label>
        ))}

        {/* Stepper slider */}
        <div className="samm-stepper ml-auto flex items-center gap-2">
          <label htmlFor="samm-nuclearity" className="text-kanagawa-muted whitespace-nowrap">
            Nucleation Step:
          </label>
          <input
            type="range"
            id="samm-nuclearity"
            min="1"
            max="12"
            value={nuclearityStep}
            onChange={(e) => {
              setNuclearityStep(Number(e.target.value));
              setSelectedNode(null);
            }}
            className="w-24 sm:w-32 accent-kanagawa-gold"
          />
          <span className="text-kanagawa-gold tabular-nums w-10 text-right">
            {formatNuclearity(nuclearityStep)}
          </span>
        </div>
      </div>

      {/* ── Chart ── */}
      <div
        ref={containerRef}
        className="samm-chart bg-kanagawa-sidebar rounded-lg border border-kanagawa-wave overflow-hidden w-full"
        style={{ minHeight: "420px" }}
      >
        <svg ref={svgRef} style={{ display: "block", width: "100%", height: "100%" }} />
      </div>

      {/* ── Inspection Card ── */}
      <InspectionCard node={selectedNode} onClose={() => setSelectedNode(null)} />
    </div>
  );
}

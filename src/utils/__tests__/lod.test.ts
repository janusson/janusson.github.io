import { describe, expect, it } from "vitest";
import { computeLodMetrics } from "../lod";

describe("computeLodMetrics", () => {
  it("computes ICH 3.3σ/m LOD and 10σ/m LOQ for default slider values", () => {
    const res = computeLodMetrics(20, 6, false);

    expect(res.effectiveSigma).toBe(20);
    expect(res.lod).toBeCloseTo(11.0, 6);
    expect(res.loq).toBeCloseTo(33.333333, 5);
  });

  it("halves effective noise under n=4 signal averaging (1/√4)", () => {
    const res = computeLodMetrics(20, 6, true);

    expect(res.effectiveSigma).toBe(10);
    expect(res.lod).toBeCloseTo(5.5, 6);
    expect(res.loq).toBeCloseTo(16.666667, 5);
  });
});

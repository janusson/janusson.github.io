export interface LodMetrics {
  effectiveSigma: number;
  lod: number;
  loq: number;
}

/**
 * Compute ICH Q2(R2)-style blank-based LOD (3.3σ/m) and LOQ (10σ/m).
 * When 4-scan signal averaging is enabled, random noise scales by 1/√4 = 0.5.
 */
export function computeLodMetrics(
  baseSigma: number,
  slope: number,
  signalAveraging: boolean,
): LodMetrics {
  const effectiveSigma = signalAveraging ? baseSigma / 2 : baseSigma;
  return {
    effectiveSigma,
    lod: (3.3 * effectiveSigma) / slope,
    loq: (10 * effectiveSigma) / slope,
  };
}

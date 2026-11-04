import { describe, expect, it } from "vitest";
import { projects } from "./projects";

/**
 * MassFlow's own `docs/CAPABILITY_MATRIX.md` lists GraphML molecular networking
 * and the `massflow visualize` command as documented-but-missing (decision C-5:
 * "Do not claim it; implement or de-document"). Portfolio copy must not
 * reintroduce a capability the toolkit does not ship.
 *
 * The "Spectral Similarity & Networking" domain entry on the About page is
 * deliberately out of scope: it describes the author's expertise, not MassFlow.
 */
describe("MassFlow capability claims", () => {
  it("does not advertise molecular networking or visualization", () => {
    const massflow = projects.find((project) => project.slug === "massflow");
    expect(massflow).toBeDefined();

    const copy = [
      massflow!.tagline,
      massflow!.description,
      massflow!.problem,
      massflow!.approach,
      ...massflow!.tech,
      ...massflow!.meta.map((meta) => meta.value),
    ].join(" ");

    expect(copy).not.toMatch(/molecul(?:ar|e)\s+network|networking|visuali[sz]/i);
  });
});

import { describe, expect, it } from "vitest";
import { findGlasgowDateConflicts, GLASGOW_POSTDOC } from "../CareerTimeline";

// findGlasgowDateConflicts is the pure scan behind the component's
// console audit (auditGlasgowPostdocDates reads document.body.innerText,
// which is guarded for the node test environment). Testing the pure
// function keeps the date-conflict logic pinned down without a DOM.
describe("CareerTimeline Glasgow postdoc date audit", () => {
  it("treats the canonical 2017–2020 range as consistent", () => {
    const conflicts = findGlasgowDateConflicts(
      "Postdoctoral Research Associate | University of Glasgow (2017–2020).",
    );
    expect(conflicts).toEqual([]);
  });

  it("flags a trailing-year conflict like 2020 vs 2021", () => {
    const conflicts = findGlasgowDateConflicts(
      "Postdoctoral Research Associate | University of Glasgow (2017 – 2021).",
    );
    expect(conflicts).toHaveLength(1);
    expect(conflicts[0].claim).toBe("2017 – 2021");
  });

  it("flags hyphen- and en-dash variants without spaces", () => {
    const conflicts = findGlasgowDateConflicts(
      "Glasgow (2017-2019) and Glasgow (2017–2021), both wrong.",
    );
    expect(conflicts.map((c) => c.claim)).toEqual(["2017-2019", "2017–2021"]);
  });

  it("ignores ranges that do not start in the canonical start year", () => {
    const conflicts = findGlasgowDateConflicts(
      "PhD Researcher | University of Victoria (2012 – 2017). Delic Labs (2021–2022).",
    );
    expect(conflicts).toEqual([]);
  });

  it("returns a locatable context snippet around each conflicting claim", () => {
    const [conflict] = findGlasgowDateConflicts(
      "Postdoctoral Research Associate at the University of Glasgow (2017 – 2021), developing automated platforms.",
    );
    expect(conflict?.context).toContain("University of Glasgow");
    expect(conflict?.context).toContain("⟦2017 – 2021⟧");
    expect(conflict?.context).toContain("developing automated platforms");
  });

  it("honours the canonical end year passed as an argument", () => {
    const conflicts = findGlasgowDateConflicts("Glasgow (2017–2021).", {
      start: 2017,
      end: 2021,
    });
    expect(conflicts).toEqual([]);
  });

  it("exposes the canonical Glasgow postdoc range used by the timeline", () => {
    expect(GLASGOW_POSTDOC).toEqual({ start: 2017, end: 2020 });
  });
});

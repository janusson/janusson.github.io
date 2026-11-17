import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";
import Icon from "../Icon.astro";
import { icons, type IconName } from "../../data/icons";

describe("Icon component", () => {
  it("renders decorative SVGs for every registered icon with aria-hidden and valid viewBox", async () => {
    const container = await AstroContainer.create();

    for (const name of Object.keys(icons) as IconName[]) {
      const html = await container.renderToString(Icon, { props: { name, class: "test-icon" } });
      const svg = new JSDOM(html).window.document.querySelector("svg");

      expect(svg, name).not.toBeNull();
      expect(svg?.getAttribute("aria-hidden"), name).toBe("true");
      expect(svg?.getAttribute("focusable"), name).toBe("false");
      expect(svg?.getAttribute("viewBox"), name).toBe(icons[name].viewBox ?? "0 0 24 24");
      expect(svg?.querySelector("path")?.getAttribute("d"), name).toBe(icons[name].path);
    }
  });
});

/// <reference types="vitest/config" />
import { getViteConfig } from "astro/config";

// getViteConfig() returns a Vite config pre-wired with Astro's plugin, so
// `.astro` component imports compile to server-renderable factories.
//
// Tests run in the default `node` environment: the jsdom environment would
// apply web transforms that compile `.astro` files for the client, which the
// AstroContainer cannot render. Components are instead rendered to HTML via
// `AstroContainer` and parsed with the `jsdom` package inside the tests.
export default getViteConfig({
  test: {
    include: ["src/**/*.test.ts", "src/**/*.spec.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "text-summary", "lcov"],
      include: ["src/**/*.ts"],
      exclude: ["src/env.d.ts", "src/content.config.ts", "**/*.test.ts", "**/*.spec.ts"],
    },
  },
});

import type { IconifyIcon } from "@iconify/react";

// oxlint-disable one-var
declare global {
  /**
   * Build year, injected by Vite through `define.__BUILD_YEAR__`.
   *
   * The footer uses it for the `$year` fallback so the prerendered HTML and the first client render
   * agree; after mounting, the footer updates to the visitor's current year.
   */
  const __BUILD_YEAR__: number;

  /** Used Iconify icon data map, injected by Vite through `define.__ICON_DATA__`. */
  const __ICON_DATA__: Record<string, IconifyIcon | undefined>;
}

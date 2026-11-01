/**
 * Build year, injected by Vite through `define.__BUILD_YEAR__`.
 *
 * The footer uses it for the `$year` fallback so the prerendered HTML and the first client render
 * agree; after mounting, the footer updates to the visitor's current year.
 */
declare const __BUILD_YEAR__: number;

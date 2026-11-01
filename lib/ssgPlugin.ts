import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

import type { Plugin, ResolvedConfig } from "vite";
import { build } from "vite";

import type { Config } from "../src/types/index.js";
import { escapeHtml } from "./escapeHtml.js";

/**
 * Normalized public site URL (`""` when the user did not configure `siteUrl`).
 *
 * 规范化后的站点公开 URL（未配置 `siteUrl` 时为空字符串）。
 *
 * @param config - Resolved config
 * @returns Site URL without a trailing slash
 */
const getSiteUrl = (config: Config): string => config.siteUrl?.replace(/\/+$/u, "") ?? "";

/**
 * Absolute URL for a locale page.
 *
 * 语言页面的绝对 URL。
 *
 * @param siteUrl - Normalized site URL
 * @param localePath - Locale path prefix (e.g. `"/zh/"`)
 * @returns Absolute URL
 */
const getPageUrl = (siteUrl: string, localePath: string): string => `${siteUrl}${localePath}`;

/**
 * Resolve a public-directory path against the deployment base ("/favicon.svg" ->
 * "/repo/favicon.svg").
 *
 * 将 public 目录路径解析到部署 base 下。
 *
 * @param base - Vite base path
 * @param value - Config-provided path or absolute URL
 * @returns Absolute URL or base-prefixed path
 */
const getPublicUrl = (base: string, value: string): string =>
  /^(?:https?:)?\/\//u.test(value) ? value : `${base}${value.replace(/^\/+/u, "")}`;

/**
 * Build the `<link rel="icon">` tag. Defaults to `/favicon.svg`, overridable with `config.favicon`.
 *
 * 生成 `<link rel="icon">` 标签，默认 `/favicon.svg`，可用 `config.favicon` 覆盖。
 *
 * @param base - Vite base path
 * @param config - Resolved user config
 * @param outDir - Build output directory
 * @returns HTML tag, or `""` when disabled or the default file is missing
 */
const getFaviconTag = (base: string, config: Config, outDir: string): string => {
  const favicon = config.favicon ?? "/favicon.svg";

  if (!favicon) return "";

  // Existing forks that sync the template may not have `public/favicon.svg` (their `public/` folder
  // is preserved). Only reference the default when the file was actually copied to the output.
  const defaultFaviconMissing =
    config.favicon == null && !existsSync(path.join(outDir, favicon.replace(/^\/+/u, "")));

  if (defaultFaviconMissing) return "";

  const type = favicon.endsWith(".svg")
    ? ' type="image/svg+xml"'
    : favicon.endsWith(".png")
      ? ' type="image/png"'
      : favicon.endsWith(".ico")
        ? ' type="image/x-icon"'
        : "";

  return `<link rel="icon" href="${escapeHtml(getPublicUrl(base, favicon))}"${type} />`;
};

/**
 * Resolve the configured avatar/background image to an absolute URL for Open Graph.
 *
 * 将配置中的头像/背景图解析为 Open Graph 使用的绝对 URL。
 *
 * @param config - Resolved config
 * @param siteUrl - Normalized site URL
 * @returns Absolute image URL, or `""` when unavailable
 */
const getOgImage = (config: Config, siteUrl: string): string => {
  if (config.ogImage) {
    if (/^(?:https?:)?\/\//u.test(config.ogImage)) return config.ogImage;

    return siteUrl
      ? `${siteUrl}${config.ogImage.startsWith("/") ? config.ogImage : `/${config.ogImage}`}`
      : "";
  }

  const [firstLocale] = Object.values(config.locales);

  if (firstLocale == null) return "";

  const { avatar, bgImage } = firstLocale.hero;
  const source =
    typeof avatar === "string"
      ? avatar
      : (avatar?.light ?? (typeof bgImage === "string" ? bgImage : bgImage?.light));

  if (source == null || source === "") return "";
  if (/^https?:\/\//u.test(source) || source.startsWith("//")) return source;

  return `${siteUrl}${source.startsWith("/") ? source : `/${source}`}`;
};

/**
 * Build per-page SEO tags (canonical, hreflang, Open Graph, Twitter).
 *
 * 生成单页 SEO 标签（canonical、hreflang、Open Graph、Twitter）。
 *
 * @param localePath - Locale path prefix
 * @param config - Resolved config
 * @param siteUrl - Normalized site URL
 * @param ogImage - Absolute Open Graph image URL
 * @returns HTML tags, or `""` when `siteUrl` is not configured
 */
const getSeoTags = (
  localePath: string,
  config: Config,
  siteUrl: string,
  ogImage: string,
): string => {
  if (!siteUrl) return "";

  const locale = config.locales[localePath];
  const title = locale.title ?? "Portfolio";
  const description = locale.description ?? "Portfolio Template";
  const pageUrl = getPageUrl(siteUrl, localePath);
  const [defaultPath = "/"] = Object.keys(config.locales);
  const alternates = Object.entries(config.locales).map(
    ([pathPrefix, localeConfig]) =>
      `<link rel="alternate" hreflang="${escapeHtml(localeConfig.lang)}" href="${escapeHtml(
        getPageUrl(siteUrl, pathPrefix),
      )}" />`,
  );

  alternates.push(
    `<link rel="alternate" hreflang="x-default" href="${escapeHtml(
      getPageUrl(siteUrl, defaultPath),
    )}" />`,
  );

  return [
    `<link rel="canonical" href="${escapeHtml(pageUrl)}" />`,
    ...alternates,
    '<meta property="og:type" content="website" />',
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    `<meta property="og:url" content="${escapeHtml(pageUrl)}" />`,
    `<meta property="og:locale" content="${escapeHtml(locale.lang.replace("-", "_"))}" />`,
    ...(ogImage
      ? [
          `<meta property="og:image" content="${escapeHtml(ogImage)}" />`,
          `<meta name="twitter:image" content="${escapeHtml(ogImage)}" />`,
        ]
      : []),
    `<meta name="twitter:card" content="${ogImage ? "summary_large_image" : "summary"}" />`,
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
  ].join("\n    ");
};

/**
 * Write `sitemap.xml` and `robots.txt` for multi-locale sites.
 *
 * 为多语言站点输出 `sitemap.xml` 与 `robots.txt`。
 *
 * @param outDir - Build output directory
 * @param config - Resolved config
 * @param siteUrl - Normalized site URL
 * @param routes - Prerendered locale paths
 */
const writeSitemapAndRobots = (
  outDir: string,
  config: Config,
  siteUrl: string,
  routes: string[],
): void => {
  if (!siteUrl) return;

  const lastMod = new Date().toISOString().slice(0, 10);
  const entries = routes
    .map((localePath) => {
      const alternates = routes
        .map(
          (otherPath) =>
            `<xhtml:link rel="alternate" hreflang="${escapeHtml(
              config.locales[otherPath].lang,
            )}" href="${escapeHtml(getPageUrl(siteUrl, otherPath))}" />`,
        )
        .join("");

      return `  <url><loc>${escapeHtml(
        getPageUrl(siteUrl, localePath),
      )}</loc><lastmod>${lastMod}</lastmod>${alternates}</url>`;
    })
    .join("\n");

  writeFileSync(
    path.join(outDir, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries}\n</urlset>\n`,
  );
  writeFileSync(
    path.join(outDir, "robots.txt"),
    `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
  );
};

/**
 * Validate locale keys and resolve their output path under `outDir`.
 *
 * 校验 locale 键并解析出 `outDir` 下的输出路径。
 *
 * @param outDir - Build output directory
 * @param localePath - Locale path prefix
 * @returns Absolute output file path
 */
const getLocaleOutputPath = (outDir: string, localePath: string): string => {
  if (localePath !== "/" && !/^\/(?:[^/]+\/)*$/u.test(localePath)) {
    throw new Error(
      `Invalid locale key "${localePath}". Locale keys must be path prefixes such as "/" or "/zh/".`,
    );
  }

  const filePath =
    localePath === "/"
      ? path.join(outDir, "index.html")
      : path.join(
          outDir,
          localePath.endsWith("/") ? `${localePath}index.html` : `${localePath}/index.html`,
        );
  const relative = path.relative(outDir, filePath);

  if (relative.startsWith("..") || path.isAbsolute(relative))
    throw new Error(`Locale key "${localePath}" resolves outside the build output directory.`);

  return filePath;
};

/**
 * Generate a base-aware `404.html` (GitHub Pages and Netlify serve it for unknown paths).
 *
 * 生成 base-aware 的 `404.html`（GitHub Pages 与 Netlify 会自动用于未知路径）。
 *
 * @param outDir - Build output directory
 * @param base - Vite base path
 * @param config - Resolved user config
 * @param faviconTag - Favicon `<link>` tag (may be empty)
 */
const writeNotFoundPage = (
  outDir: string,
  base: string,
  config: Config,
  faviconTag: string,
): void => {
  const [defaultPath = "/"] = Object.keys(config.locales);
  const locale = config.locales[defaultPath];

  writeFileSync(
    path.join(outDir, "404.html"),
    `<!doctype html>
<html lang="${escapeHtml(locale.lang)}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="noindex" />
    <title>404 | ${escapeHtml(locale.title ?? "Portfolio")}</title>
    ${faviconTag}
    <style>
      :root { color-scheme: light dark; }
      body { min-height: 100vh; margin: 0; display: grid; place-items: center; font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; background: #f8fafc; color: #0f172a; }
      main { padding: 2rem; text-align: center; }
      h1 { margin: 0; font-size: clamp(3rem, 12vw, 6rem); letter-spacing: -0.04em; }
      p { margin: 1rem 0 0; color: #475569; }
      a { display: inline-block; margin-top: 1.5rem; color: #2563eb; font-weight: 600; text-decoration: none; }
      a:hover { text-decoration: underline; }
      @media (prefers-color-scheme: dark) { body { background: #020617; color: #e2e8f0; } p { color: #94a3b8; } a { color: #60a5fa; } }
    </style>
  </head>
  <body>
    <main>
      <h1>404</h1>
      <p>This page could not be found.</p>
      <a href="${escapeHtml(base)}">Go home</a>
    </main>
  </body>
</html>
`,
  );
};

/**
 * Prerender the app for every locale and post-process the HTML head.
 *
 * 为每个 locale 预渲染应用，并处理 HTML head 中的 SEO 信息。
 *
 * @param viteConfig - Resolved Vite config
 * @param config - Resolved user config
 */
const prerender = async (viteConfig: ResolvedConfig, config: Config): Promise<void> => {
  const { outDir } = viteConfig.build;
  const serverOutDir = path.join(outDir, "server");
  const routes = Object.keys(config.locales);
  const siteUrl = getSiteUrl(config);
  const ogImage = siteUrl ? getOgImage(config, siteUrl) : "";
  const faviconTag = getFaviconTag(viteConfig.base, config, outDir);

  const serverEntryPath = path.resolve(serverOutDir, "entry-server.js");
  const { render } = (await import(serverEntryPath)) as {
    render: (url: string, config: Config) => string;
  };

  const template = readFileSync(path.resolve(outDir, "index.html"), "utf-8");
  const outputPaths = new Set<string>();

  for (const localePath of routes) {
    const outputPath = getLocaleOutputPath(outDir, localePath);

    if (outputPaths.has(outputPath)) {
      throw new Error(
        `Locale key "${localePath}" maps to an already generated page (${outputPath}).`,
      );
    }

    outputPaths.add(outputPath);

    const locale = config.locales[localePath];
    const appHtml = render(localePath, config);

    // Use a function replacer: `appHtml` may contain `$&`/`$'`/`$\`` sequences (ordinary
    // Markdown code can), which would otherwise be interpreted as replacement patterns.
    let html = template.replace("<!--app-html-->", () => appHtml);
    const metaDescription = `<meta name="description" content="${escapeHtml(
      locale.description ?? "Portfolio Template",
    )}" />`;

    html = html
      // Drop the default-locale description injected by the Vite plugin: every page must
      // contain exactly one `<meta name="description">`, localized for its own route.
      .replace(/<meta name="description"[^>]*\/>\s*/u, "")
      .replace(
        /<title>(?:.*?)<\/title>/u,
        () => `<title>${escapeHtml(locale.title ?? "Portfolio")}</title>\n    ${metaDescription}`,
      )
      .replace(/<html lang="(?:.*?)">/u, () => `<html lang="${escapeHtml(locale.lang)}">`);

    const headTags = [faviconTag, getSeoTags(localePath, config, siteUrl, ogImage)]
      .filter((tag) => tag.length > 0)
      .join("\n    ");

    if (headTags) html = html.replace("</head>", () => `    ${headTags}\n  </head>`);

    mkdirSync(path.dirname(outputPath), { recursive: true });
    writeFileSync(outputPath, html);
    console.log(`  ${localePath} -> ${outputPath}`);
  }

  writeSitemapAndRobots(outDir, config, siteUrl, routes);
  writeNotFoundPage(outDir, viteConfig.base, config, faviconTag);

  console.log("Cleaning up server build...");
  rmSync(serverOutDir, { recursive: true, force: true });
};

/**
 * Build the SSR bundle and prerender every route after a successful client build.
 *
 * 在客户端构建成功后构建 SSR bundle 并预渲染所有路由。
 *
 * @param viteConfig - Resolved Vite config
 * @param config - Resolved user config
 * @param serializedConfig - Config serialized for the client/SSR bundles
 * @param buildYear - Build year injected as `__BUILD_YEAR__`
 */
const handleCloseBundle = async (
  viteConfig: ResolvedConfig,
  config: Config,
  serializedConfig: string,
  buildYear: string,
): Promise<void> => {
  if (viteConfig.build.ssr !== false) return;

  const { outDir } = viteConfig.build;
  const serverOutDir = path.join(outDir, "server");

  console.log("Building server entry...");

  await build({
    root: viteConfig.root,
    configFile: viteConfig.configFile,
    // Inherit the *resolved* base and mode: the CLI may override them (e.g. `--base`), and the
    // nested build re-evaluates `vite.config.ts`, which would otherwise fall back to the config
    // file value. A mismatch here means the prerendered HTML and the client bundle disagree.
    base: viteConfig.base,
    mode: viteConfig.mode,
    // Keep the SSR bundle in sync with the config serialized into the client bundle. The nested
    // build re-evaluates `vite.config.ts`, so without this the two bundles could disagree when the
    // config file has side effects (or simply has changed between the two evaluations).
    define: {
      __CONFIG__: serializedConfig,
      __BUILD_YEAR__: buildYear,
    },
    build: {
      ssr: "entry-server.tsx",
      outDir: serverOutDir,
      emptyOutDir: true,
      rolldownOptions: {
        onLog(level, log, defaultHandler) {
          if (log.code === "MODULE_LEVEL_DIRECTIVE") return;
          defaultHandler(level, log);
        },
      },
    },
  });

  console.log("Prerendering...");

  await prerender(viteConfig, config);
  console.log("SSG complete.");
};

export const ssgPlugin = (config: Config, serializedConfig: string, buildYear: string): Plugin => {
  let viteConfig: ResolvedConfig;
  let clientBuildSucceeded = false;

  return {
    name: "vite-plugin-ssg",
    apply: "build",
    configResolved(resolvedConfig): void {
      viteConfig = resolvedConfig;
    },
    writeBundle(): void {
      if (viteConfig.build.ssr === false) clientBuildSucceeded = true;
    },
    async closeBundle(): Promise<void> {
      // `closeBundle` also fires after a failed build; prerendering then would replace the
      // original build error with an unrelated ENOENT on dist/index.html.
      if (!clientBuildSucceeded || viteConfig.build.ssr !== false) return;

      await handleCloseBundle(viteConfig, config, serializedConfig, buildYear);
    },
  };
};

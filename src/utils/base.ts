/**
 * Deployment base path, derived from Vite's `base` (the top-level `base` config option).
 *
 * `basePath` is `""` for root deployments and `"/<repository>"` for sub-path deployments (e.g.
 * GitHub Pages project sites). The helpers below keep in-app URLs and public assets consistent with
 * it.
 *
 * 由配置中的 `base` 经 Vite 注入的部署基础路径。
 *
 * 根路径部署时 `basePath` 为空字符串，子路径部署时形如 `"/<repository>"`。
 *
 * 下列工具函数保证站内链接与 public 资源路径一致。
 */
const rawBase = import.meta.env.BASE_URL || "/";
const normalizedBase = rawBase.endsWith("/") ? rawBase.slice(0, -1) : rawBase;

export const basePath = normalizedBase === "/" ? "" : normalizedBase;

/**
 * Prefix an absolute in-app path with the deployment base path.
 *
 * 为站内绝对路径加上部署基础路径。
 *
 * @param path - Absolute in-app path (e.g. `"/zh/"`)
 * @returns Path prefixed with the base path (unchanged for root deployments)
 */
export const withBase = (path: string): string =>
  basePath && path.startsWith("/") ? `${basePath}${path}` : path;

/**
 * Resolve a config-provided public asset URL against the deployment base path.
 *
 * Absolute URLs (`https://…`), protocol-relative URLs (`//…`) and relative paths are kept as-is.
 *
 * 解析配置中的 public 资源 URL：绝对 URL、协议相对 URL 与相对路径保持原样，其余加上基础路径。
 *
 * @param url - Asset URL from the config (e.g. `"/avatar.avif"`)
 * @returns Resolved URL
 */
export const resolveAssetUrl = (url: string): string =>
  url.startsWith("/") && !url.startsWith("//") ? withBase(url) : url;

/**
 * Remove the deployment base path from a pathname before locale matching.
 *
 * 从路径中移除部署基础路径，便于语言路由匹配。
 *
 * @param path - `window.location.pathname`
 * @returns Pathname without the base path
 */
export const stripBase = (path: string): string => {
  if (!basePath) return path;
  if (path === basePath) return "/";
  if (path.startsWith(`${basePath}/`)) return path.slice(basePath.length);

  return path;
};

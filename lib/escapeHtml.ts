const HTML_ESCAPE_MAP = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
} as const;

/**
 * Escape a text value for safe interpolation into HTML markup.
 *
 * Use this for any config-provided string (title, description, language code, …) that is
 * concatenated into an HTML string at build time. Never rely on `String.replace` alone: both the
 * value and the replacement pattern have to be handled explicitly.
 *
 * 将文本转义为可安全插入 HTML 的内容（用于 title、description、lang 等构建期拼接的配置字符串）。
 *
 * @param value - Raw text value
 * @returns HTML-escaped text
 */
export const escapeHtml = (value: string): string =>
  value.replaceAll(
    /[&<>"']/gu,
    (char) => HTML_ESCAPE_MAP[char as keyof typeof HTML_ESCAPE_MAP] ?? char,
  );

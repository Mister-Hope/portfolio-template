/**
 * Check if the locale is a CJK locale (Chinese, Japanese, Korean)
 * 检查语言环境是否为 CJK 语言环境 (中文、日文、韩文)
 *
 * @param locale - The locale string to check
 * @returns True if the locale is CJK, false otherwise
 */
export const isCJKLocale = (locale?: string): boolean => {
  if (!locale) return false;

  return ["zh", "ja", "ko"].includes(locale);
};

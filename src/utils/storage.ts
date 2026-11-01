/**
 * Safe `localStorage` helpers.
 *
 * Browsers can throw on storage access (private mode, blocked cookies, enterprise policies,
 * third-party iframes). Every read/write in the app must go through these helpers so a storage
 * failure never breaks rendering or event handling.
 *
 * 安全的 `localStorage` 读写封装。某些浏览器环境（隐私模式、禁用 Cookie、企业策略、第三方 iframe）
 * 访问存储会抛错；应用内的读写统一走这里，避免存储异常导致渲染/交互崩溃。
 */

/**
 * Read a string from `localStorage`.
 *
 * 从 `localStorage` 读取字符串。
 *
 * @param key - Storage key
 * @returns Stored value, or `null` when missing/unavailable
 */
export const getStorage = (key: string): string | null => {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

/**
 * Write a string to `localStorage`, ignoring unavailable storage.
 *
 * 写入 `localStorage`，存储不可用时静默忽略。
 *
 * @param key - Storage key
 * @param value - Value to store
 */
export const setStorage = (key: string, value: string): void => {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Storage is unavailable (private mode / blocked cookies / enterprise policy): ignore.
  }
};

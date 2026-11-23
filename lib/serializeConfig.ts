const IDENTIFIER_PATTERN = /^[$_\p{ID_Start}][$\u200C\u200D\p{ID_Continue}]*$/u;

/**
 * Append a property key or array index to a readable config path.
 *
 * 将属性键或数组下标追加到可读的配置路径上。
 *
 * @param parentPath - Path to the parent value
 * @param key - Property key or array index
 * @returns Readable path string
 */
const appendPath = (parentPath: string, key: number | string): string => {
  if (typeof key === "number") return `${parentPath}[${key}]`;

  return IDENTIFIER_PATTERN.test(key)
    ? `${parentPath}.${key}`
    : `${parentPath}[${JSON.stringify(key)}]`;
};

/**
 * Walk a configuration value and verify it can be serialized with `JSON.stringify`, throwing an
 * error with the exact property path on circular references or `BigInt` values.
 *
 * 递归检查配置值是否可被 `JSON.stringify` 序列化；遇到循环引用或 `BigInt` 时抛出带完整属性路径的错误。
 *
 * @param value - Current value being inspected
 * @param path - Readable path to `value`
 * @param ancestors - Active ancestor objects on the current traversal stack
 */
const assertSerializable = (value: unknown, path: string, ancestors: Set<object>): void => {
  if (typeof value === "bigint")
    throw new TypeError(`Cannot serialize BigInt value at ${path} (${String(value)}n).`);

  if (value == null || typeof value !== "object") return;

  if (ancestors.has(value)) throw new TypeError(`Circular reference detected at ${path}.`);

  ancestors.add(value);

  try {
    if (Array.isArray(value)) {
      for (const [index, item] of value.entries())
        assertSerializable(item, appendPath(path, index), ancestors);

      return;
    }

    for (const [key, entryValue] of Object.entries(value))
      assertSerializable(entryValue, appendPath(path, key), ancestors);
  } finally {
    ancestors.delete(value);
  }
};

/**
 * Serialize the resolved configuration into a JSON string for the client and SSR bundles.
 *
 * Pre-walks the value so circular references and `BigInt` values report the exact config path (e.g.
 * `config.locales["/"].sections[2].data.content`) instead of a bare `JSON.stringify` error.
 * Functions, `undefined`, and symbols are intentionally allowed and omitted by `JSON.stringify`.
 *
 * 将解析后的配置序列化为供客户端与 SSR bundle 使用的 JSON 字符串；遇到循环引用或 `BigInt` 时在错误中附带精确的字段路径。
 *
 * @param config - Resolved configuration object
 * @param rootName - Root path label used in error messages
 * @returns JSON string representation of the config
 */
export const serializeConfig = (config: unknown, rootName = "config"): string => {
  assertSerializable(config, rootName, new Set());

  const serialized = JSON.stringify(config);

  if (serialized == null)
    throw new TypeError(`Configuration at ${rootName} could not be serialized to JSON.`);

  return serialized;
};

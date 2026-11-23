import { describe, expect, it } from "vitest";

import { serializeConfig } from "../lib/serializeConfig.js";

describe(serializeConfig, () => {
  it("reports the exact path for a circular reference", () => {
    const sectionData: Record<string, unknown> = { content: "hello" };

    sectionData.self = sectionData;

    const config = {
      locales: {
        "/": {
          sections: [
            { type: "banner" },
            { type: "cards" },
            { type: "markdown", data: sectionData },
          ],
        },
      },
    };

    expect(() => serializeConfig(config)).toThrow(
      'Circular reference detected at config.locales["/"].sections[2].data.self.',
    );
  });

  it("reports the exact path for a BigInt value", () => {
    const config = {
      locales: {
        "/": {
          hero: {
            name: "Mister-Hope",
          },
          sections: [
            {
              type: "profile",
              data: {
                count: 42n,
              },
            },
          ],
        },
      },
    };

    expect(() => serializeConfig(config)).toThrow(
      'Cannot serialize BigInt value at config.locales["/"].sections[0].data.count (42n).',
    );
  });

  it("drops function, undefined, and symbol properties and succeeds", () => {
    const serialized = serializeConfig({
      config: {
        mdIt: () => {},
        optional: undefined,
        sym: Symbol("ignored"),
      },
      locales: {
        "/": {
          lang: "en-US",
          title: "Portfolio",
        },
      },
    });

    expect(JSON.parse(serialized)).toStrictEqual({
      config: {},
      locales: {
        "/": {
          lang: "en-US",
          title: "Portfolio",
        },
      },
    });
  });

  it("serializes a normal nested config and allows shared non-circular references", () => {
    const sharedTag = { label: "TypeScript" };
    const config = {
      base: "/",
      locales: {
        "/": {
          lang: "en-US",
          sections: [{ data: [sharedTag] }, { data: [sharedTag] }],
        },
      },
    };

    const serialized = serializeConfig(config);

    expect(JSON.parse(serialized)).toStrictEqual(config);
  });
});

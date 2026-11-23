import type { IconifyJSON } from "@iconify/react";
import { describe, expect, it } from "vitest";

import { resolveIconFromSet, resolveIconName } from "../lib/icons.js";

const iconSet: IconifyJSON = {
  prefix: "test",
  width: 32,
  height: 16,
  icons: {
    user: { body: "<path />", width: 24, height: 24 },
    plain: { body: "<circle />" },
  },
  aliases: {
    person: { parent: "user", hFlip: true },
  },
};

describe("icon data resolution", () => {
  it("normalizes short names like the Icon component", () => {
    expect(resolveIconName("book")).toBe("fa7-solid:book");
    expect(resolveIconName("fa-user")).toBe("fa7-solid:user");
    expect(resolveIconName("mdi:github")).toBe("mdi:github");
  });

  it("resolves icons and applies the set defaults", () => {
    expect(resolveIconFromSet(iconSet, "user")).toStrictEqual({
      body: "<path />",
      width: 24,
      height: 24,
    });
    expect(resolveIconFromSet(iconSet, "plain")).toStrictEqual({
      body: "<circle />",
      width: 32,
      height: 16,
    });
  });

  it("resolves aliases from their parent", () => {
    expect(resolveIconFromSet(iconSet, "person")).toStrictEqual({
      body: "<path />",
      width: 24,
      height: 24,
      hFlip: true,
    });
  });

  it("returns null for unknown icons", () => {
    expect(resolveIconFromSet(iconSet, "missing")).toBeNull();
  });
});

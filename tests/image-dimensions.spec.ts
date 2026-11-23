import path from "node:path";

import { describe, expect, it } from "vitest";

import { createImageDimensionsResolver } from "../lib/imageDimensions.js";

const root = path.resolve(import.meta.dirname, "..");
const resolveDimensions = createImageDimensionsResolver(root);

describe("local image dimensions", () => {
  it("reads dimensions from public files", () => {
    expect(resolveDimensions("/favicon.svg")).toStrictEqual({ width: 64, height: 64 });
  });

  it("ignores query strings and fragments", () => {
    expect(resolveDimensions("/favicon.svg?v=1#icon")).toStrictEqual({ width: 64, height: 64 });
  });

  it("ignores remote, protocol-relative and missing images", () => {
    expect(resolveDimensions("https://example.com/image.png")).toBeNull();
    expect(resolveDimensions("//example.com/image.png")).toBeNull();
    expect(resolveDimensions("/missing.png")).toBeNull();
  });

  it("rejects paths outside public", () => {
    expect(resolveDimensions("/../package.json")).toBeNull();
  });
});

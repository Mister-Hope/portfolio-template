import { useState, useEffect } from "react";

import type { FC } from "react";

/**
 * Props for the Typewriter component
 * Typewriter 组件的属性
 */
interface TypewriterProps {
  /**
   * Array of strings to type out sequentially
   * 按顺序打出的字符串数组
   */
  texts: string[];
  /**
   * Typing speed in milliseconds
   * 打字速度，单位毫秒
   *
   * @default 100
   */
  speed?: number;
  /**
   * Pause duration between texts in milliseconds
   * 文本之间的暂停时间，单位毫秒
   *
   * @default 2000
   */
  pause?: number;
}

/**
 * Typewriter component
 *
 * Simulates a typewriter effect by cycling through a list of strings.
 *
 * 打字机组件
 *
 * 通过循环显示字符串列表来模拟打字机效果。
 */
export const Typewriter: FC<TypewriterProps> = ({ texts, speed = 100, pause = 2000 }) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);

  useEffect(() => {
    if (subIndex === texts[index].length + 1 && !reverse) {
      setTimeout(() => setReverse(true), pause);

      return;
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % texts.length);

      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, speed);

    return (): void => {
      clearTimeout(timeout);
    };
  }, [subIndex, index, reverse, texts, speed, pause]);

  return <span className="typewriter-cursor">{texts[index].slice(0, subIndex)}</span>;
};

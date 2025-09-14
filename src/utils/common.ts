"use client";

import { useState, useEffect } from "react";

export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("resize", handleResize);
    handleResize(); // Set initial size

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}

export function remToPx(rem: string): number {
  const remValue = parseFloat(rem);
  if (isNaN(remValue)) {
    return 0;
  }
  const rootFontSize =
    typeof window !== "undefined"
      ? parseFloat(getComputedStyle(document.documentElement).fontSize)
      : 16; // fallback for SSR
  return remValue * rootFontSize;
}

export function useBreakpointVars() {
  const [breakpoints, setBreakpoints] = useState({
    lg: "",
    md: "",
    sm: "",
    xs: "",
  });

  useEffect(() => {
    const style = getComputedStyle(document.documentElement);
    setBreakpoints({
      lg: style.getPropertyValue("--breakpoint-lg").trim(),
      md: style.getPropertyValue("--breakpoint-md").trim(),
      sm: style.getPropertyValue("--breakpoint-sm").trim(),
      xs: style.getPropertyValue("--breakpoint-xs").trim(),
    });
  }, []);

  return {
    lg: remToPx(breakpoints.lg),
    md: remToPx(breakpoints.md),
    sm: remToPx(breakpoints.sm),
    xs: remToPx(breakpoints.xs),
  };
}

export const useIsBreaking = () => {
  const { width } = useWindowSize();
  const { xs, sm, md, lg } = useBreakpointVars();

  const isBreaking = {
    isBreakingSm: false,
    isBreakingMd: false,
    isBreakingLg: false,
    isBreakingXs: false,
  };

  if (width < xs) {
    isBreaking.isBreakingXs = true;
  } else if (width < sm) {
    isBreaking.isBreakingSm = true;
  } else if (width < md) {
    isBreaking.isBreakingMd = true;
  } else if (width < lg) {
    isBreaking.isBreakingLg = true;
  }

  return isBreaking;
};

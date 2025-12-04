"use client";

import { useEffect } from "react";

export function LegacyAuthCleaner() {
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        // 예전에 쓰던 값들 전부 제거
        window.localStorage.removeItem("currentUser");
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  return null;
}

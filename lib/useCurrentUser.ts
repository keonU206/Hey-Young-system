"use client";

import { useEffect, useState } from "react";

export type CurrentUser = {
  id: number;
  login_id: string;
  name: string;
  role: "ADMIN" | "INSTRUCTOR" | "STUDENT";
  email: string;
  department: string | null;
};

export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const raw = window.localStorage.getItem("currentUser");
    if (!raw) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      setUser(parsed);
    } catch (e) {
      console.error("Failed to parse currentUser from localStorage", e);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return { user, loading };
}

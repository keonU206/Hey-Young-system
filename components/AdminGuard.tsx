"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch("/api/me", {
          method: "GET",
          credentials: "include", // ✅ 쿠키 포함
        });

        if (!res.ok) {
          router.replace("/login");
          return;
        }

        const data = await res.json();
        if (!data.user || data.user.role !== "ADMIN") {
          router.replace("/login");
          return;
        }
      } catch (err) {
        console.error(err);
        router.replace("/login");
      } finally {
        setChecking(false);
      }
    };

    check();
  }, [router]);

  if (checking) return <p>접근 권한 확인 중...</p>;

  return <>{children}</>;
}

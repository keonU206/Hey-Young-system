"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/lib/useCurrentUser";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      // 로그인 안 되어 있으면 로그인으로
      router.replace("/login");
      return;
    }

    if (user.role !== "ADMIN") {
      // 관리자 아니면 메인이나 학생 대시보드 등으로 내쫓기
      router.replace("/");
    }
  }, [loading, user, router]);

  if (loading || !user || user.role !== "ADMIN") {
    return (
      <div className="page-container">
        <p>관리자 권한을 확인하는 중입니다...</p>
      </div>
    );
  }

  return <>{children}</>;
}

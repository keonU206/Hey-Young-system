"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminGuard } from "@/components/AdminGuard";
import { LogoutButton } from "@/components/LogoutButton";

type MeUser = {
  id: number;
  login_id: string;
  name: string;
  role: "ADMIN" | "INSTRUCTOR" | "STUDENT";
  email?: string | null;
  department?: string | null;
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<MeUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch("/api/me", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          setUser(null);
          router.replace("/login");
          return;
        }

        const data = await res.json();
        if (!data.user) {
          setUser(null);
          router.replace("/login");
          return;
        }

        const me = data.user as MeUser;

        // 🔒 관리자만 접근
        if (me.role !== "ADMIN") {
          setUser(null);
          router.replace("/login");
          return;
        }

        setUser(me);
      } catch (err) {
        console.error("Failed to load /api/me (admin):", err);
        setUser(null);
        router.replace("/login");
      } finally {
        setLoadingUser(false);
      }
    };

    loadUser();
  }, [router]);

  if (loadingUser) {
    return (
      <AdminGuard>
        <div className="page-container">
          <p>관리자 정보를 불러오는 중입니다...</p>
        </div>
      </AdminGuard>
    );
  }

  if (!user) {
    return (
      <AdminGuard>
        <div className="page-container">
          <p>로그인이 필요합니다.</p>
          <a href="/login" className="link">
            로그인 페이지로 이동
          </a>
        </div>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <div className="page-container">
        <header className="page-header">
          <div>
            <h1 className="page-title">관리자 대시보드</h1>
            <p className="page-subtitle">
              {user.name} ({user.login_id}) 님, SmartAttend 시스템 관리
              페이지입니다.
            </p>
          </div>
          <LogoutButton />
        </header>

        {/* 요약 카드 영역 */}
        <div className="grid-2">
          <section className="card">
            <h2 className="card-title">요약 지표</h2>
            <div className="stats-row">
              <div className="stat">
                <span className="stat-label">등록 사용자</span>
                <span className="stat-value">128</span>
              </div>
              <div className="stat">
                <span className="stat-label">개설 과목</span>
                <span className="stat-value">24</span>
              </div>
              <div className="stat">
                <span className="stat-label">금일 강의</span>
                <span className="stat-value">18</span>
              </div>
            </div>
          </section>

          <section className="card">
            <h2 className="card-title">주의 알림</h2>
            <ul className="simple-list">
              <li>출석 변경이 5회 이상 발생한 과목 2개</li>
              <li>지난 7일간 로그인 실패 시도가 12회 발생</li>
              <li>출석률 70% 미만 과목 3개</li>
            </ul>
          </section>
        </div>

        {/* 최근 활동 로그 요약 (상세는 /admin/logs 에서 보기) */}
        <section className="card mt-24">
          <h2 className="card-title">최근 활동 로그 (요약)</h2>
          <p className="card-desc">
            자세한 감사 로그는 상단 메뉴의 로그 페이지에서 확인할 수 있습니다.
          </p>
          <table className="simple-table">
            <thead>
              <tr>
                <th>시간</th>
                <th>사용자</th>
                <th>행위</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>09:20</td>
                <td>{user.login_id}</td>
                <td>관리자 로그인 성공</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </AdminGuard>
  );
}

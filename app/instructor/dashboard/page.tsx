"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type MeUser = {
  id: number;
  login_id: string;
  name: string;
  role: "ADMIN" | "INSTRUCTOR" | "STUDENT";
  email: string | null;
  department: string | null;
};

export default function StudentDashboardPage() {
  const router = useRouter();

  // 🔹 현재 로그인 유저 상태
  const [user, setUser] = useState<MeUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch("/api/me", {
          method: "GET",
          credentials: "include", // ✅ JWT 쿠키(auth_token) 포함
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

        // 🔒 교원이 아닌 경우 접근 차단
        if (me.role !== "INSTRUCTOR") {
          setUser(null);
          router.replace("/login");
          return;
        }

        setUser(me);
      } catch (err) {
        console.error("Failed to load /api/me:", err);
        setUser(null);
        router.replace("/login");
      } finally {
        setLoadingUser(false);
      }
    };

    loadUser();
  }, [router]);

  // 로딩 중
  if (loadingUser) {
    return (
      <div className="page-container">
        <p>로그인 정보를 불러오는 중입니다...</p>
      </div>
    );
  }

  // 비로그인 / 권한 없음
  if (!user) {
    return (
      <div className="page-container">
        <p>로그인이 필요합니다.</p>
        <a href="/login" className="link">
          로그인 페이지로 이동
        </a>
      </div>
    );
  }

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <h1 className="page-title">교원 대시보드</h1>
          <p className="page-subtitle">
            {user.name} ({user.login_id}) 님, 환영합니다 👋
          </p>
        </div>
      </header>

      <section className="card">
        <h2 className="card-title">내 정보</h2>
        <ul className="info-list">
          <li>이름: {user.name}</li>
          <li>학번: {user.login_id}</li>
          <li>이메일: {user.email || "미입력"}</li>
          <li>학과: {user.department || "미입력"}</li>
        </ul>
      </section>

      {/* TODO: 나중에 수강 과목 / 출석 요약 추가 */}
    </div>
  );
}

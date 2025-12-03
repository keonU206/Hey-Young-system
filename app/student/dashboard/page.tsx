"use client";

import { useCurrentUser } from "@/lib/useCurrentUser";

export default function StudentDashboardPage() {
  const { user, loading } = useCurrentUser();

  if (loading) {
    return (
      <div className="page-container">
        <p>로그인 정보를 불러오는 중입니다...</p>
      </div>
    );
  }

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
          <h1 className="page-title">학생 대시보드</h1>
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
          <li>이메일: {user.email}</li>
          <li>학과: {user.department || "미입력"}</li>
        </ul>
      </section>

      {/* TODO: 나중에 수강 과목 / 출석 요약 추가 */}
    </div>
  );
}

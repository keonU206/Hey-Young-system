import Link from "next/link";
import type { ReactNode } from "react";

export default function StudentLayout({ children }: { children: ReactNode }) {
  return (
    <div className="role-layout">
      <aside className="role-sidebar">
        <div className="role-sidebar-header">
          <span className="role-badge">학생</span>
          <p className="role-name">Student Portal</p>
        </div>

        <nav className="role-nav">
          <Link href="/student/dashboard" className="role-nav-link">
            대시보드
          </Link>
          <Link href="/student/courses" className="role-nav-link">
            내 강의
          </Link>
          <Link href="/student/attendance" className="role-nav-link">
            출석 현황
          </Link>
          <Link href="/student/excuses" className="role-nav-link">
            공결 / 이의 신청
          </Link>
        </nav>

        <div className="role-sidebar-footer">
          <Link href="/profile" className="role-nav-link small">
            내 정보
          </Link>
          <button className="role-logout-btn">로그아웃</button>
        </div>
      </aside>

      <main className="role-main">{children}</main>
    </div>
  );
}

import Link from "next/link";
import type { ReactNode } from "react";

export default function InstructorLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="role-layout">
      <aside className="role-sidebar">
        <div className="role-sidebar-header">
          <span className="role-badge instructor">교원</span>
          <p className="role-name">Instructor Portal</p>
        </div>

        <nav className="role-nav">
          <Link href="/instructor/dashboard" className="role-nav-link">
            대시보드
          </Link>
          <Link href="/instructor/courses" className="role-nav-link">
            담당 강의
          </Link>
          <Link href="/instructor/excuses" className="role-nav-link">
            공결 처리
          </Link>
          <Link href="/instructor/appeals" className="role-nav-link">
            이의제기 처리
          </Link>
          <Link href="/instructor/notices" className="role-nav-link">
            공지 / 알림
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

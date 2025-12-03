import Link from "next/link";
import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="role-layout">
      <aside className="role-sidebar">
        <div className="role-sidebar-header">
          <span className="role-badge admin">관리자</span>
          <p className="role-name">Admin Console</p>
        </div>

        <nav className="role-nav">
          <Link href="/admin/dashboard" className="role-nav-link">
            대시보드
          </Link>
          <Link href="/admin/departments" className="role-nav-link">
            학과 관리
          </Link>
          <Link href="/admin/users" className="role-nav-link">
            사용자 관리
          </Link>
          <Link href="/admin/courses" className="role-nav-link">
            과목 관리
          </Link>
          <Link href="/admin/semesters" className="role-nav-link">
            학기 / 주차 설정
          </Link>
          <Link href="/admin/logs" className="role-nav-link">
            감사 로그
          </Link>
          <Link href="/admin/reports" className="role-nav-link">
            리포트
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

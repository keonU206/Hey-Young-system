import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SmartAttend - 출석 관리 시스템",
  description: "관리자, 교원, 학생이 함께 사용하는 웹 출석 관리 시스템",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="app-body">
        {/* 전역 레이아웃 (헤더/푸터, 토스트 등 공통 요소는 여기서 관리) */}
        <div className="app-shell">
          <header className="app-header">
            <div className="app-header-inner">
              <h1 className="app-logo">SmartAttend</h1>
            </div>
          </header>

          <main className="app-main">{children}</main>
        </div>
      </body>
    </html>
  );
}

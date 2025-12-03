"use client";

import { useEffect, useState } from "react";
import { AdminGuard } from "@/components/AdminGuard";
import { LogoutButton } from "@/components/LogoutButton";

// ✅ 리포트 응답 타입 정의
type Summary = {
  users: {
    total: number;
    students: number;
    instructors: number;
    admins: number;
  };
  departments: number;
  semesters: number;
  courses: number;
  class_sessions: number;
  enrollments: number;
  excuses: number;
};

export default function AdminReportsPage() {
  // ✅ Summary | null 로 명시
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/admin/reports/system");
        const data = await res.json();

        if (!data.ok) {
          setErrorMsg(data.message || "시스템 리포트를 불러오지 못했습니다.");
          return;
        }

        setSummary(data.summary as Summary);
      } catch (err) {
        console.error(err);
        setErrorMsg("서버와 통신 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <AdminGuard>
      <div className="page-container">
        <header className="page-header">
          <div>
            <h1 className="page-title">시스템 리포트</h1>
            <p className="page-subtitle">
              전체 사용자, 학과/학기/과목, 출석 관련 통계를 요약해서 보여줍니다.
            </p>
          </div>
          <LogoutButton />
        </header>

        {errorMsg && <p className="form-error mb-12">{errorMsg}</p>}

        {loading ? (
          <p>리포트를 불러오는 중입니다...</p>
        ) : !summary ? (
          <p>표시할 리포트 데이터가 없습니다.</p>
        ) : (
          <section className="card">
            <h2 className="card-title">시스템 요약 정보</h2>

            <div className="summary-grid">
              {/* 사용자 요약 */}
              <div className="summary-item">
                <h3>사용자</h3>
                <p>전체: {summary.users.total}</p>
                <p>학생: {summary.users.students}</p>
                <p>교원: {summary.users.instructors}</p>
                <p>관리자: {summary.users.admins}</p>
              </div>

              {/* 학과/학기/과목 */}
              <div className="summary-item">
                <h3>학과 / 학기 / 과목</h3>
                <p>학과: {summary.departments}</p>
                <p>학기: {summary.semesters}</p>
                <p>과목: {summary.courses}</p>
              </div>

              {/* 출석 관련 */}
              <div className="summary-item">
                <h3>출석 관련</h3>
                <p>출석 세션: {summary.class_sessions}</p>
                <p>수강 신청: {summary.enrollments}</p>
                <p>공결 신청: {summary.excuses}</p>
              </div>
            </div>

            <p className="mt-16">
              자세한 감사/오류 로그는 <strong>[감사 로그]</strong> 메뉴에서
              확인할 수 있습니다.
            </p>
          </section>
        )}
      </div>
    </AdminGuard>
  );
}

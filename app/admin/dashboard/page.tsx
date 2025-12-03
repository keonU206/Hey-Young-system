"use client";

import { useEffect, useState } from "react";

type LogActor = {
  id: number;
  login_id: string;
  name: string;
  role: string;
};

type LogItem = {
  id: number;
  actor: LogActor | null;
  target_type: string;
  target_id: number;
  action: string;
  before_data: any;
  after_data: any;
  created_at: string; // ISO 문자열
};

export default function AdminDashboardPage() {
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [loadingLogs, setLoadingLogs] = useState<boolean>(true);
  const [logError, setLogError] = useState<string>("");

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const res = await fetch("/api/admin/logs");
        const data = await res.json();

        if (!data.ok) {
          setLogError(data.message || "최근 로그를 불러오지 못했습니다.");
          return;
        }

        const rawLogs = (data.logs as any[]) ?? [];

        const mapped: LogItem[] = rawLogs.map((l) => ({
          id: Number(l.id),
          actor: l.actor
            ? {
                id: Number(l.actor.id),
                login_id: String(l.actor.login_id),
                name: String(l.actor.name),
                role: String(l.actor.role),
              }
            : null,
          target_type: String(l.target_type),
          target_id: Number(l.target_id),
          action: String(l.action),
          before_data: l.before_data ?? null,
          after_data: l.after_data ?? null,
          created_at: String(l.created_at),
        }));

        // 가장 최근 5개만 사용 (API에서도 정렬됐다고 가정하지만 한 번 더 정렬)
        const sorted = mapped.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setLogs(sorted.slice(0, 5));
      } catch (err) {
        console.error(err);
        setLogError("서버와 통신 중 오류가 발생했습니다.");
      } finally {
        setLoadingLogs(false);
      }
    };

    loadLogs();
  }, []);

  return (
    <div>
      <h1 className="page-title">관리자 대시보드</h1>
      <p className="page-subtitle">
        전체 시스템 현황과 주요 지표를 한눈에 확인합니다.
      </p>

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

      <section className="card mt-24">
        <h2 className="card-title">최근 활동 로그</h2>

        {logError && <p className="form-error mb-8">{logError}</p>}

        {loadingLogs ? (
          <p>최근 활동 로그를 불러오는 중입니다...</p>
        ) : logs.length === 0 ? (
          <p>표시할 최근 활동 로그가 없습니다.</p>
        ) : (
          <table className="simple-table">
            <thead>
              <tr>
                <th>시간</th>
                <th>사용자</th>
                <th>역할</th>
                <th>행위</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td>
                    {log.created_at
                      ? new Date(log.created_at).toLocaleString()
                      : "-"}
                  </td>
                  <td>
                    {log.actor
                      ? `${log.actor.name} (${log.actor.login_id})`
                      : "시스템"}
                  </td>
                  <td>{log.actor ? log.actor.role : "-"}</td>
                  <td>
                    {/* action + target 한 줄로 보기 좋게 */}
                    {log.action} → {log.target_type} #{log.target_id}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

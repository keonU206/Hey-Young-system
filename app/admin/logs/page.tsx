"use client";

import { useEffect, useState } from "react";
import { AdminGuard } from "@/components/AdminGuard";
import { LogoutButton } from "@/components/LogoutButton";

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

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/admin/logs");
        const data = await res.json();

        if (!data.ok) {
          setErrorMsg(data.message || "로그를 불러오지 못했습니다.");
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

        // 🔹 최신순 정렬 후 5개만 사용
        const sorted = mapped.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setLogs(sorted.slice(0, 5));
      } catch (err) {
        console.error(err);
        setErrorMsg("서버와 통신 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleShowDetail = (log: LogItem) => {
    const payload = {
      before: log.before_data,
      after: log.after_data,
    };
    alert(JSON.stringify(payload, null, 2));
  };

  return (
    <AdminGuard>
      <div className="page-container">
        <header className="page-header">
          <div>
            <h1 className="page-title">시스템 로그</h1>
            <p className="page-subtitle">
              민감 이벤트(출석 변경, 승인, 정책 변경, 사용자/학과/과목 관리
              등)에 대한 감사 로그를 확인할 수 있습니다.
            </p>
          </div>
          <LogoutButton />
        </header>

        {errorMsg && <p className="form-error mb-12">{errorMsg}</p>}

        {loading ? (
          <p>로그를 불러오는 중입니다...</p>
        ) : logs.length === 0 ? (
          <section className="card">
            <p>표시할 로그가 없습니다.</p>
          </section>
        ) : (
          <section className="card">
            <h2 className="card-title">최근 감사 로그 (최신 5개)</h2>

            <table className="admin-table">
              <thead>
                <tr>
                  <th>시간</th>
                  <th>사용자</th>
                  <th>역할</th>
                  <th>행위</th>
                  <th>자세히보기</th>
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
                      {log.action} → {log.target_type} #{log.target_id}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => handleShowDetail(log)}
                      >
                        자세히보기
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
      </div>
    </AdminGuard>
  );
}

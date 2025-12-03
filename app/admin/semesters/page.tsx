"use client";

import { useEffect, useState, FormEvent } from "react";
import { AdminGuard } from "@/components/AdminGuard";
import { useCurrentUser } from "@/lib/useCurrentUser";
import { LogoutButton } from "@/components/LogoutButton";

type Semester = {
  id: number;
  name: string;
  start_date: string | null;
  end_date: string | null;
  total_weeks: number;
};

export default function AdminSemestersPage() {
  const { user: currentUser } = useCurrentUser();
  const [list, setList] = useState<Semester[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | "new" | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // 새 학기 입력용
  const [newName, setNewName] = useState("");
  const [newStart, setNewStart] = useState("");
  const [newEnd, setNewEnd] = useState("");
  const [newWeeks, setNewWeeks] = useState("");

  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        const res = await fetch("/api/admin/semesters");
        const data = await res.json();
        if (!data.ok) {
          setErrorMsg(data.message || "학기 목록 로딩 실패");
          return;
        }
        const mapped: Semester[] = data.semesters.map((s: any) => ({
          id: s.id,
          name: s.name,
          start_date: s.start_date ? s.start_date.slice(0, 10) : null,
          end_date: s.end_date ? s.end_date.slice(0, 10) : null,
          total_weeks: s.total_weeks,
        }));
        setList(mapped);
      } catch (err) {
        console.error(err);
        setErrorMsg("서버와 통신 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchSemesters();
  }, []);

  const handleChangeField = (
    id: number,
    key: keyof Semester,
    value: string | number
  ) => {
    setList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [key]: value } : s))
    );
  };

  const handleSave = async (sem: Semester) => {
    if (!currentUser) return;
    setErrorMsg("");
    setSuccessMsg("");
    setSavingId(sem.id);

    try {
      const res = await fetch("/api/admin/semesters", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminLoginId: currentUser.login_id,
          id: sem.id,
          name: sem.name,
          start_date: sem.start_date || undefined,
          end_date: sem.end_date || undefined,
          total_weeks: sem.total_weeks,
        }),
      });

      const data = await res.json();
      if (!data.ok) {
        setErrorMsg(data.message || "학기 정보 저장에 실패했습니다.");
        return;
      }

      const s = data.semester;
      setList((prev) =>
        prev.map((x) =>
          x.id === sem.id
            ? {
                id: s.id,
                name: s.name,
                start_date: s.start_date ? s.start_date.slice(0, 10) : null,
                end_date: s.end_date ? s.end_date.slice(0, 10) : null,
                total_weeks: s.total_weeks,
              }
            : x
        )
      );

      setSuccessMsg("변경 사항이 저장되었습니다.");
    } catch (err) {
      console.error(err);
      setErrorMsg("서버와 통신 중 오류가 발생했습니다.");
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!currentUser) return;
    if (!confirm("정말 이 학기를 삭제하시겠습니까?")) return;

    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/admin/semesters", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminLoginId: currentUser.login_id,
          id,
        }),
      });

      const data = await res.json().catch(() => null);
      if (data && !data.ok) {
        setErrorMsg(data.message || "학기 삭제에 실패했습니다.");
        return;
      }

      setList((prev) => prev.filter((s) => s.id !== id));
      setSuccessMsg("학기가 삭제되었습니다.");
    } catch (err) {
      console.error(err);
      setErrorMsg("서버와 통신 중 오류가 발생했습니다.");
    }
  };

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setErrorMsg("");
    setSuccessMsg("");

    if (!newName.trim() || !newStart || !newEnd || !newWeeks) {
      setErrorMsg("학기명, 기간, 주차 수를 모두 입력해 주세요.");
      return;
    }

    setSavingId("new");
    try {
      const res = await fetch("/api/admin/semesters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminLoginId: currentUser.login_id,
          name: newName,
          start_date: newStart,
          end_date: newEnd,
          total_weeks: Number(newWeeks),
        }),
      });

      const data = await res.json();
      if (!data.ok) {
        setErrorMsg(data.message || "학기 생성에 실패했습니다.");
        return;
      }

      const s = data.semester;
      setList((prev) => [
        ...prev,
        {
          id: s.id,
          name: s.name,
          start_date: s.start_date ? s.start_date.slice(0, 10) : null,
          end_date: s.end_date ? s.end_date.slice(0, 10) : null,
          total_weeks: s.total_weeks,
        },
      ]);

      setSuccessMsg("새 학기가 추가되었습니다.");
      setNewName("");
      setNewStart("");
      setNewEnd("");
      setNewWeeks("");
    } catch (err) {
      console.error(err);
      setErrorMsg("서버와 통신 중 오류가 발생했습니다.");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <AdminGuard>
      <div className="page-container">
        <header className="page-header">
          <div>
            <h1 className="page-title">학기 관리</h1>
            <p className="page-subtitle">
              학기 이름과 기간, 주차 수를 설정하고 관리합니다.
            </p>
          </div>
          <LogoutButton />
        </header>

        {errorMsg && <p className="form-error mb-12">{errorMsg}</p>}
        {successMsg && <p className="form-success mb-12">{successMsg}</p>}

        {/* 새 학기 추가 */}
        <section className="card mb-24">
          <h2 className="card-title">새 학기 추가</h2>
          <form className="inline-form" onSubmit={handleCreate}>
            <div className="form-field">
              <label>학기명</label>
              <input
                type="text"
                placeholder="예: 2025년 1학기"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>시작일</label>
              <input
                type="date"
                value={newStart}
                onChange={(e) => setNewStart(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>종료일</label>
              <input
                type="date"
                value={newEnd}
                onChange={(e) => setNewEnd(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>총 주차</label>
              <input
                type="number"
                min={1}
                value={newWeeks}
                onChange={(e) => setNewWeeks(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={savingId === "new"}
            >
              {savingId === "new" ? "추가 중..." : "학기 추가"}
            </button>
          </form>
        </section>

        {/* 학기 목록 */}
        <section className="card">
          <h2 className="card-title">학기 목록</h2>
          {loading ? (
            <p>학기 목록을 불러오는 중입니다...</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>학기명</th>
                  <th>시작일</th>
                  <th>종료일</th>
                  <th>총 주차</th>
                  <th>작업</th>
                </tr>
              </thead>
              <tbody>
                {list.map((s) => (
                  <tr key={s.id}>
                    <td>{s.id}</td>
                    <td>
                      <input
                        type="text"
                        value={s.name}
                        onChange={(e) =>
                          handleChangeField(s.id, "name", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        value={s.start_date || ""}
                        onChange={(e) =>
                          handleChangeField(s.id, "start_date", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        value={s.end_date || ""}
                        onChange={(e) =>
                          handleChangeField(s.id, "end_date", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min={1}
                        value={s.total_weeks}
                        onChange={(e) =>
                          handleChangeField(
                            s.id,
                            "total_weeks",
                            Number(e.target.value)
                          )
                        }
                      />
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary btn-sm mr-8"
                        onClick={() => handleSave(s)}
                        disabled={savingId === s.id}
                      >
                        {savingId === s.id ? "저장 중..." : "저장"}
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(s.id)}
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
                {list.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center" }}>
                      등록된 학기가 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </AdminGuard>
  );
}

"use client";

import { useEffect, useState, FormEvent } from "react";
import { AdminGuard } from "@/components/AdminGuard";
import { useCurrentUser } from "@/lib/useCurrentUser";
import { LogoutButton } from "@/components/LogoutButton";

type Department = {
  id: number;
  code: string;
  name: string;
  is_active: boolean;
};

export default function AdminDepartmentsPage() {
  const { user: currentUser } = useCurrentUser();
  const [list, setList] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | "new" | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // 새 학과 입력용
  const [newCode, setNewCode] = useState("");
  const [newName, setNewName] = useState("");

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await fetch("/api/admin/departments");
        const data = await res.json();
        if (!data.ok) {
          setErrorMsg(data.message || "학과 목록 로딩 실패");
          return;
        }
        setList(data.departments);
      } catch (err) {
        console.error(err);
        setErrorMsg("서버와 통신 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  const handleToggleActive = (id: number) => {
    setList((prev) =>
      prev.map((d) => (d.id === id ? { ...d, is_active: !d.is_active } : d))
    );
  };

  const handleChangeField = (
    id: number,
    key: keyof Department,
    value: string | boolean
  ) => {
    setList((prev) =>
      prev.map((d) => (d.id === id ? { ...d, [key]: value } : d))
    );
  };

  const handleSave = async (dept: Department) => {
    if (!currentUser) return;
    setErrorMsg("");
    setSuccessMsg("");
    setSavingId(dept.id);

    try {
      const res = await fetch(`/api/admin/departments`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          adminLoginId: currentUser.login_id,
          id: dept.id, // ✅ id를 body로 보냄
          code: dept.code,
          name: dept.name,
          is_active: dept.is_active,
        }),
      });

      const data = await res.json();
      if (!data.ok) {
        setErrorMsg(data.message || "학과 정보 저장에 실패했습니다.");
        return;
      }

      // 서버가 돌려준 값으로 state 정리
      setList((prev) =>
        prev.map((d) => (d.id === dept.id ? data.department : d))
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
    if (!confirm("정말 이 학과를 삭제하시겠습니까?")) return;

    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch(`/api/admin/departments`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          adminLoginId: currentUser.login_id,
          id, // ✅ id를 body로 보냄
        }),
      });

      const data = await res.json().catch(() => null);

      if (data && !data.ok) {
        setErrorMsg(data.message || "학과 삭제에 실패했습니다.");
        return;
      }

      setList((prev) => prev.filter((d) => d.id !== id));
      setSuccessMsg("학과가 삭제되었습니다.");
    } catch (err) {
      console.error(err);
      setErrorMsg("서버와 통신 중 오류가 발생했습니다.");
    }
  };

  const handleCreateNew = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setErrorMsg("");
    setSuccessMsg("");

    if (!newCode.trim() || !newName.trim()) {
      setErrorMsg("코드와 학과명을 모두 입력해 주세요.");
      return;
    }

    setSavingId("new");
    try {
      const res = await fetch("/api/admin/departments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          adminLoginId: currentUser.login_id,
          code: newCode,
          name: newName,
        }),
      });

      const data = await res.json();
      if (!data.ok) {
        setErrorMsg(data.message || "학과 생성에 실패했습니다.");
        return;
      }

      setList((prev) => [...prev, data.department]);
      setSuccessMsg("새 학과가 추가되었습니다.");
      setNewCode("");
      setNewName("");
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
            <h1 className="page-title">학과 관리</h1>
            <p className="page-subtitle">
              학과 코드를 기준으로 학과를 등록·수정·삭제할 수 있습니다.
            </p>
          </div>
          <LogoutButton />
        </header>

        {errorMsg && <p className="form-error mb-12">{errorMsg}</p>}
        {successMsg && <p className="form-success mb-12">{successMsg}</p>}

        {/* 새 학과 추가 폼 */}
        <section className="card mb-24">
          <h2 className="card-title">새 학과 추가</h2>
          <form className="inline-form" onSubmit={handleCreateNew}>
            <div className="form-field">
              <label htmlFor="newDeptCode">코드</label>
              <input
                id="newDeptCode"
                type="text"
                placeholder="예: CSE"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label htmlFor="newDeptName">학과명</label>
              <input
                id="newDeptName"
                type="text"
                placeholder="예: 컴퓨터공학과"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={savingId === "new"}
            >
              {savingId === "new" ? "추가 중..." : "학과 추가"}
            </button>
          </form>
        </section>

        {/* 학과 목록 테이블 */}
        <section className="card">
          <h2 className="card-title">학과 목록</h2>
          {loading ? (
            <p>학과 목록을 불러오는 중입니다...</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>코드</th>
                  <th>학과명</th>
                  <th>활성</th>
                  <th>작업</th>
                </tr>
              </thead>
              <tbody>
                {list.map((d) => (
                  <tr key={d.id}>
                    <td>{d.id}</td>
                    <td>
                      <input
                        type="text"
                        value={d.code}
                        onChange={(e) =>
                          handleChangeField(d.id, "code", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={d.name}
                        onChange={(e) =>
                          handleChangeField(d.id, "name", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={d.is_active}
                        onChange={() => handleToggleActive(d.id)}
                      />
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary btn-sm mr-8"
                        onClick={() => handleSave(d)}
                        disabled={savingId === d.id}
                      >
                        {savingId === d.id ? "저장 중..." : "저장"}
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(d.id)}
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
                {list.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center" }}>
                      등록된 학과가 없습니다.
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

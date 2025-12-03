"use client";

import { useEffect, useState, FormEvent } from "react";
import { AdminGuard } from "@/components/AdminGuard";
import { useCurrentUser } from "@/lib/useCurrentUser";
import { LogoutButton } from "@/components/LogoutButton";

type AdminUser = {
  id: number;
  login_id: string;
  name: string;
  role: "ADMIN" | "INSTRUCTOR" | "STUDENT";
  email: string;
  department: string | null;
  is_active: boolean;
};

export default function AdminUsersPage() {
  const { user: currentUser } = useCurrentUser();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // 새 사용자 등록용
  const [newLoginId, setNewLoginId] = useState("");
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newDepartment, setNewDepartment] = useState("");
  const [newRole, setNewRole] = useState<AdminUser["role"]>("STUDENT");
  const [newPassword, setNewPassword] = useState("");
  const [creating, setCreating] = useState(false);

  // 사용자 목록 로딩
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/admin/users");
        const data = await res.json();
        if (!data.ok) {
          setErrorMsg(data.message || "사용자 목록 로딩 실패");
          return;
        }
        setUsers(data.users);
      } catch (err) {
        console.error(err);
        setErrorMsg("서버와 통신 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleChangeField = (
    id: number,
    key: keyof AdminUser,
    value: string | boolean
  ) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, [key]: value } : u))
    );
  };

  const handleSaveUser = async (u: AdminUser) => {
    if (!currentUser) return;
    setErrorMsg("");
    setSuccessMsg("");
    setSavingId(u.id);

    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          adminLoginId: currentUser.login_id,
          id: u.id,
          name: u.name,
          email: u.email,
          department: u.department ?? "",
          role: u.role,
          is_active: u.is_active,
        }),
      });

      const data = await res.json();
      if (!data.ok) {
        setErrorMsg(data.message || "사용자 정보 저장에 실패했습니다.");
        return;
      }

      // 서버에서 정제된 최신 값으로 덮어쓰기
      setUsers((prev) =>
        prev.map((user) => (user.id === u.id ? data.user : user))
      );

      setSuccessMsg("변경 사항이 저장되었습니다.");
    } catch (err) {
      console.error(err);
      setErrorMsg("서버와 통신 중 오류가 발생했습니다.");
    } finally {
      setSavingId(null);
    }
  };

  const handleCreateUser = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setErrorMsg("");
    setSuccessMsg("");

    if (
      !newLoginId.trim() ||
      !newName.trim() ||
      !newEmail.trim() ||
      !newPassword
    ) {
      setErrorMsg("학번/사번, 이름, 이메일, 비밀번호는 필수입니다.");
      return;
    }

    if (newPassword.length < 8) {
      setErrorMsg("비밀번호는 8자 이상이어야 합니다.");
      return;
    }

    setCreating(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          adminLoginId: currentUser.login_id,
          login_id: newLoginId,
          name: newName,
          email: newEmail,
          department: newDepartment,
          role: newRole,
          password: newPassword,
        }),
      });

      const data = await res.json();
      if (!data.ok) {
        setErrorMsg(data.message || "사용자 생성에 실패했습니다.");
        return;
      }

      setUsers((prev) => [...prev, data.user]);
      setSuccessMsg("새 사용자가 등록되었습니다.");

      // 입력값 초기화
      setNewLoginId("");
      setNewName("");
      setNewEmail("");
      setNewDepartment("");
      setNewPassword("");
      setNewRole("STUDENT");
    } catch (err) {
      console.error(err);
      setErrorMsg("서버와 통신 중 오류가 발생했습니다.");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!currentUser) return;
    if (!confirm("정말 이 사용자를 삭제하시겠습니까?")) return;

    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          adminLoginId: currentUser.login_id,
          id,
        }),
      });

      const data = await res.json().catch(() => null);

      if (data && !data.ok) {
        setErrorMsg(data.message || "사용자 삭제에 실패했습니다.");
        return;
      }

      // 화면에서 해당 유저 제거
      setUsers((prev) => prev.filter((u) => u.id !== id));
      setSuccessMsg("사용자가 삭제되었습니다.");
    } catch (err) {
      console.error(err);
      setErrorMsg("서버와 통신 중 오류가 발생했습니다.");
    }
  };

  return (
    <AdminGuard>
      <div className="page-container">
        <header className="page-header">
          <div>
            <h1 className="page-title">사용자 관리</h1>
            <p className="page-subtitle">
              학생/교원/관리자 계정을 등록하고 역할과 활성 상태를 관리합니다.
            </p>
          </div>
          <LogoutButton />
        </header>

        {errorMsg && <p className="form-error mb-12">{errorMsg}</p>}
        {successMsg && <p className="form-success mb-12">{successMsg}</p>}

        {/* 새 사용자 등록 폼 */}
        <section className="card mb-24">
          <h2 className="card-title">새 사용자 등록</h2>
          <form className="inline-form" onSubmit={handleCreateUser}>
            <div className="form-field">
              <label htmlFor="newLoginId">학번 / 사번</label>
              <input
                id="newLoginId"
                type="text"
                placeholder="예: 202312345"
                value={newLoginId}
                onChange={(e) => setNewLoginId(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label htmlFor="newName">이름</label>
              <input
                id="newName"
                type="text"
                placeholder="예: 홍길동"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label htmlFor="newEmail">이메일</label>
              <input
                id="newEmail"
                type="email"
                placeholder="예: user@school.ac.kr"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label htmlFor="newDept">학과</label>
              <input
                id="newDept"
                type="text"
                placeholder="예: 컴퓨터공학과"
                value={newDepartment}
                onChange={(e) => setNewDepartment(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label htmlFor="newRole">역할</label>
              <select
                id="newRole"
                value={newRole}
                onChange={(e) =>
                  setNewRole(e.target.value as AdminUser["role"])
                }
              >
                <option value="STUDENT">학생</option>
                <option value="INSTRUCTOR">교원</option>
                <option value="ADMIN">관리자</option>
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="newPassword">초기 비밀번호</label>
              <input
                id="newPassword"
                type="password"
                placeholder="8자 이상 비밀번호"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={creating}
            >
              {creating ? "등록 중..." : "사용자 등록"}
            </button>
          </form>
        </section>

        {/* 사용자 목록 */}
        <section className="card">
          <h2 className="card-title">사용자 목록</h2>
          {loading ? (
            <p>사용자 목록을 불러오는 중입니다...</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>학번/사번</th>
                  <th>이름</th>
                  <th>이메일</th>
                  <th>학과</th>
                  <th>역할</th>
                  <th>활성</th>
                  <th>저장</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.login_id}</td>
                    <td>
                      <input
                        type="text"
                        value={u.name}
                        onChange={(e) =>
                          handleChangeField(u.id, "name", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="email"
                        value={u.email || ""}
                        onChange={(e) =>
                          handleChangeField(u.id, "email", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={u.department || ""}
                        onChange={(e) =>
                          handleChangeField(u.id, "department", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <select
                        value={u.role}
                        onChange={(e) =>
                          handleChangeField(
                            u.id,
                            "role",
                            e.target.value as AdminUser["role"]
                          )
                        }
                      >
                        <option value="STUDENT">학생</option>
                        <option value="INSTRUCTOR">교원</option>
                        <option value="ADMIN">관리자</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={u.is_active}
                        onChange={(e) =>
                          handleChangeField(u.id, "is_active", e.target.checked)
                        }
                      />
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleSaveUser(u)}
                        disabled={savingId === u.id}
                      >
                        {savingId === u.id ? "저장 중..." : "저장"}
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteUser(u.id)}
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center" }}>
                      등록된 사용자가 없습니다.
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

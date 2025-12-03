// app/(admin)/admin/courses/page.tsx
"use client";

import { useEffect, useState, FormEvent } from "react";
import { AdminGuard } from "@/components/AdminGuard";
import { useCurrentUser } from "@/lib/useCurrentUser";
import { LogoutButton } from "@/components/LogoutButton";

type Course = {
  id: number;
  code: string;
  title: string;
  section: string | null;
  semester_id: number;
  instructor_id: number;
  room_default: string | null;
};

type SemesterOption = {
  id: number;
  name: string;
};

type InstructorOption = {
  id: number;
  name: string;
  login_id: string;
};

export default function AdminCoursesPage() {
  const { user: currentUser } = useCurrentUser();

  const [courses, setCourses] = useState<Course[]>([]);
  const [semesters, setSemesters] = useState<SemesterOption[]>([]);
  const [instructors, setInstructors] = useState<InstructorOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | "new" | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // 새 과목 입력용
  const [newCode, setNewCode] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newSection, setNewSection] = useState("");
  const [newSemesterId, setNewSemesterId] = useState("");
  const [newInstructorId, setNewInstructorId] = useState("");
  const [newRoom, setNewRoom] = useState("");

  useEffect(() => {
    const loadAll = async () => {
      try {
        // 1) 과목
        const [coursesRes, semRes, usersRes] = await Promise.all([
          fetch("/api/admin/courses"),
          fetch("/api/admin/semesters"),
          fetch("/api/admin/users"),
        ]);

        const coursesData = await coursesRes.json();
        const semData = await semRes.json();
        const usersData = await usersRes.json();

        if (!coursesData.ok) {
          setErrorMsg(coursesData.message || "과목 목록 로딩 실패");
          return;
        }
        if (!semData.ok) {
          setErrorMsg(semData.message || "학기 목록 로딩 실패");
          return;
        }
        if (!usersData.ok) {
          setErrorMsg(usersData.message || "사용자 목록 로딩 실패");
          return;
        }

        setCourses(coursesData.courses);

        setSemesters(
          semData.semesters.map((s: any) => ({
            id: s.id,
            name: s.name,
          }))
        );

        setInstructors(
          usersData.users
            .filter((u: any) => u.role === "INSTRUCTOR")
            .map((u: any) => ({
              id: u.id,
              name: u.name,
              login_id: u.login_id,
            }))
        );
      } catch (err) {
        console.error(err);
        setErrorMsg("서버와 통신 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, []);

  const handleChangeField = (
    id: number,
    key: keyof Course,
    value: string | number | null
  ) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [key]: value } : c))
    );
  };

  const handleSaveCourse = async (c: Course) => {
    if (!currentUser) return;
    setErrorMsg("");
    setSuccessMsg("");
    setSavingId(c.id);

    try {
      const res = await fetch("/api/admin/courses", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminLoginId: currentUser.login_id,
          id: c.id,
          code: c.code,
          title: c.title,
          section: c.section,
          semester_id: c.semester_id,
          instructor_id: c.instructor_id,
          room_default: c.room_default,
        }),
      });

      const data = await res.json();
      if (!data.ok) {
        setErrorMsg(data.message || "과목 정보 저장에 실패했습니다.");
        return;
      }

      setCourses((prev) => prev.map((x) => (x.id === c.id ? data.course : x)));

      setSuccessMsg("과목 정보가 저장되었습니다.");
    } catch (err) {
      console.error(err);
      setErrorMsg("서버와 통신 중 오류가 발생했습니다.");
    } finally {
      setSavingId(null);
    }
  };

  const handleDeleteCourse = async (id: number) => {
    if (!currentUser) return;
    if (!confirm("정말 이 과목을 삭제하시겠습니까?")) return;

    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/admin/courses", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminLoginId: currentUser.login_id,
          id,
        }),
      });

      const data = await res.json().catch(() => null);
      if (data && !data.ok) {
        setErrorMsg(data.message || "과목 삭제에 실패했습니다.");
        return;
      }

      setCourses((prev) => prev.filter((c) => c.id !== id));
      setSuccessMsg("과목이 삭제되었습니다.");
    } catch (err) {
      console.error(err);
      setErrorMsg("서버와 통신 중 오류가 발생했습니다.");
    }
  };

  const handleCreateCourse = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setErrorMsg("");
    setSuccessMsg("");

    if (
      !newCode.trim() ||
      !newTitle.trim() ||
      !newSemesterId ||
      !newInstructorId
    ) {
      setErrorMsg("코드, 과목명, 학기, 담당교원은 필수입니다.");
      return;
    }

    setSavingId("new");
    try {
      const res = await fetch("/api/admin/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminLoginId: currentUser.login_id,
          code: newCode,
          title: newTitle,
          section: newSection || null,
          semester_id: Number(newSemesterId),
          instructor_id: Number(newInstructorId),
          room_default: newRoom || null,
        }),
      });

      const data = await res.json();
      if (!data.ok) {
        setErrorMsg(data.message || "과목 생성에 실패했습니다.");
        return;
      }

      setCourses((prev) => [...prev, data.course]);
      setSuccessMsg("새 과목이 개설되었습니다.");

      setNewCode("");
      setNewTitle("");
      setNewSection("");
      setNewSemesterId("");
      setNewInstructorId("");
      setNewRoom("");
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
            <h1 className="page-title">과목 관리</h1>
            <p className="page-subtitle">
              학기와 담당 교원을 지정하여 과목을 개설·수정·삭제할 수 있습니다.
            </p>
          </div>
          <LogoutButton />
        </header>

        {errorMsg && <p className="form-error mb-12">{errorMsg}</p>}
        {successMsg && <p className="form-success mb-12">{successMsg}</p>}

        {/* 새 과목 추가 */}
        <section className="card mb-24">
          <h2 className="card-title">새 과목 개설</h2>
          <form className="inline-form" onSubmit={handleCreateCourse}>
            <div className="form-field">
              <label>과목 코드</label>
              <input
                type="text"
                placeholder="예: CSP101"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>과목명</label>
              <input
                type="text"
                placeholder="예: 서버 프로그래밍"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>분반</label>
              <input
                type="text"
                placeholder="예: A, 01 (없으면 비워둠)"
                value={newSection}
                onChange={(e) => setNewSection(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>학기</label>
              <select
                value={newSemesterId}
                onChange={(e) => setNewSemesterId(e.target.value)}
              >
                <option value="">학기 선택</option>
                {semesters.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} (ID: {s.id})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label>담당 교원</label>
              <select
                value={newInstructorId}
                onChange={(e) => setNewInstructorId(e.target.value)}
              >
                <option value="">교원 선택</option>
                {instructors.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.login_id})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label>기본 강의실</label>
              <input
                type="text"
                placeholder="예: 공학관 301호"
                value={newRoom}
                onChange={(e) => setNewRoom(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={savingId === "new"}
            >
              {savingId === "new" ? "개설 중..." : "과목 개설"}
            </button>
          </form>
        </section>

        {/* 과목 목록 */}
        <section className="card">
          <h2 className="card-title">과목 목록</h2>
          {loading ? (
            <p>과목 목록을 불러오는 중입니다...</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>코드</th>
                  <th>과목명</th>
                  <th>분반</th>
                  <th>학기</th>
                  <th>담당 교원</th>
                  <th>강의실</th>
                  <th>작업</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c) => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>
                      <input
                        type="text"
                        value={c.code}
                        onChange={(e) =>
                          handleChangeField(c.id, "code", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={c.title}
                        onChange={(e) =>
                          handleChangeField(c.id, "title", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={c.section || ""}
                        onChange={(e) =>
                          handleChangeField(
                            c.id,
                            "section",
                            e.target.value || null
                          )
                        }
                      />
                    </td>
                    <td>
                      <select
                        value={c.semester_id}
                        onChange={(e) =>
                          handleChangeField(
                            c.id,
                            "semester_id",
                            Number(e.target.value)
                          )
                        }
                      >
                        <option value={0}>선택</option>
                        {semesters.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name} (ID:{s.id})
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select
                        value={c.instructor_id}
                        onChange={(e) =>
                          handleChangeField(
                            c.id,
                            "instructor_id",
                            Number(e.target.value)
                          )
                        }
                      >
                        <option value={0}>선택</option>
                        {instructors.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name} ({t.login_id})
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        type="text"
                        value={c.room_default || ""}
                        onChange={(e) =>
                          handleChangeField(
                            c.id,
                            "room_default",
                            e.target.value || null
                          )
                        }
                      />
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary btn-sm mr-8"
                        onClick={() => handleSaveCourse(c)}
                        disabled={savingId === c.id}
                      >
                        {savingId === c.id ? "저장 중..." : "저장"}
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteCourse(c.id)}
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
                {courses.length === 0 && (
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center" }}>
                      등록된 과목이 없습니다.
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

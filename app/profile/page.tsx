"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, FormEvent } from "react";
import { useCurrentUser } from "@/lib/useCurrentUser";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading } = useCurrentUser();

  // 비로그인 접근 막기
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  // 비밀번호 변경용 상태
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");
  const [pwLoading, setPwLoading] = useState(false);

  if (loading) {
    return (
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <p>로그인 정보를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <p>로그인이 필요합니다. 로그인 페이지로 이동 중입니다...</p>
      </div>
    );
  }

  const roleLabel =
    user.role === "ADMIN"
      ? "관리자"
      : user.role === "INSTRUCTOR"
      ? "교원"
      : "학생";

  // 비밀번호 변경 제출 핸들러
  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    setPwError("");
    setPwSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPwError("모든 비밀번호 입력란을 채워 주세요.");
      return;
    }

    if (newPassword.length < 8) {
      setPwError("새 비밀번호는 8자 이상이어야 합니다.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPwError("새 비밀번호와 확인이 일치하지 않습니다.");
      return;
    }

    if (newPassword === currentPassword) {
      setPwError("현재 비밀번호와 다른 새 비밀번호를 사용해 주세요.");
      return;
    }

    setPwLoading(true);
    try {
      const res = await fetch("/api/profile/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          loginId: user.login_id, // ✅ 현재 로그인한 유저의 학번
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!data.ok) {
        setPwError(data.message || "비밀번호 변경에 실패했습니다.");
        return;
      }

      setPwSuccess("비밀번호가 성공적으로 변경되었습니다.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      setPwError("서버와 통신 중 오류가 발생했습니다.");
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      <h1 className="page-title">내 정보</h1>
      <p className="page-subtitle">
        SmartAttend 출석 관리 시스템에서 사용하는 계정 정보를 확인할 수
        있습니다.
      </p>

      {/* 기본 정보 */}
      <section className="card">
        <h2 className="card-title">기본 정보</h2>

        <div className="profile-grid">
          <div className="form-field">
            <label>이름</label>
            <input type="text" value={user.name} readOnly />
          </div>

          <div className="form-field">
            <label>역할</label>
            <input type="text" value={roleLabel} readOnly />
          </div>

          <div className="form-field">
            <label>학번 / 사번</label>
            <input type="text" value={user.login_id} readOnly />
          </div>

          <div className="form-field">
            <label>학과</label>
            <input type="text" value={user.department || "미입력"} readOnly />
          </div>

          <div className="form-field">
            <label>이메일</label>
            <input type="email" value={user.email} readOnly />
          </div>
        </div>

        <p className="profile-note">
          기본 정보는 학교 시스템과 연동되며, 직접 수정할 수 없습니다.
        </p>
      </section>

      {/* 비밀번호 변경 */}
      <section className="card mt-24">
        <h2 className="card-title">비밀번호 변경</h2>
        <p className="card-desc">
          현재 비밀번호를 확인한 후, 새 비밀번호로 변경할 수 있습니다.
        </p>

        <form className="login-form" onSubmit={handleChangePassword}>
          <div className="form-field">
            <label htmlFor="currentPassword">현재 비밀번호</label>
            <input
              id="currentPassword"
              type="password"
              placeholder="현재 비밀번호를 입력하세요"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label htmlFor="newPassword">새 비밀번호</label>
            <input
              id="newPassword"
              type="password"
              placeholder="8자 이상 새 비밀번호"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label htmlFor="confirmPassword">새 비밀번호 확인</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="한 번 더 입력하세요"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {pwError && <p className="form-error">{pwError}</p>}
          {pwSuccess && <p className="form-success">{pwSuccess}</p>}

          <button
            type="submit"
            className="btn btn-primary login-submit"
            disabled={pwLoading}
          >
            {pwLoading ? "변경 중..." : "비밀번호 변경"}
          </button>
        </form>
      </section>
    </div>
  );
}

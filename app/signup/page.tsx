// app/signup/page.tsx
"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    loginId: "",
    name: "",
    email: "",
    department: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!form.loginId.trim() || !form.name.trim()) {
      setErrorMsg("학번과 이름은 필수입니다.");
      return;
    }
    if (!form.email.trim()) {
      setErrorMsg("이메일은 필수입니다.");
      return;
    }
    if (!form.password || form.password.length < 8) {
      setErrorMsg("비밀번호는 8자 이상으로 설정해 주세요.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setErrorMsg("비밀번호가 서로 일치하지 않습니다.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          loginId: form.loginId,
          name: form.name,
          email: form.email,
          department: form.department,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!data.ok) {
        setErrorMsg(data.message || "회원가입에 실패했습니다.");
        return;
      }

      setSuccessMsg("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.");
      setTimeout(() => {
        router.push("/login");
      }, 1200);
    } catch (err) {
      console.error(err);
      setErrorMsg("서버와 통신 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="card auth-card">
        <h1 className="page-title">회원가입</h1>
        <p className="page-subtitle">
          SmartAttend 출석 관리 시스템에서 사용할 기본 정보를 입력해 주세요.
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
          {/* 학번 */}
          <div className="form-field">
            <label htmlFor="loginId">학번</label>
            <input
              id="loginId"
              type="text"
              placeholder="예: 202312345"
              value={form.loginId}
              onChange={(e) => handleChange("loginId", e.target.value)}
            />
          </div>

          {/* 이름 */}
          <div className="form-field">
            <label htmlFor="name">이름</label>
            <input
              id="name"
              type="text"
              placeholder="이름을 입력하세요"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>

          {/* 이메일 (필수) */}
          <div className="form-field">
            <label htmlFor="email">이메일</label>
            <input
              id="email"
              type="email"
              placeholder="학교 이메일 등"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>

          {/* 학과 (선택) */}
          <div className="form-field">
            <label htmlFor="department">학과 (선택)</label>
            <input
              id="department"
              type="text"
              placeholder="예: 컴퓨터공학과"
              value={form.department}
              onChange={(e) => handleChange("department", e.target.value)}
            />
          </div>

          {/* 비밀번호 */}
          <div className="form-field">
            <label htmlFor="password">비밀번호</label>
            <input
              id="password"
              type="password"
              placeholder="8자 이상 비밀번호"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
            />
          </div>

          {/* 비밀번호 확인 */}
          <div className="form-field">
            <label htmlFor="confirmPassword">비밀번호 확인</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="비밀번호를 한 번 더 입력"
              value={form.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
            />
          </div>

          {errorMsg && <p className="form-error">{errorMsg}</p>}
          {successMsg && <p className="form-success">{successMsg}</p>}

          <button
            type="submit"
            className="btn btn-primary login-submit"
            disabled={loading}
          >
            {loading ? "회원가입 중..." : "회원가입"}
          </button>
        </form>

        <p className="auth-helper-text">
          이미 계정이 있으신가요?{" "}
          <a href="/login" className="link">
            로그인하기
          </a>
        </p>
      </div>
    </div>
  );
}

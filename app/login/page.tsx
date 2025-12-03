"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!studentId.trim() || !password) {
      setErrorMsg("학번과 비밀번호를 모두 입력해 주세요.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ studentId, password }),
      });

      const data = await res.json();

      if (!data.ok) {
        setErrorMsg(data.message || "로그인에 실패했습니다.");
        return;
      }

      // 역할에 따라 대시보드로 이동
      router.push(data.redirectTo || "/student/dashboard");
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
        <h1 className="page-title">SmartAttend 로그인</h1>
        <p className="page-subtitle">
          학번(또는 사번)과 비밀번호를 입력하여 출석 관리 시스템에 접속합니다.
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="studentId">학번</label>
            <input
              id="studentId"
              type="text"
              placeholder="예: 202312345"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label htmlFor="password">비밀번호</label>
            <input
              id="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {errorMsg && <p className="form-error">{errorMsg}</p>}

          <button
            type="submit"
            className="btn btn-primary login-submit"
            disabled={loading}
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <p className="auth-helper-text">
          아직 계정이 없으신가요?{" "}
          <a href="/signup" className="link">
            회원가입하기
          </a>
        </p>
      </div>
    </div>
  );
}

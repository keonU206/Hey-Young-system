"use client";

import Link from "next/link";
import { FormEvent } from "react";

export default function LoginPage() {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO: 나중에 여기서 학번 기반으로 로그인 API 호출
  };

  return (
    <div className="login-root">
      <div className="login-card">
        <h2 className="login-title">로그인</h2>
        <p className="login-subtitle">
          SmartAttend 출석 관리 시스템에 접속하려면
          <br />
          본인의 <strong>학번</strong>으로 로그인해주세요.
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="studentId">학번</label>
            <input
              id="studentId"
              name="studentId"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="예: 202312345"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="password">비밀번호</label>
            <input
              id="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              required
            />
          </div>

          <p className="login-help">
            현재 버전에서는 <strong>학번만으로 로그인</strong>합니다.
            <br />
            학번에 따라 학생 / 교원 / 관리자 권한이 구분됩니다.
          </p>

          <button type="submit" className="btn btn-primary login-submit">
            로그인
          </button>
        </form>

        <div className="login-footer">
          <Link href="/" className="login-link">
            ← 메인으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}

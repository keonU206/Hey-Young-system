"use client";

import { FormEvent, useState } from "react";

export default function InstructorNoticesPage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO: 나중에 공지 생성 API 호출
    alert("공지사항이 작성되었습니다.");
  };

  return (
    <div>
      <h1 className="page-title">공지 / 알림</h1>
      <p className="page-subtitle">
        수강생들에게 전달할 공지사항을 등록하고, 최근 공지 목록을 확인합니다.
      </p>

      <section className="card">
        <h2 className="card-title">새 공지 작성</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-field">
            <label htmlFor="course">대상 과목</label>
            <select id="course" required>
              <option value="">과목을 선택하세요</option>
              <option value="webprog">웹서버프로그래밍</option>
              <option value="os">운영체제</option>
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="title">제목</label>
            <input
              id="title"
              type="text"
              placeholder="예: 7주차 수업 안내"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="body">내용</label>
            <textarea
              id="body"
              rows={4}
              placeholder="공지 내용을 입력하세요."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary login-submit">
            공지 등록
          </button>
        </form>
      </section>

      <section className="card mt-24">
        <h2 className="card-title">최근 공지</h2>
        <ul className="simple-list">
          <li>웹서버프로그래밍 – 7주차는 온라인으로 진행됩니다. (4/15)</li>
          <li>운영체제 – 6주차 보강 일정 안내 (4/12)</li>
        </ul>
      </section>
    </div>
  );
}

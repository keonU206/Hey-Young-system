"use client";

import { FormEvent, useState } from "react";

export default function StudentExcusesPage() {
  const [reason, setReason] = useState("");
  const [type, setType] = useState<"공결" | "이의제기">("공결");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO: 나중에 파일 포함해서 공결/이의 신청 API 호출
    alert(`[${type}] 신청이 제출되었습니다.`);
  };

  return (
    <div>
      <h1 className="page-title">공결 / 이의 신청</h1>
      <p className="page-subtitle">
        병결, 공결 사유를 제출하거나 출석 정정이 필요한 경우 이의제기를
        등록합니다.
      </p>

      <section className="card">
        <h2 className="card-title">신청 작성</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-field">
            <label htmlFor="type">신청 종류</label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as any)}
            >
              <option value="공결">공결 신청</option>
              <option value="이의제기">출석 이의제기</option>
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="session">대상 수업</label>
            <select id="session" required>
              <option value="">수업을 선택하세요</option>
              <option value="web-7">웹서버프로그래밍 · 7주차 (4/17)</option>
              <option value="os-7">운영체제 · 7주차 (4/15)</option>
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="reason">사유</label>
            <textarea
              id="reason"
              rows={4}
              placeholder="예: 고열로 인한 병결, 증빙 서류 제출 예정입니다."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="file">증빙 파일 (선택)</label>
            <input id="file" type="file" />
          </div>

          <button type="submit" className="btn btn-primary login-submit">
            신청 제출
          </button>
        </form>
      </section>

      <section className="card mt-24">
        <h2 className="card-title">나의 신청 내역</h2>
        <table className="simple-table">
          <thead>
            <tr>
              <th>종류</th>
              <th>과목 / 주차</th>
              <th>상태</th>
              <th>교원 코멘트</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>공결</td>
              <td>운영체제 · 7주차</td>
              <td>
                <span className="badge badge-info">승인</span>
              </td>
              <td>병원 진단서 확인했습니다.</td>
            </tr>
            <tr>
              <td>이의제기</td>
              <td>웹서버프로그래밍 · 5주차</td>
              <td>
                <span className="badge badge-muted">검토 중</span>
              </td>
              <td>-</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}

"use client";

import { useState } from "react";

const dummyStudents = [
  { id: 1, name: "김철수", number: "202312345", status: "출석" },
  { id: 2, name: "이영희", number: "202312346", status: "미체크" },
  { id: 3, name: "박민수", number: "202312347", status: "지각" },
];

export default function InstructorSessionManagePage() {
  const [sessionStatus, setSessionStatus] = useState<
    "대기" | "진행 중" | "마감"
  >("대기");

  return (
    <div>
      <h1 className="page-title">출석 관리</h1>
      <p className="page-subtitle">
        웹서버프로그래밍 · 7주차 / 공학관 301 / 3교시
      </p>

      <section className="card">
        <h2 className="card-title">출석 세션 상태</h2>
        <div className="stats-row">
          <div className="stat">
            <span className="stat-label">현재 상태</span>
            <span className="stat-value">
              {sessionStatus === "대기" && "대기"}
              {sessionStatus === "진행 중" && "진행 중"}
              {sessionStatus === "마감" && "마감"}
            </span>
          </div>
        </div>

        <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
          <button
            className="btn btn-outline small"
            onClick={() => setSessionStatus("진행 중")}
          >
            출석 열기
          </button>
          <button
            className="btn btn-outline small"
            onClick={() => setSessionStatus("대기")}
          >
            일시정지
          </button>
          <button
            className="btn btn-primary small"
            onClick={() => setSessionStatus("마감")}
          >
            출석 마감
          </button>
        </div>
      </section>

      <section className="card mt-24">
        <h2 className="card-title">수강생 출석 현황</h2>
        <table className="simple-table">
          <thead>
            <tr>
              <th>학번</th>
              <th>이름</th>
              <th>상태</th>
              <th>수정</th>
            </tr>
          </thead>
          <tbody>
            {dummyStudents.map((s) => (
              <tr key={s.id}>
                <td>{s.number}</td>
                <td>{s.name}</td>
                <td>{s.status}</td>
                <td>
                  <select defaultValue={s.status}>
                    <option value="출석">출석</option>
                    <option value="지각">지각</option>
                    <option value="결석">결석</option>
                    <option value="공결">공결</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

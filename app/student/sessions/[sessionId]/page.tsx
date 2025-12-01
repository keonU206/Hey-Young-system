"use client";

import { FormEvent, useState } from "react";

export default function StudentSessionAttendPage() {
  const [mode] = useState<"전자출결" | "인증번호">("인증번호");
  const [code, setCode] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO: 나중에 여기서 출석 API 호출
    alert(`입력한 인증번호: ${code}`);
  };

  return (
    <div>
      <h1 className="page-title">출석하기</h1>
      <p className="page-subtitle">
        웹서버프로그래밍 · 5주차 / 공학관 301 · 3교시
      </p>

      <section className="card">
        <h2 className="card-title">출석 방식</h2>
        <p className="card-desc">
          이 수업은 <strong>{mode}</strong> 방식으로 출석을 진행합니다.
        </p>
        {/* mode가 전자출결일 때 / 인증번호일 때 UI 분기 */}
        ...
      </section>
    </div>
  );
}

export default function InstructorDashboardPage() {
  return (
    <div>
      <h1 className="page-title">교원 대시보드</h1>
      <p className="page-subtitle">
        오늘 강의와 출석 진행 상태를 확인할 수 있습니다.
      </p>

      <div className="grid-2">
        <section className="card">
          <h2 className="card-title">오늘의 강의 요약</h2>
          <p className="card-desc">
            실제 구현 시, 오늘 강의 수 / 진행 중 / 마감된 세션 수 등을
            표시합니다.
          </p>
          <div className="stats-row">
            <div className="stat">
              <span className="stat-label">오늘 강의</span>
              <span className="stat-value">2</span>
            </div>
            <div className="stat">
              <span className="stat-label">진행 중</span>
              <span className="stat-value">1</span>
            </div>
            <div className="stat">
              <span className="stat-label">마감</span>
              <span className="stat-value">1</span>
            </div>
          </div>
        </section>

        <section className="card">
          <h2 className="card-title">처리할 요청</h2>
          <ul className="simple-list">
            <li>공결 신청 3건 (웹서버프로그래밍 2, 운영체제 1)</li>
            <li>출석 정정 이의제기 1건</li>
            <li>이번 주 과제 미제출 학생 4명</li>
          </ul>
        </section>
      </div>

      <section className="card mt-24">
        <h2 className="card-title">오늘의 강의</h2>
        <table className="simple-table">
          <thead>
            <tr>
              <th>시간</th>
              <th>과목</th>
              <th>강의실</th>
              <th>출석 세션</th>
              <th>액션</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1교시</td>
              <td>웹서버프로그래밍</td>
              <td>공학관 301</td>
              <td>
                <span className="badge badge-live">진행 중</span>
              </td>
              <td>
                <button className="btn btn-outline small">출석 관리</button>
              </td>
            </tr>
            <tr>
              <td>3교시</td>
              <td>운영체제</td>
              <td>공학관 205</td>
              <td>
                <span className="badge badge-muted">대기</span>
              </td>
              <td>
                <button className="btn btn-outline small">출석 열기</button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}

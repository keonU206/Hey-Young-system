export default function StudentDashboardPage() {
  return (
    <div>
      <h1 className="page-title">학생 대시보드</h1>
      <p className="page-subtitle">
        오늘 수업과 출석 상태를 한눈에 확인할 수 있습니다.
      </p>

      <div className="grid-2">
        <section className="card">
          <h2 className="card-title">오늘의 출석 요약</h2>
          <p className="card-desc">
            실제 구현 시, 오늘 수업 수 / 출석 완료 / 미체크 / 지각 등을
            표시합니다.
          </p>
          <div className="stats-row">
            <div className="stat">
              <span className="stat-label">오늘 수업</span>
              <span className="stat-value">3</span>
            </div>
            <div className="stat">
              <span className="stat-label">출석 완료</span>
              <span className="stat-value">2</span>
            </div>
            <div className="stat">
              <span className="stat-label">미체크</span>
              <span className="stat-value highlight">1</span>
            </div>
          </div>
        </section>

        <section className="card">
          <h2 className="card-title">알림</h2>
          <ul className="simple-list">
            <li>웹서버프로그래밍 - 5주차 공결 신청 결과가 나왔습니다.</li>
            <li>운영체제 - 7주차 결석 2회 누적, 주의가 필요합니다.</li>
            <li>데이터베이스 - 과제 마감 D-1입니다.</li>
          </ul>
        </section>
      </div>

      <section className="card mt-24">
        <h2 className="card-title">오늘의 수업</h2>
        <table className="simple-table">
          <thead>
            <tr>
              <th>시간</th>
              <th>과목</th>
              <th>강의실</th>
              <th>출석 상태</th>
              <th>액션</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1교시</td>
              <td>웹서버프로그래밍</td>
              <td>공학관 301</td>
              <td>
                <span className="badge badge-success">출석</span>
              </td>
              <td>-</td>
            </tr>
            <tr>
              <td>3교시</td>
              <td>운영체제</td>
              <td>공학관 205</td>
              <td>
                <span className="badge badge-muted">미체크</span>
              </td>
              <td>
                <button className="btn btn-outline small">출석하기</button>
              </td>
            </tr>
            <tr>
              <td>5교시</td>
              <td>데이터베이스</td>
              <td>공학관 210</td>
              <td>
                <span className="badge badge-success">출석</span>
              </td>
              <td>-</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}

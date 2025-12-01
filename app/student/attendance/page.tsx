export default function StudentAttendancePage() {
  return (
    <div>
      <h1 className="page-title">출석 현황</h1>
      <p className="page-subtitle">
        과목별 출석률과 주차별 출석 상태를 요약해서 보여줍니다.
      </p>

      <div className="grid-2">
        <section className="card">
          <h2 className="card-title">과목별 출석률</h2>
          <table className="simple-table">
            <thead>
              <tr>
                <th>과목명</th>
                <th>출석률</th>
                <th>출석/지각/결석/공결</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>웹서버프로그래밍</td>
                <td>92%</td>
                <td>11 / 1 / 0 / 1</td>
              </tr>
              <tr>
                <td>운영체제</td>
                <td>80%</td>
                <td>8 / 2 / 2 / 0</td>
              </tr>
              <tr>
                <td>데이터베이스</td>
                <td>100%</td>
                <td>12 / 0 / 0 / 0</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="card">
          <h2 className="card-title">주의가 필요한 과목</h2>
          <ul className="simple-list">
            <li>운영체제 – 결석 2회, 지각 2회</li>
            <li>웹서버프로그래밍 – 지각 1회</li>
          </ul>
        </section>
      </div>

      <section className="card mt-24">
        <h2 className="card-title">최근 수업 출석 기록</h2>
        <table className="simple-table">
          <thead>
            <tr>
              <th>날짜</th>
              <th>과목</th>
              <th>주차</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>4/15</td>
              <td>운영체제</td>
              <td>7주차</td>
              <td>
                <span className="badge badge-muted">결석</span>
              </td>
            </tr>
            <tr>
              <td>4/17</td>
              <td>웹서버프로그래밍</td>
              <td>7주차</td>
              <td>
                <span className="badge badge-success">출석</span>
              </td>
            </tr>
            <tr>
              <td>4/18</td>
              <td>데이터베이스</td>
              <td>7주차</td>
              <td>
                <span className="badge badge-success">출석</span>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}
